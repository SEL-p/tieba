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

    const challenges = await prisma.challenge.findMany({
      where: { active: true }
    });

    // For each challenge, check if user has completed it
    const livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id }
    });

    if (!livreur) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });

    // Get completed challenges for this livreur
    const completedBonuses = await prisma.bonus.findMany({
      where: { livreurId: livreur.id, type: 'CHALLENGE' }
    });

    // Count recent deliveries for this livreur to show progress
    const deliveryCount = await prisma.deliveryMission.count({
      where: { livreurId: livreur.id, status: 'COMPLETED' }
    });

    const challengesWithProgress = challenges.map(c => ({
      ...c,
      currentCount: deliveryCount, // Simplification: count all deliveries for now
      isCompleted: completedBonuses.some(b => b.description?.includes(c.id))
    }));

    return NextResponse.json(challengesWithProgress);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
