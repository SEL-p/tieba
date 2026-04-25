import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PLATFORM_COMMISSION_RATE } from '@/lib/fees';
import { getCachedData, setCachedData, clearCache } from '@/lib/cache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const sellerId = searchParams.get('sellerId');
    const userId = searchParams.get('userId');
    const featured = searchParams.get('featured');

    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (sellerId) where.sellerId = sellerId;
    if (userId) {
      const seller = await prisma.seller.findUnique({ where: { userId } });
      if (seller) where.sellerId = seller.id;
      else where.sellerId = 'NOT_FOUND';
    }

    const cacheKey = `products_${categoryId || ''}_${sellerId || ''}_${userId || ''}`;
    const cached = getCachedData(cacheKey);
    if (cached) return NextResponse.json(cached);

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: {
          select: {
            businessName: true,
            verified: true,
            id: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    setCachedData(cacheKey, products);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'VENDEUR' && session.user.role !== 'COMMERCIAL')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let sellerId = null;
    let sellerLocation = 'Abidjan';

    if (session.user.role === 'VENDEUR') {
      const seller = await prisma.seller.findUnique({
        where: { userId: session.user.id }
      });
      if (!seller) return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });
      sellerId = seller.id;
      sellerLocation = seller.location || 'Abidjan';
    } else {
      sellerId = session.user.sellerId;
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    const body = await request.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Calculate final price with commission (e.g., if vendor wants 1000 and comm is 12%, price is 1120)
    const vendorPrice = parseFloat(body.price);
    const finalPrice = Math.round(vendorPrice * (1 + PLATFORM_COMMISSION_RATE));

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: finalPrice,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        image: body.image || '/placeholder-product.png',
        categoryId: body.categoryId,
        sellerId: sellerId,
        inStock: body.inStock !== undefined ? body.inStock : true,
        minOrder: body.minOrder || null,
        location: body.location || sellerLocation,
      },
    });

    // Invalider le cache des produits
    clearCache();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
