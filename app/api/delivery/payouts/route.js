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

    const livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id }
    });

    if (!livreur) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });

    const payouts = await prisma.payout.findMany({
      where: { livreurId: livreur.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(payouts);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'LIVREUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { amount, method, phoneNumber } = await request.json();

    const livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id }
    });

    if (!livreur) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 });

    if (amount < 1000) return NextResponse.json({ error: 'Montant minimum 1000 FCFA' }, { status: 400 });
    if (livreur.balance < amount) return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 });

    const payout = await prisma.$transaction(async (tx) => {
      // 1. Create payout record
      const newPayout = await tx.payout.create({
        data: {
          livreurId: livreur.id,
          amount: parseFloat(amount),
          method,
          phoneNumber,
          status: 'PENDING'
        }
      });

      // 2. Deduct from balance
      await tx.livreur.update({
        where: { id: livreur.id },
        data: { balance: { decrement: parseFloat(amount) } }
      });

      return newPayout;
    });

    return NextResponse.json(payout);
  } catch (error) {
    console.error('Payout error:', error);
    return NextResponse.json({ error: 'Erreur lors de la demande de retrait' }, { status: 500 });
  }
}
