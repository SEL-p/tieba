import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { calculateFees } from '@/lib/fees';

// GET: Récupérer les missions (disponibles ou assignées)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'LIVREUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id }
    });

    if (!livreur) return NextResponse.json({ error: 'Profil livreur introuvable' }, { status: 404 });

    if (type === 'available') {
      if (!livreur.isVerified) {
        return NextResponse.json({ error: 'Compte non vérifié', isVerified: false }, { status: 403 });
      }

      const missions = await prisma.deliveryMission.findMany({
        where: { status: 'WAITING' },
        include: { 
          order: {
            include: {
              items: {
                include: {
                  product: {
                    include: { seller: true }
                  }
                }
              }
            }
          } 
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(missions);
    }

    const missions = await prisma.deliveryMission.findMany({
      where: { livreurId: livreur.id },
      include: { order: true },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH: Mettre à jour le statut d'une mission (Accepter, Ramassé, Livré)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'LIVREUR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const { missionId, action, photoUrl, lat, lng } = body;

    const livreur = await prisma.livreur.findUnique({
      where: { userId: session.user.id }
    });

    if (!livreur) return NextResponse.json({ error: 'Profil livreur introuvable' }, { status: 404 });

    const mission = await prisma.deliveryMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });

    // Security check: Ensure the mission belongs to this livreur if it's already accepted
    if (mission.livreurId && mission.livreurId !== livreur.id) {
      return NextResponse.json({ error: 'Cette mission appartient à un autre livreur' }, { status: 403 });
    }

    let updateData = {};
    
    switch (action) {
      case 'ACCEPT':
        if (mission.status !== 'WAITING') return NextResponse.json({ error: 'Mission déjà prise' }, { status: 400 });
        await prisma.$transaction([
          prisma.deliveryMission.update({
            where: { id: missionId },
            data: { status: 'ACCEPTED', livreurId: livreur.id }
          }),
          prisma.order.update({
            where: { id: mission.orderId },
            data: { status: 'PREPARING' }
          })
        ]);
        break;
      
      case 'PICKUP':
        if (mission.status !== 'ACCEPTED') return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
        await prisma.$transaction([
          prisma.deliveryMission.update({
            where: { id: missionId },
            data: { status: 'DELIVERING', pickupPhoto: photoUrl }
          }),
          prisma.order.update({
            where: { id: mission.orderId },
            data: { status: 'IN_TRANSIT' }
          })
        ]);
        break;
      
      case 'COMPLETE':
        if (mission.status !== 'DELIVERING') return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
        
        // --- VÉRIFICATION OTP ---
        if (mission.otpCode && body.otp !== mission.otpCode) {
          return NextResponse.json({ error: 'Code OTP invalide' }, { status: 403 });
        }
        
        await prisma.$transaction(async (tx) => {
          // 1. Update Mission
          await tx.deliveryMission.update({
            where: { id: missionId },
            data: { 
              status: 'COMPLETED', 
              deliveryPhoto: photoUrl,
              completedAt: new Date()
            }
          });

          // 2. Update Order Status
          await tx.order.update({
            where: { id: mission.orderId },
            data: { status: 'DELIVERED' }
          });

          // 3. Update Livreur Earnings
          const order = await tx.order.findUnique({ where: { id: mission.orderId } });
          if (order) {
            const fees = calculateFees(order.subtotal, order.deliveryFee);
            const netGain = fees.livreurEarnings;
            await tx.livreur.update({
              where: { id: livreur.id },
              data: {
                totalEarnings: { increment: netGain },
                balance: { increment: netGain }
              }
            });
          }
        });
        break;

      default:
        return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

