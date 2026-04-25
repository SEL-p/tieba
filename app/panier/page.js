'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Trash2, Plus, Minus, ShoppingCart, ShieldCheck, Truck, ChevronRight, Lock, RefreshCw, CreditCard, Wallet, Smartphone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatPrice } from '../data/mockData';
import { generateInvoice } from '@/lib/invoice';
import styles from './panier.module.css';

export default function PanierPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // null, or { code, type, value, discount }
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartRes, prodRes] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/products')
        ]);
        
        const cartData = await cartRes.json();
        const prodData = await prodRes.json();
        
        setItems(Array.isArray(cartData) ? cartData : []);
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (session) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const updateQty = async (id, productId, delta) => {
    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

    // Backend update
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: delta }),
      });
    } catch (err) {
      console.error('Update qty error:', err);
    }
  };

  const removeItem = async (id) => {
    const originalItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      setItems(originalItems);
      console.error('Remove item error:', err);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = 0; // Everything is included in the price (commission)
  const promoDiscount = promoApplied ? promoApplied.discount : 0;
  const total = subtotal + delivery - promoDiscount;

  const applyPromo = async () => {
    if (!promoCode) return;
    setPromoError('');
    
    try {
      const res = await fetch(`/api/promocodes?code=${promoCode.toUpperCase()}`);
      if (!res.ok) {
        const err = await res.json();
        setPromoError(err.error || 'Code invalide');
        setPromoApplied(null);
        return;
      }

      const promo = await res.json();
      
      // Validation du montant minimum
      if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        setPromoError(`Commande minimum de ${promo.minOrderAmount} CFA requise`);
        setPromoApplied(null);
        return;
      }

      // Calcul du discount
      let discount = 0;
      if (promo.type === 'PERCENTAGE') {
        discount = Math.round(subtotal * (promo.value / 100));
        if (promo.maxDiscount && discount > promo.maxDiscount) {
          discount = promo.maxDiscount;
        }
      } else {
        discount = promo.value;
      }

      setPromoApplied({ ...promo, discount });
      setPromoError('');
      alert('Code promo appliqué avec succès !');

    } catch (err) {
      console.error(err);
      setPromoError('Erreur de connexion');
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      alert('Veuillez vous connecter pour passer commande');
      return;
    }

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtotal,
          deliveryFee: delivery,
          method: 'MOBILE_MONEY',
          orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert('Paiement réussi ! Votre facture va être générée.');
        
        // Prepare order data for invoice
        const orderForInvoice = {
          id: data.transactionId,
          userName: session.user.name,
          userEmail: session.user.email,
          items: items,
          total: total,
          paymentMethod: 'Orange/MTN/Wave'
        };

        generateInvoice(orderForInvoice);
        
        // Clear cart
        setItems([]);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erreur lors du paiement');
    }
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
                      <Image src={item.product.image} alt={item.product.name} fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                    </div>

                    <div className={styles.itemDetails}>
                      <Link href={`/produit/${item.product.id}`} className={styles.itemName}>{item.product.name}</Link>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemSeller}>
                          {item.product.seller?.businessName || 'Vendeur Tiéba'}
                        </span>
                        <span className={styles.itemLocation}>📍 {item.product.location || 'Côte d\'Ivoire'}</span>
                      </div>
                      <div className={styles.itemStock}>
                        <span className={styles.inStock}>✓ En stock</span>
                        <span className={styles.minOrder}>Commande min: {item.product.minOrder || '1'}</span>
                      </div>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.qtyControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.id, item.product.id, -1)}
                          id={`qty-minus-${item.id}`}
                        >−</button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQty(item.id, item.product.id, 1)}
                          id={`qty-plus-${item.id}`}
                        >+</button>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        id={`remove-${item.id}`}
                        aria-label="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Recommended */}
                <div className={styles.recommendedSection}>
                  <h3 className={styles.recommendedTitle}>💡 Souvent achetés ensemble</h3>
                  <div className={styles.recommendedGrid}>
                    {products.slice(0, 3).map(p => (
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
                      <p className={styles.promoSuccess}>
                        ✓ Code {promoApplied.code} appliqué ! 
                        {promoApplied.type === 'PERCENTAGE' ? ` (−${promoApplied.value}%)` : ` (−${promoApplied.value} CFA)`}
                      </p>
                    )}
                    {promoError && (
                      <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>{promoError}</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className={styles.priceBreakdown}>
                    <div className={styles.priceRow}>
                      <span>Sous-total ({items.reduce((s,i)=>s+i.quantity,0)} articles)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Livraison</span>
                      <span className={styles.deliveryPrice}>OFFERTE</span>
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

                  <button 
                    className={`${styles.checkoutBtn}`} 
                    id="checkout-btn"
                    onClick={handleCheckout}
                  >
                    🔒 Passer la commande
                  </button>

                  {/* Payment methods */}
                  <div className={styles.paymentInfo}>
                    <p className={styles.paymentLabel}>Paiements sécurisés via <strong>GeniusPay</strong></p>
                    <div className={styles.paymentMethods}>
                      <div className={styles.payBadge} title="Orange Money">
                        <Smartphone size={14} color="#FF6600" />
                        <span>Orange</span>
                      </div>
                      <div className={styles.payBadge} title="MTN MoMo">
                        <Smartphone size={14} color="#FFCC00" />
                        <span>MTN</span>
                      </div>
                      <div className={styles.payBadge} title="Wave">
                        <Wallet size={14} color="#1E90FF" />
                        <span>Wave</span>
                      </div>
                      <div className={styles.payBadge} title="Moov Money">
                        <Smartphone size={14} color="#005CBB" />
                        <span>Moov</span>
                      </div>
                      <div className={styles.payBadge} title="Visa/Mastercard">
                        <CreditCard size={14} color="#1A1F71" />
                        <span>Cartes</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className={styles.trustItems}>
                    <div className={styles.trustItem}>
                      <Lock size={16} className={styles.trustIcon} />
                      <span>Paiement 100% sécurisé</span>
                    </div>
                    <div className={styles.trustItem}>
                      <RefreshCw size={16} className={styles.trustIcon} />
                      <span>Retour sous 14 jours</span>
                    </div>
                    <div className={styles.trustItem}>
                      <Truck size={16} className={styles.trustIcon} />
                      <span>Livraison sous 48h</span>
                    </div>
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
