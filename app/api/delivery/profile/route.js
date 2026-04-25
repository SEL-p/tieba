import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'LIVREUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    let livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id },
      select: {
        status: true,
        vehicleType: true,
        vehiclePlate: true,
        phone: true,
        zone: true,
        rating: true,
        totalEarnings: true,
        balance: true,
        isVerified: true,
        referralCode: true,
        idCardUrl: true,
        licenseUrl: true,
        vehicleDocUrl: true
      }
    });

    if (!livreur) {
      // Auto-create profile if missing for a user with LIVREUR role
      livreur = await prisma.livreur.create({
        data: {
          userId: session.user.id,
          status: 'ACTIF',
          vehicleType: 'MOTO',
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        },
        select: {
          id: true,
          status: true,
          vehicleType: true,
          vehiclePlate: true,
          phone: true,
          zone: true,
          rating: true,
          totalEarnings: true,
          balance: true,
          isVerified: true,
          referralCode: true,
          idCardUrl: true,
          licenseUrl: true,
          vehicleDocUrl: true
        }
      });
    }

    // --- LOGIQUE AUTOMATIQUE DE STATUT ---
    // On récupère le nombre de missions en cours pour ce livreur
    const activeMissionsCount = await prisma.deliveryMission.count({
      where: {
        livreur: { userId: session.user.id },
        status: { in: ['ACCEPTED', 'PICKING_UP', 'DELIVERING'] }
      }
    });

    let autoStatus = activeMissionsCount > 0 ? 'OCCUPÉ' : 'ACTIF';

    // Mise à jour en base pour que le statut soit "réel"
    if (livreur.status !== autoStatus) {
      await prisma.livreur.update({
        where: { userId: session.user.id },
        data: { status: autoStatus }
      });
      livreur.status = autoStatus;
    }

    return NextResponse.json(livreur);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'LIVREUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { status, vehicleType, vehiclePlate, zone, phone } = body;

    const updated = await prisma.livreur.update({
      where: { userId: session.user.id },
      data: {
        status,
        vehicleType,
        vehiclePlate,
        zone,
        phone
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
