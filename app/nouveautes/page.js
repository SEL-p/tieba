'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import styles from './nouveautes.module.css';

export default function NouveautesPage() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Filter products created within the last 7 days (1 week)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const filtered = data.filter(product => {
            const createdAt = new Date(product.createdAt);
            return createdAt >= oneWeekAgo;
          });
          
          setNewProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching arrivals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <span className={styles.badge}>Dernière Semaine</span>
              <h1>Nouveautés du Marché</h1>
              <p>Découvrez les produits les plus récents ajoutés par nos vendeurs certifiés au cours des 7 derniers jours.</p>
            </div>
          </section>

          {/* Product Grid */}
          {loading ? (
            <div className={styles.emptyState}>
              <p>Recherche des nouveautés...</p>
            </div>
          ) : newProducts.length > 0 ? (
            <div className={styles.grid}>
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✨</div>
              <h2>Pas de nouveautés cette semaine</h2>
              <p>Revenez demain ou explorez notre catalogue complet pour ne rien rater.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
