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

    let sellerId = null;
    
    if (session.user.role === 'VENDEUR') {
      const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
      sellerId = seller?.id;
    } else {
      const staff = await prisma.staffAccount.findUnique({ 
        where: { userId: session.user.id }
      });
      sellerId = staff?.sellerId;
    }

    if (!sellerId) return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!seller) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });

    return NextResponse.json(seller);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = null;
    if (session.user.role === 'VENDEUR') {
      const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
      sellerId = seller?.id;
    } else {
      const staff = await prisma.staffAccount.findUnique({ where: { userId: session.user.id } });
      sellerId = staff?.sellerId;
    }

    if (!sellerId) return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });

    const body = await request.json();
    const { facebookUrl, instagramUrl, tiktokUrl, pixelId } = body;

    const updated = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        facebookUrl: facebookUrl !== undefined ? facebookUrl : undefined,
        instagramUrl: instagramUrl !== undefined ? instagramUrl : undefined,
        tiktokUrl: tiktokUrl !== undefined ? tiktokUrl : undefined,
        pixelId: pixelId !== undefined ? pixelId : undefined,
      }
    });

    return NextResponse.json({ success: true, seller: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
