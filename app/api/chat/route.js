import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) return NextResponse.json({ error: 'orderId requis' }, { status: 400 });

    // Security: Check if user is part of the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { mission: true, items: { include: { product: true } } }
    });

    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    const isOwner = order.userId === session.user.id;
    const isLivreur = order.mission?.livreurId === session.user.id;
    
    // Check if seller
    const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
    const isSeller = order.items.some(item => item.product.sellerId === seller?.id);

    if (!isOwner && !isLivreur && !isSeller && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { orderId: orderId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { orderId, content } = await request.json();

    if (!orderId || !content) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });

    const message = await prisma.chatMessage.create({
      data: { orderId, content, senderId: session.user.id }
    });

    // Notify other participants
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { mission: true, items: { include: { product: { include: { seller: true } } } } }
    });

    if (order) {
      const participants = new Set();
      if (order.userId !== session.user.id) participants.add(order.userId);
      if (order.mission?.livreurId && order.mission.livreurId !== session.user.id) {
        const livreur = await prisma.livreur.findUnique({ where: { id: order.mission.livreurId } });
        if (livreur) participants.add(livreur.userId);
      }
      
      // Get all unique sellers for the items
      for (const item of order.items) {
        if (item.product.seller.userId !== session.user.id) {
          participants.add(item.product.seller.userId);
        }
      }

      for (const userId of participants) {
        await prisma.notification.create({
          data: {
            userId,
            title: 'Nouveau message',
            message: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            type: 'CHAT',
            link: `/suivi/${orderId}` // Simplification: point to order tracking/dashboard
          }
        });
      }
    }

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
