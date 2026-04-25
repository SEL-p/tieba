const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.challenge.createMany({
    data: [
      { title: 'Super Sprinter', description: 'Réalisez 5 livraisons ce jour', targetCount: 5, rewardAmount: 1000 },
      { title: 'Livreur d\'Elite', description: 'Réalisez 20 livraisons cette semaine', targetCount: 20, rewardAmount: 5000 },
      { title: 'Conquérant d\'Abidjan', description: 'Livrez dans 3 communes différentes', targetCount: 3, rewardAmount: 2000 },
    ]
  });
  console.log('Challenges seeded!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
