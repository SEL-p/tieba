import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const requests = await prisma.sourcingRequest.findMany({
      where: { status: 'OPEN' },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sourcing requests' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const body = await req.json();
    const { productName, category, quantity, budget, details, location, deadline } = body;

    const newRequest = await prisma.sourcingRequest.create({
      data: {
        userId: session.user.id,
        productName,
        category,
        quantity,
        budget: budget ? parseFloat(budget) : null,
        details,
        location,
        deadline: new Date(deadline),
      }
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Sourcing create error:', error);
    return NextResponse.json({ error: 'Failed to create sourcing request' }, { status: 500 });
  }
}
