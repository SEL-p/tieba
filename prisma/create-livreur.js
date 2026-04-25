import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function createLivreurAccount() {
  const email = 'livreur-test@tieba.ci';
  const password = 'Livreur123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('🚀 Création du compte livreur de test...');

  try {
    // 1. Créer l'utilisateur avec le rôle LIVREUR
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {},
      create: {
        name: 'Moussa Le Livreur',
        email: email,
        password: hashedPassword,
        role: 'LIVREUR',
        isActive: true
      }
    });

    // 2. Créer le profil livreur associé
    const livreur = await prisma.livreur.upsert({
      where: { userId: user.id },
      update: {
        status: 'ACTIF'
      },
      create: {
        userId: user.id,
        status: 'ACTIF',
        vehicleType: 'MOTO',
        vehiclePlate: 'CI-1234-AB',
        phone: '+225 0707070707',
        zone: 'Abidjan (Cocody/Marcory)',
        isVerified: true
      }
    });

    console.log('-----------------------------------');
    console.log('✅ ACCÈS LIVREUR CRÉÉS AVEC SUCCÈS !');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('URL Dashboard:', 'http://localhost:3000/livreur/dashboard');
    console.log('-----------------------------------');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  }
}

createLivreurAccount()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
