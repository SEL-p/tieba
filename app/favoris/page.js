'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import styles from './favoris.module.css';

export default function FavorisPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/favorites');
        const data = await res.json();
        setFavorites(data.map(f => f.product));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchFavorites();
    else setLoading(false);
  }, [session]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <Link href="/" className={styles.backBtn}>
              <ArrowLeft size={18} /> Continuer mes achats
            </Link>
            <h1>Mes Favoris <Heart size={24} fill="#ef4444" color="#ef4444" /></h1>
          </div>

          {!session ? (
            <div className={styles.empty}>
              <Heart size={64} color="#e2e8f0" />
              <h2>Connectez-vous pour voir vos favoris</h2>
              <p>Retrouvez tous les articles que vous avez aimés en un seul endroit.</p>
              <Link href="/connexion" className="btn btn-primary btn-lg">Se connecter</Link>
            </div>
          ) : loading ? (
            <div className={styles.loading}>Chargement de vos favoris...</div>
          ) : favorites.length > 0 ? (
            <div className={styles.grid}>
              {favorites.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <Heart size={64} color="#e2e8f0" />
              <h2>Votre liste est vide</h2>
              <p>Parcourez notre catalogue et cliquez sur le coeur pour ajouter des articles.</p>
              <Link href="/" className="btn btn-primary btn-lg">Explorer le marché</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
