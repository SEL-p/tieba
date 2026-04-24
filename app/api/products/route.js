import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const sellerId = searchParams.get('sellerId');
    const featured = searchParams.get('featured');

    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (sellerId) where.sellerId = sellerId;
    
    // In a real app, 'featured' might be a separate flag or based on sales/rating
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'VENDEUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.user.id }
    });

    if (!seller) {
      return NextResponse.json({ error: 'Vendeur introuvable' }, { status: 404 });
    }

    const body = await request.json();

    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        image: body.image || '/placeholder-product.png',
        categoryId: body.categoryId,
        sellerId: seller.id,
        inStock: body.inStock !== undefined ? body.inStock : true,
        minOrder: body.minOrder || null,
        location: body.location || seller.location || 'Abidjan',
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
