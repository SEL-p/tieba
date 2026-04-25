import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Lister les codes promo (Admin ou Vendeur pour les siens)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // Si on cherche un code spécifique (ex: lors du checkout)
    if (code) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!promo || !promo.isActive) {
        return NextResponse.json({ error: 'Code promo invalide' }, { status: 404 });
      }

      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
        return NextResponse.json({ error: 'Code promo expiré' }, { status: 400 });
      }

      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
        return NextResponse.json({ error: 'Limite d\'utilisation atteinte' }, { status: 400 });
      }

      return NextResponse.json(promo);
    }

    // Sinon lister les codes
    let where = {};
    if (session.user.role === 'VENDEUR') {
      where = { sellerId: session.user.id };
    } else if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const promos = await prisma.promoCode.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(promos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Créer un nouveau code promo
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VENDEUR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { code, type, value, minOrderAmount, maxDiscount, usageLimit, expiresAt } = data;

    const newPromo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        type: type || 'PERCENTAGE',
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        sellerId: session.user.role === 'VENDEUR' ? session.user.id : null,
      }
    });

    return NextResponse.json(newPromo);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce code promo existe déjà' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
