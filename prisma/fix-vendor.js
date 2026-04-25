import { prisma } from '../lib/prisma.js';

async function fixVendor() {
  console.log('Correction du profil vendeur...');
  
  // 1. Trouver ou créer l'utilisateur principal (vous)
  let user = await prisma.user.findFirst({
    where: { role: 'VENDEUR' }
  });

  if (!user) {
    // Si aucun vendeur n'existe, on cherche n'importe quel utilisateur ou on en crée un
    user = await prisma.user.findFirst();
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'VENDEUR' }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: 'Vendeur Tieba',
          email: 'vendeur@tieba.ci',
          role: 'VENDEUR'
        }
      });
    }
  }

  // 2. Vérifier si un profil Seller existe pour cet utilisateur
  const seller = await prisma.seller.findUnique({
    where: { userId: user.id }
  });

  if (!seller) {
    await prisma.seller.create({
      data: {
        userId: user.id,
        businessName: 'Ma Boutique Tieba',
        category: 'Général',
        location: 'Abidjan',
        verified: true
      }
    });
    console.log('Profil Seller créé pour l\'utilisateur:', user.email);
  } else {
    console.log('Le profil Seller existe déjà pour:', user.email);
  }

  console.log('Succès : Le compte vendeur est maintenant correctement configuré.');
}

fixVendor()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
