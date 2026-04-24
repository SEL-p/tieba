import { prisma } from '../lib/prisma.js';

async function testConnection() {
  console.log('--- Testing Database Connection ---');
  try {
    const productsCount = await prisma.product.count();
    console.log(`✅ Database connection successful! Found ${productsCount} products.`);
    
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    console.log('✅ Categories fetched successfully:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat._count.products} products)`);
    });

    const firstProduct = await prisma.product.findFirst({
      include: { seller: true, category: true }
    });
    
    if (firstProduct) {
      console.log(`✅ Product data integrity check passed: ${firstProduct.name} (Seller: ${firstProduct.seller.businessName})`);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
