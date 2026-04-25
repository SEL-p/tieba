'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import styles from './promotions.module.css';
import { Zap } from 'lucide-react';

export default function PromotionsPage() {
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Filter products that have an originalPrice higher than current price (meaning they are on sale)
          const filtered = data.filter(product => 
            product.originalPrice && product.originalPrice > product.price
          );
          setPromoProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching promos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Flash Sale Hero */}
          <section className={styles.promoHero}>
            <div className={styles.heroContent}>
              <div className={styles.timer}>
                <div className={styles.timerUnit}>
                  <span className={styles.timerVal}>02</span>
                  <span className={styles.timerLabel}>Jours</span>
                </div>
                <div className={styles.timerUnit}>
                  <span className={styles.timerVal}>14</span>
                  <span className={styles.timerLabel}>Heures</span>
                </div>
                <div className={styles.timerUnit}>
                  <span className={styles.timerVal}>45</span>
                  <span className={styles.timerLabel}>Min</span>
                </div>
              </div>
              <h1>Ventes Flash Tiéba</h1>
              <p>Économisez jusqu'à -50% sur une sélection de produits ivoiriens. Offres limitées dans le temps !</p>
            </div>
            <div className={styles.flashIcon}>
              <Zap size={120} fill="currentColor" />
            </div>
          </section>

          {/* Product Grid */}
          {loading ? (
            <div className={styles.emptyState}>
              <p>Recherche des meilleures offres...</p>
            </div>
          ) : promoProducts.length > 0 ? (
            <div className={styles.grid}>
              {promoProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎁</div>
              <h2>Pas de promotions actives</h2>
              <p>Restez à l'écoute, de nouvelles offres arrivent très bientôt !</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
