import { prisma } from '../lib/prisma.js';

const categories = [
  // B2C & B2B Classic
  { name: 'Électronique', icon: 'Cpu', color: '#3b82f6' },
  { name: 'Mode & Beauté', icon: 'Scissors', color: '#ec4899' },
  { name: 'Maison & Jardin', icon: 'Home', color: '#10b981' },
  { name: 'Sport & Loisirs', icon: 'Activity', color: '#f59e0b' },
  
  // B2B & Sourcing Côte d'Ivoire Spec
  { name: 'Agricole & Elevage', icon: 'Sprout', color: '#059669' },
  { name: 'Textile & Pagnes', icon: 'Palette', color: '#7c3aed' },
  { name: 'Alimentation & Boissons', icon: 'Soup', color: '#ea580c' },
  { name: 'Construction & BTP', icon: 'Briefcase', color: '#4b5563' },
  { name: 'Machines Industrielles', icon: 'Settings', color: '#dc2626' },
  { name: 'Automobile & Transport', icon: 'Truck', color: '#2563eb' },
  { name: 'Emballage & Impression', icon: 'Box', color: '#6366f1' },
  { name: 'Énergie & Solaire', icon: 'Zap', color: '#facc15' },
  { name: 'Produits Chimiques', icon: 'FlaskConical', color: '#db2777' },
  { name: 'Fournitures de Bureau', icon: 'PenTool', color: '#475569' },
  { name: 'Artisanat & Déco', icon: 'Brush', color: '#92400e' }
];

async function seed() {
  console.log('Seed: Nettoyage et ajout des catégories...');
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat
    });
  }
  
  console.log('Seed: Catégories ajoutées avec succès !');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
