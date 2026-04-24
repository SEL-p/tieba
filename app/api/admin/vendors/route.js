import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all vendors
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const vendors = await prisma.seller.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Erreur API Admin Vendors:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH to update vendor verification status
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { sellerId, verified } = await request.json();

    if (!sellerId || typeof verified !== 'boolean') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: { verified },
    });

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error('Erreur Update Vendor:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
