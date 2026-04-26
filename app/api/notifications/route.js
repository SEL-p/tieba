import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const { id } = await request.json();
    
    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId: session.user.id },
        data: { read: true }
      });
    } else {
      await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Utility to create notification (internal use in other APIs)
export async function createNotification(userId, title, message, type, link = null) {
  return await prisma.notification.create({
    data: { userId, title, message, type, link }
  });
}
