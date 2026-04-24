'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { categories, featuredProducts } from '../../data/mockData';
import styles from './categorie.module.css';

const sortOptions = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'note', label: 'Meilleures notes' },
  { value: 'ventes', label: 'Meilleures ventes' },
];

export default function CategoriePage({ params }) {
  const { id } = use(params);
  const category = categories.find(c => c.id === id) || categories[0];
  const products = featuredProducts;

  const [sort, setSort] = useState('pertinence');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeSubcat, setActiveSubcat] = useState('Tout');

  const filtered = products
    .filter(p => !onlyVerified || p.sellerVerified)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Category Banner */}
        <div className={styles.banner} style={{ background: `linear-gradient(135deg, ${category.color}22 0%, ${category.color}11 100%)` }}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <span>›</span>
              <Link href="/categories">Catégories</Link>
              <span>›</span>
              <span style={{ color: category.color }}>{category.name}</span>
            </nav>
            <div className={styles.bannerContent}>
              <div>
                <div className={styles.catIcon} style={{ background: category.color + '22', color: category.color }}>
                  {category.icon}
                </div>
                <h1 className={styles.catTitle}>{category.name}</h1>
                <p className={styles.catCount}>{category.count.toLocaleString()} produits disponibles</p>
              </div>
              <div className={styles.bannerStats}>
                <div className={styles.bannerStat}><span>{category.subcategories.length}</span><small>Sous-catégories</small></div>
                <div className={styles.bannerStat}><span>4.7★</span><small>Note moyenne</small></div>
                <div className={styles.bannerStat}><span>240+</span><small>Vendeurs</small></div>
              </div>
            </div>
            {/* Subcategories */}
            <div className={styles.subcats}>
              {['Tout', ...category.subcategories].map(sc => (
                <button
                  key={sc}
                  className={`${styles.subcatBtn} ${activeSubcat === sc ? styles.subcatActive : ''}`}
                  onClick={() => setActiveSubcat(sc)}
                  style={activeSubcat === sc ? { background: category.color, borderColor: category.color } : {}}
                  id={`subcat-${sc.replace(/\s+/g, '-')}`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar} aria-label="Filtres">
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>🔍 Filtres</h3>

                <div className={styles.filterGroup}>
                  <h4 className={styles.filterLabel}>Prix (FCFA)</h4>
                  <div className={styles.priceInputs}>
                    <input
                      type="number"
                      className="input"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([parseInt(e.target.value)||0, priceRange[1]])}
                      id="price-min"
                    />
                    <span>–</span>
                    <input
                      type="number"
                      className="input"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)||500000])}
                      id="price-max"
                    />
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <h4 className={styles.filterLabel}>Vendeurs</h4>
                  <label className={styles.checkLabel} htmlFor="verified-filter">
                    <input
                      type="checkbox"
                      id="verified-filter"
                      checked={onlyVerified}
                      onChange={e => setOnlyVerified(e.target.checked)}
                    />
                    Vendeurs vérifiés seulement
                  </label>
                </div>

                <div className={styles.filterGroup}>
                  <h4 className={styles.filterLabel}>Note minimum</h4>
                  {[4, 3, 2].map(r => (
                    <label key={r} className={styles.checkLabel}>
                      <input type="radio" name="rating" value={r} />
                      {'★'.repeat(r)}{'☆'.repeat(5-r)} & plus
                    </label>
                  ))}
                </div>

                <div className={styles.filterGroup}>
                  <h4 className={styles.filterLabel}>Localisation</h4>
                  {['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro', 'Korhogo'].map(city => (
                    <label key={city} className={styles.checkLabel}>
                      <input type="checkbox" value={city} id={`city-${city}`} />
                      {city}
                    </label>
                  ))}
                </div>

                <button
                  className="btn btn-outline w-full"
                  onClick={() => { setOnlyVerified(false); setPriceRange([0, 500000]); }}
                  id="reset-filters-btn"
                >
                  Réinitialiser
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.content}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <span className={styles.resultCount}>
                  <strong>{filtered.length}</strong> produits trouvés
                </span>
                <div className={styles.toolbarRight}>
                  <select
                    className={styles.sortSelect}
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    id="sort-select"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                      onClick={() => setViewMode('grid')}
                      id="view-grid"
                      aria-label="Vue grille"
                    >⊞</button>
                    <button
                      className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                      onClick={() => setViewMode('list')}
                      id="view-list"
                      aria-label="Vue liste"
                    >☰</button>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
                {filtered.map(product => <ProductCard key={product.id} product={product} />)}
              </div>

              {/* Pagination */}
              <div className={styles.pagination}>
                {[1, 2, 3, '...', 8].map((p, i) => (
                  <button
                    key={i}
                    className={`${styles.pageBtn} ${p === 1 ? styles.pageBtnActive : ''}`}
                    id={`page-${p}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
