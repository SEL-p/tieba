import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = session.user.role === 'VENDEUR' 
      ? (await prisma.seller.findUnique({ where: { userId: session.user.id } }))?.id 
      : session.user.sellerId;

    if (!sellerId) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });

    const liveId = params.id;
    const body = await request.json();
    const { title, description, streamUrl, status, featuredProdId } = body;

    // Verify ownership
    const existing = await prisma.liveStream.findUnique({ where: { id: liveId } });
    if (!existing || existing.sellerId !== sellerId) {
      return NextResponse.json({ error: 'Live introuvable ou accès refusé' }, { status: 404 });
    }

    const updated = await prisma.liveStream.update({
      where: { id: liveId },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        streamUrl: streamUrl !== undefined ? streamUrl : undefined,
        status: status !== undefined ? status : undefined,
        featuredProdId: featuredProdId !== undefined ? (featuredProdId === '' ? null : featuredProdId) : undefined,
      },
      include: { product: true }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = session.user.role === 'VENDEUR' 
      ? (await prisma.seller.findUnique({ where: { userId: session.user.id } }))?.id 
      : session.user.sellerId;

    if (!sellerId) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });

    const liveId = params.id;

    // Verify ownership
    const existing = await prisma.liveStream.findUnique({ where: { id: liveId } });
    if (!existing || existing.sellerId !== sellerId) {
      return NextResponse.json({ error: 'Live introuvable ou accès refusé' }, { status: 404 });
    }

    await prisma.liveStream.delete({ where: { id: liveId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting livestream:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
