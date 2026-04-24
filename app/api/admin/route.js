import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [totalSalesCount, totalProducts, totalUsers, totalCategories] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.category.count(),
    ]);

    // Mocking GMV and Commissions for now as we don't have many real orders
    const stats = {
      totalSales: totalSalesCount * 50000, 
      totalCommissions: (totalSalesCount * 50000) * 0.02,
      pendingVendors: await prisma.user.count({ where: { role: 'VENDEUR' } }), 
      activeLivreurs: await prisma.user.count({ where: { role: 'LIVREUR' } }),
      disputes: 0,
      totalUsers,
      totalProducts
    };

    const pendingVendors = await prisma.user.findMany({
      where: { role: 'VENDEUR' },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ stats, pendingVendors });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
