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
    
    // GeniusPay CI Integration Logic (Simulated)
    // Documentation: https://genius.ci/documentation
    const geniusPayPayload = {
      merchant_id: process.env.GENIUSPAY_MERCHANT_ID,
      amount: summary.total,
      currency: 'XOF',
      order_id: orderId,
      description: `Paiement Commande ${orderId} sur Tiéba Market`,
      success_url: `${process.env.NEXTAUTH_URL}/profil/commandes?status=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/panier?status=cancel`,
    };

    console.log('Initializing GeniusPay Payment:', geniusPayPayload);
    
    // In a real production scenario, we would call:
    // const res = await fetch('https://pay.genius.ci/api/v1/merchant/payments', { ... })
    // and return the redirect URL.
    
    return NextResponse.json({
      success: true,
      transactionId: `GP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentUrl: 'https://pay.genius.ci/checkout/simulated-session', // User would redirect here
      summary
    });
  } catch (error) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
