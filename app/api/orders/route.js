import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Récupérer les commandes
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = session.user.role;
    const userId = session.user.id;

    let orders = [];

    if (role === 'ADMIN') {
      orders = await prisma.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } },
          mission: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === 'VENDEUR' || role === 'COMMERCIAL') {
      let sellerId = session.user.sellerId;
      if (role === 'VENDEUR') {
        const seller = await prisma.seller.findUnique({ where: { userId } });
        sellerId = seller?.id;
      }

      if (!sellerId) return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });

      // Find orders that contain products from this seller
      orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              product: { sellerId: sellerId }
            }
          }
        },
        include: {
          user: { select: { name: true, email: true } },
          items: { 
            where: { product: { sellerId: sellerId } },
            include: { product: true } 
          },
          mission: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // ACHETEUR
      orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { product: true } },
          mission: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH: Mettre à jour le statut d'une commande
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { orderId, status } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    // Authorization check
    if (session.user.role !== 'ADMIN') {
      if (session.user.role === 'VENDEUR' || session.user.role === 'COMMERCIAL') {
        // Check if seller owns at least one product in this order
        const sellerId = session.user.sellerId || (await prisma.seller.findUnique({ where: { userId: session.user.id } }))?.id;
        const ownsProduct = order.items.some(item => item.product.sellerId === sellerId);
        if (!ownsProduct) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
      } else {
        // Buyer can only cancel if PENDING
        if (order.userId !== session.user.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        if (status !== 'CANCELLED') return NextResponse.json({ error: 'Action non autorisée' }, { status: 403 });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
