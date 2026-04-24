import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Tiéba Platform V1 data...');

  // 1. Create Categories
  const categoriesData = [
    { id: 'agricole', name: 'Agricole & Cacao', icon: '🌱', image: '/category_cocoa.png', color: '#16A34A' },
    { id: 'textile', name: 'Textile & Pagnes', icon: '👘', image: '/category_textile.png', color: '#7C3AED' },
    { id: 'alimentation', name: 'Alimentation', icon: '🍽️', image: '/category_food.png', color: '#DC2626' },
    { id: 'artisanat', name: 'Artisanat & Art', icon: '🎨', image: '/category_cocoa.png', color: '#D97706' },
    { id: 'bijoux', name: 'Bijoux & Accessoires', icon: '💎', image: '/category_jewelry.png', color: '#F59E0B' },
    { id: 'electronique', name: 'Électronique', icon: '📱', image: '/category_cashew.png', color: '#0EA5E9' },
    { id: 'beaute', name: 'Beauté & Santé', icon: '💄', image: '/category_food.png', color: '#EC4899' },
    { id: 'batiment', name: 'Bâtiment & BTP', icon: '🏗️', image: '/category_cashew.png', color: '#64748B' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // 2. Create Users for each role
  
  // ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tieba.market' },
    update: {},
    create: {
      name: 'Admin Tiéba',
      email: 'admin@tieba.market',
      role: 'ADMIN',
    },
  });

  // VENDEUR
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendeur@tieba.market' },
    update: {},
    create: {
      name: 'Yao Kouassi',
      email: 'vendeur@tieba.market',
      phone: '+2250707070707',
      role: 'VENDEUR',
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Kouassi Cacao & Co',
      description: 'Producteur de cacao certifié depuis 20 ans.',
      verified: true,
      location: 'Yamoussoukro',
      registrationNumber: 'CI-ABJ-03-2024-B12-12345',
      productTypes: 'Agricole, Cacao, Café',
      subscriptionPlan: 'BUSINESS',
      deliveryType: 'TIÉBA',
    },
  });

  // LIVREUR
  const deliveryUser = await prisma.user.upsert({
    where: { email: 'livreur@tieba.market' },
    update: {},
    create: {
      name: 'Moussa Traoré',
      email: 'livreur@tieba.market',
      phone: '+2250505050505',
      role: 'LIVREUR',
    },
  });

  await prisma.livreur.upsert({
    where: { userId: deliveryUser.id },
    update: {},
    create: {
      userId: deliveryUser.id,
      status: 'ACTIF',
      vehicleType: 'Moto',
      rating: 4.9,
    },
  });

  // 3. Create Products for the vendor
  const productsData = [
    {
      name: 'Cacao en Fèves Premium – Sac 50kg',
      price: 85000,
      originalPrice: 95000,
      image: '/category_cocoa.png',
      categoryId: 'agricole',
      sellerId: seller.id,
      rating: 4.8,
      reviewsCount: 324,
      salesCount: 1240,
      inStock: true,
      minOrder: '1 sac',
      location: 'Yamoussoukro',
      badge: 'Certifié Bio',
      badgeType: 'green',
    },
    {
      name: 'Noix de Cajou Brutes – Sac 25kg Export',
      price: 42000,
      image: '/category_cashew.png',
      categoryId: 'agricole',
      sellerId: seller.id,
      rating: 4.7,
      reviewsCount: 156,
      salesCount: 890,
      inStock: true,
      minOrder: '5 sacs',
      location: 'Bouaké',
      badge: 'Export Quality',
      badgeType: 'gold',
    },
  ];

  for (const prod of productsData) {
    const cat = await prisma.category.findFirst({ where: { id: prod.categoryId } });
    if (cat) {
      await prisma.product.create({
        data: {
          ...prod,
          categoryId: cat.id,
        },
      });
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
