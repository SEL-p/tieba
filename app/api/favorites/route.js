import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json([], { status: 200 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { product: true }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId: session.user.id, productId }
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ status: 'removed' });
    }

    const newFav = await prisma.favorite.create({
      data: { userId: session.user.id, productId }
    });

    return NextResponse.json({ status: 'added', data: newFav });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
