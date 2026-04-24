import { NextResponse } from 'next/server';
import { calculateFees } from '@/lib/fees';

export async function POST(request) {
  try {
    const { subtotal, deliveryFee, method, orderId } = await request.json();
    
    // Calculate commissions using our business logic
    const summary = calculateFees(subtotal, deliveryFee);
    
    console.log(`Processing payment for Order ${orderId} via ${method}`);
    console.log(`Platform Commission (2%): ${summary.platformFee} CFA`);
    console.log(`Delivery Platform Fee (2%): ${summary.deliveryPlatformComm} CFA`);
    
    // Here we would integrate with the aggregator (CinetPay, Fedapay, or direct APIs)
    // For now, we simulate success
    
    return NextResponse.json({
      success: true,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      summary
    });
  } catch (error) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
