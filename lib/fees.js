/**
 * Tiéba Marketplace Fee Structure
 * - Commission: 2% on every sale
 * - Delivery Platform Fee: 2% on every delivery
 */

export const PLATFORM_COMMISSION_RATE = 0.12; // 12%
export const DELIVERY_PLATFORM_RATE = 0.02; // 2%

export function calculateFees(subtotal, deliveryFee = 0) {
  const platformFee = subtotal * PLATFORM_COMMISSION_RATE;
  const deliveryPlatformComm = deliveryFee * DELIVERY_PLATFORM_RATE;
  const total = subtotal + deliveryFee;
  
  return {
    subtotal,
    deliveryFee,
    platformFee, // What Tiéba takes from vendor
    deliveryPlatformComm, // What Tiéba takes from delivery
    total,
    vendorEarnings: subtotal - platformFee,
    livreurEarnings: deliveryFee - deliveryPlatformComm
  };
}
