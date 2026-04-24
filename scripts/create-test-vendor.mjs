import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const vendorUser = await prisma.user.upsert({
    where: { email: 'testvendeur@tieba.market' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Test Vendeur',
      email: 'testvendeur@tieba.market',
      password: hashedPassword,
      phone: '+2250102030405',
      role: 'VENDEUR',
    },
  });

  await prisma.seller.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Boutique Test',
      description: 'Boutique pour tester le tableau de bord vendeur.',
      verified: true,
      location: 'Abidjan',
      registrationNumber: 'CI-ABJ-TEST',
      productTypes: 'Divers',
      subscriptionPlan: 'STARTER',
      deliveryType: 'TIÉBA',
    },
  });

  console.log('Compte vendeur test cree avec succes !');
  console.log('Email: testvendeur@tieba.market');
  console.log('Mot de passe: password123');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
