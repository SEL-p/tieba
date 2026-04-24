'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts, formatPrice } from '../data/mockData';
import styles from './panier.module.css';

const initialCartItems = featuredProducts.slice(0, 3).map((p, i) => ({
  ...p,
  quantity: i === 0 ? 2 : 1,
}));

export default function PanierPage() {
  const [items, setItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 2500;
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - promoDiscount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'TIEBA10') setPromoApplied(true);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Accueil</Link>
            <span>›</span>
            <span>Mon Panier</span>
          </nav>

          <h1 className={styles.pageTitle}>
            Mon Panier
            <span className={styles.itemCount}>{items.length} articles</span>
          </h1>

          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Votre panier est vide</h2>
              <p>Découvrez nos produits ivoiriens authentiques</p>
              <Link href="/" className="btn btn-primary btn-lg">
                Explorer le marché
              </Link>
            </div>
          ) : (
            <div className={styles.cartLayout}>
              {/* Left: Cart Items */}
              <div className={styles.cartItems}>
                {/* Select All */}
                <div className={styles.cartHeader}>
                  <label className={styles.checkLabel}>
                    <input type="checkbox" defaultChecked id="select-all" />
                    <span>Tout sélectionner ({items.length} articles)</span>
                  </label>
                  <button className={styles.clearBtn} onClick={() => setItems([])}>
                    Vider le panier
                  </button>
                </div>

                {items.map(item => (
                  <div key={item.id} className={styles.cartItem} id={`cart-item-${item.id}`}>
                    <input type="checkbox" defaultChecked className={styles.itemCheck} />

                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                    </div>

                    <div className={styles.itemDetails}>
                      <Link href={`/produit/${item.id}`} className={styles.itemName}>{item.name}</Link>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemSeller}>
                          {item.sellerVerified && '✓ '}{item.seller}
                        </span>
                        <span className={styles.itemLocation}>📍 {item.location}</span>
                      </div>
                      <div className={styles.itemStock}>
                        <span className={styles.inStock}>✓ En stock</span>
                        <span className={styles.minOrder}>Commande min: {item.minOrder}</span>
                      </div>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.qtyControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.id, -1)}
                          id={`qty-minus-${item.id}`}
                        >−</button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.id, 1)}
                          id={`qty-plus-${item.id}`}
                        >+</button>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.originalPrice && (
                        <div className={styles.itemOriginalPrice}>
                          {formatPrice(item.originalPrice * item.quantity)}
                        </div>
                      )}
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        id={`remove-${item.id}`}
                        aria-label="Supprimer"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}

                {/* Recommended */}
                <div className={styles.recommendedSection}>
                  <h3 className={styles.recommendedTitle}>💡 Souvent achetés ensemble</h3>
                  <div className={styles.recommendedGrid}>
                    {featuredProducts.slice(4, 7).map(p => (
                      <div key={p.id} className={styles.recommendedCard}>
                        <div className={styles.recommendedImage} style={{ position: 'relative' }}>
                          <Image src={p.image} alt={p.name} fill sizes="60px" style={{ objectFit: 'cover', borderRadius: '6px' }} />
                        </div>
                        <div className={styles.recommendedInfo}>
                          <span className={styles.recommendedName}>{p.name}</span>
                          <span className={styles.recommendedPrice}>{formatPrice(p.price)}</span>
                        </div>
                        <button className="btn btn-outline btn-sm">+ Ajouter</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className={styles.cartSummary}>
                <div className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>Récapitulatif</h2>

                  {/* Promo Code */}
                  <div className={styles.promoSection}>
                    <label className={styles.promoLabel}>Code promo</label>
                    <div className={styles.promoRow}>
                      <input
                        type="text"
                        className="input"
                        placeholder="Ex: TIEBA10"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        id="promo-code-input"
                      />
                      <button className="btn btn-secondary" onClick={applyPromo} id="apply-promo-btn">
                        Appliquer
                      </button>
                    </div>
                    {promoApplied && (
                      <p className={styles.promoSuccess}>✓ Code TIEBA10 appliqué ! −10%</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className={styles.priceBreakdown}>
                    <div className={styles.priceRow}>
                      <span>Sous-total ({items.reduce((s,i)=>s+i.quantity,0)} articles)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Livraison (Abidjan)</span>
                      <span className={styles.deliveryPrice}>{formatPrice(delivery)}</span>
                    </div>
                    {promoApplied && (
                      <div className={`${styles.priceRow} ${styles.discount}`}>
                        <span>Réduction promo</span>
                        <span>−{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                    <div className={`${styles.priceRow} ${styles.totalRow}`}>
                      <span>Total</span>
                      <span className={styles.totalPrice}>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button className={`${styles.checkoutBtn}`} id="checkout-btn">
                    🔒 Passer la commande
                  </button>

                  {/* Payment methods */}
                  <div className={styles.paymentInfo}>
                    <p className={styles.paymentLabel}>Paiements acceptés</p>
                    <div className={styles.paymentMethods}>
                      {['Orange Money', 'MTN MoMo', 'Wave', 'Visa'].map(m => (
                        <span key={m} className={styles.payBadge}>{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Trust */}
                  <div className={styles.trustItems}>
                    <div className={styles.trustItem}>🔒 Paiement 100% sécurisé</div>
                    <div className={styles.trustItem}>↩️ Retour sous 14 jours</div>
                    <div className={styles.trustItem}>🚚 Livraison sous 48h</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
