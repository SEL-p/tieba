import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = session.user.role === 'VENDEUR' 
      ? (await prisma.seller.findUnique({ where: { userId: session.user.id } }))?.id 
      : session.user.sellerId;

    if (!sellerId) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });

    const liveStreams = await prisma.liveStream.findMany({
      where: { sellerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(liveStreams);
  } catch (error) {
    console.error('Error fetching livestreams:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = session.user.role === 'VENDEUR' 
      ? (await prisma.seller.findUnique({ where: { userId: session.user.id } }))?.id 
      : session.user.sellerId;

    if (!sellerId) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });

    const body = await request.json();
    const { title, description, streamUrl, status, featuredProdId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 });
    }

    const liveStream = await prisma.liveStream.create({
      data: {
        sellerId,
        title,
        description,
        streamUrl,
        status: status || 'SCHEDULED',
        featuredProdId: featuredProdId || null,
        scheduledFor: new Date()
      },
      include: { product: true }
    });

    return NextResponse.json(liveStream, { status: 201 });
  } catch (error) {
    console.error('Error creating livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
