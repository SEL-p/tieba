import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { calculateFees } from '@/lib/fees';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { subtotal, deliveryFee, method, items } = await request.json();
    
    // Calculate commissions using our business logic
    const summary = calculateFees(subtotal, deliveryFee);
    
    // Create Order and DeliveryMission in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: 'PAID', // In a real app, this would be PENDING until payment callback
          subtotal: summary.subtotal,
          deliveryFee: summary.deliveryFee,
          platformFee: summary.platformFee,
          deliveryComm: summary.deliveryPlatformComm,
          total: summary.total,
          paymentMethod: method || 'MOBILE_MONEY',
          paymentStatus: 'PAID',
          items: {
            create: items.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: { seller: true }
              }
            }
          }
        }
      });

      // 2. Create the Delivery Mission
      // We take the first product's seller location as pickup address for simplicity
      const firstItem = newOrder.items[0];
      const pickupAddress = firstItem?.product?.seller?.location || 'Boutique Partenaire';

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      await tx.deliveryMission.create({
        data: {
          orderId: newOrder.id,
          status: 'WAITING',
          pickupAddress: pickupAddress,
          deliveryAddress: 'Adresse Client (à préciser)',
          estimatedTime: 45,
          distanceKm: 5.2,
          otpCode: otpCode
        }
      });

      // 3. Clear user cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id }
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      transactionId: `GP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      summary
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'La création de la commande a échoué' }, { status: 500 });
  }
}

