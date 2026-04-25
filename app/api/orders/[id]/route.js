import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        items: { include: { product: { include: { seller: true } } } },
        mission: {
          include: {
            livreur: {
              select: {
                id: true,
                vehicleType: true,
                vehiclePlate: true,
                rating: true,
                user: { select: { name: true, phone: true } }
              }
            }
          }
        }
      }
    });

    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    // Security: Only owner or admin or livreur or seller can see
    const isOwner = order.userId === session.user.id;
    const isLivreur = order.mission?.livreurId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';
    // Check if seller
    const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
    const isSeller = order.items.some(item => item.product.sellerId === seller?.id);

    if (!isOwner && !isLivreur && !isAdmin && !isSeller) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
