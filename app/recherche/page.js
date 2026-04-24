'use client';
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';
import styles from './recherche.module.css';

export default function RecherchePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Simple search: for now we use our existing API and filter client-side 
        // or we could add search support to the API
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
    <>
      <Header />
      <main className={styles.container}>
        <div className="container">
          <div className={styles.header}>
            <h1>Résultats pour "{query}"</h1>
            <p>{products.length} produits trouvés</p>
          </div>

          <div className={styles.layout}>
            {/* Filters Sidebar */}
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

            {/* Results Grid */}
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
      <Footer />
    </>
  );
}
