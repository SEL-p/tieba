import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET Platform Config
export async function GET(request) {
  try {
    const config = await prisma.platformConfig.findUnique({
      where: { id: 'default' }
    });

    if (!config) {
      // Create default if not exists
      const newConfig = await prisma.platformConfig.create({
        data: { id: 'default' }
      });
      return NextResponse.json(newConfig);
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT Update Platform Config
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    
    // Using upsert in case it doesn't exist
    const updatedConfig = await prisma.platformConfig.upsert({
      where: { id: 'default' },
      update: {
        deliveryFeeBase: body.deliveryFeeBase !== undefined ? Number(body.deliveryFeeBase) : undefined,
        deliveryFeeKm: body.deliveryFeeKm !== undefined ? Number(body.deliveryFeeKm) : undefined,
        livreurShare: body.livreurShare !== undefined ? Number(body.livreurShare) : undefined,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
      create: {
        id: 'default',
        deliveryFeeBase: body.deliveryFeeBase !== undefined ? Number(body.deliveryFeeBase) : undefined,
        deliveryFeeKm: body.deliveryFeeKm !== undefined ? Number(body.deliveryFeeKm) : undefined,
        livreurShare: body.livreurShare !== undefined ? Number(body.livreurShare) : undefined,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      }
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
