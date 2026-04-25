'use client';
import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Grid, List as ListIcon, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import styles from './produits.module.css';

export default function ProduitsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div className={styles.titleSection}>
              <h1>Tous les Produits</h1>
              <p>Explorez le meilleur du marché ivoirien : <span className={styles.resultsCount}>{products.length} produits trouvés</span></p>
            </div>
          </div>

          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}><Filter size={18} /> Catégories</h3>
                <div className={styles.filterList}>
                  {categories.map(cat => (
                    <label key={cat.id} className={styles.filterItem}>
                      <input type="checkbox" />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}><SlidersHorizontal size={18} /> Budget (CFA)</h3>
                <div className={styles.priceInputs}>
                  <input type="number" placeholder="Min" className={styles.priceInput} />
                  <span className={styles.priceSep}>-</span>
                  <input type="number" placeholder="Max" className={styles.priceInput} />
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}>Localisation</h3>
                <div className={styles.filterList}>
                  {['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Korhogo'].map(loc => (
                    <label key={loc} className={styles.filterItem}>
                      <input type="checkbox" />
                      <span>{loc}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.content}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.sortSection}>
                  <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '12px' }}>Trier par :</span>
                  <select 
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Nouveautés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="popular">Les plus populaires</option>
                  </select>
                </div>

                <div className={styles.viewButtons}>
                  <button 
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={20} />
                  </button>
                  <button 
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <ListIcon size={20} />
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <p>Chargement des produits...</p>
                </div>
              ) : products.length > 0 ? (
                <div className={styles.productsGrid}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '12px' }}>
                  <p>Aucun produit ne correspond à votre recherche.</p>
                </div>
              )}

              {/* Pagination */}
              {products.length > 0 && (
                <div className={styles.pagination}>
                  <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>3</button>
                  <button className={styles.pageBtn}><ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} /></button>
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
