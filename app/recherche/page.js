'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';
import styles from './recherche.module.css';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        
        const filtered = data.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.category?.name.toLowerCase().includes(query.toLowerCase())
        );
        
        setProducts(filtered);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
    else setLoading(false);
  }, [query]);

  return (
    <main className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <h1>Résultats pour "{query}"</h1>
          <p>{products.length} produits trouvés</p>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3><SlidersHorizontal size={18} /> Filtres</h3>
              <div className={styles.filterSection}>
                <h4>Prix</h4>
                <div className={styles.priceInputs}>
                  <input type="number" placeholder="Min" />
                  <span>-</span>
                  <input type="number" placeholder="Max" />
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.results}>
            {loading ? (
              <div className={styles.loading}>Recherche en cours...</div>
            ) : products.length > 0 ? (
              <div className={styles.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className={styles.empty}>
                <PackageSearch size={64} />
                <h2>Aucun produit trouvé</h2>
                <p>Essayez avec d'autres mots-clés ou parcourez nos catégories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RecherchePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container" style={{padding: '100px', textAlign: 'center'}}>Chargement...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
