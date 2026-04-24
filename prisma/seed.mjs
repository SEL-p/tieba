import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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
  console.log('Categories seeded.');

  // 2. Create a default User/Seller
  const user = await prisma.user.upsert({
    where: { email: 'admin@tieba.market' },
    update: {},
    create: {
      name: 'Admin Tieba',
      email: 'admin@tieba.market',
      role: 'ADMIN',
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      businessName: 'Tieba Official Store',
      verified: true,
      location: 'Abidjan',
    },
  });
  console.log('Default user/seller seeded.');

  // 3. Create Products
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
      name: 'Pagne Wax Africain Haute Qualité – 6 Yards',
      price: 12500,
      originalPrice: 18000,
      image: '/category_textile.png',
      categoryId: 'textile',
      sellerId: seller.id,
      rating: 4.9,
      reviewsCount: 892,
      salesCount: 3200,
      inStock: true,
      minOrder: '1 pièce',
      location: 'Abidjan',
      badge: 'Meilleure Vente',
      badgeType: 'orange',
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
  console.log('Products seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
