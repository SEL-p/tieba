import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function createNewVendor() {
  const email = 'tieba-boutique@test.ci';
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Création du nouveau compte vendeur...');

  try {
    // 1. Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: 'Boutique Horizon',
        email: email,
        password: hashedPassword,
        role: 'VENDEUR',
        isActive: true
      }
    });

    // 2. Créer le profil vendeur (Seller)
    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        businessName: 'Horizon Sourcing CI',
        description: 'Spécialiste de l\'exportation de produits agricoles ivoiriens de haute qualité.',
        category: 'Agricole',
        location: 'San Pedro',
        verified: true,
        deliveryType: 'TIÉBA',
        subscriptionPlan: 'BUSINESS'
      }
    });

    console.log('-----------------------------------');
    console.log('SUCCÈS : Compte vendeur créé !');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('ID Boutique:', seller.id);
    console.log('-----------------------------------');
    
  } catch (error) {
    console.error('Erreur lors de la création:', error.message);
  }
}

createNewVendor()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
