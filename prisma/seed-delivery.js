import { prisma } from '../lib/prisma.js';

async function seedDeliveryMissions() {
  console.log('📦 Génération de missions de test pour les livreurs...');

  try {
    // 1. Trouver un utilisateur livreur
    const livreurUser = await prisma.user.findFirst({
      where: { role: 'LIVREUR' }
    });

    if (!livreurUser) {
      console.log('⚠️ Aucun utilisateur livreur trouvé. Veuillez en créer un d\'abord.');
      return;
    }

    // S'assurer que le profil Livreur existe
    await prisma.livreur.upsert({
      where: { userId: livreurUser.id },
      update: {},
      create: {
        userId: livreurUser.id,
        status: 'ACTIF',
        vehicleType: 'MOTO',
        zone: 'Abidjan Sud'
      }
    });

    // 2. Trouver un acheteur et des produits pour créer des commandes de test
    const buyer = await prisma.user.findFirst({ where: { role: 'ACHETEUR' } });
    if (!buyer) return;

    // Créer une commande fictive
    const order = await prisma.order.create({
      data: {
        userId: buyer.id,
        status: 'PAID',
        subtotal: 15000,
        deliveryFee: 2500,
        total: 17500,
        paymentStatus: 'PAID'
      }
    });

    // 3. Créer des missions "WAITING"
    const missions = [
      {
        orderId: order.id,
        status: 'WAITING',
        pickupAddress: 'Boutique Cacao, Treichville',
        deliveryAddress: 'Riviera Palmeraie, Cocody',
        distanceKm: 12.5,
        estimatedTime: 35
      },
      {
        orderId: (await prisma.order.create({
          data: {
            userId: buyer.id,
            status: 'PAID',
            subtotal: 8000,
            deliveryFee: 1500,
            total: 9500,
            paymentStatus: 'PAID'
          }
        })).id,
        status: 'WAITING',
        pickupAddress: 'Marché d\'Adjamé',
        deliveryAddress: 'Plateau Dokui',
        distanceKm: 5.2,
        estimatedTime: 15
      }
    ];

    for (const m of missions) {
      await prisma.deliveryMission.create({ data: m });
    }

    console.log('✅ Missions de test créées avec succès !');
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

seedDeliveryMissions()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
