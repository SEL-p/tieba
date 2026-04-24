'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { topSuppliers, categories, formatPrice } from '../data/mockData';
import styles from './fournisseurs.module.css';

export default function FournisseursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');

  const allSuppliers = [
    ...topSuppliers,
    { id: 5, name: 'Huilerie du Sud SARL', category: 'Alimentation', rating: 4.6, products: 42, transactions: '3,400+', location: 'San-Pédro', verified: true, badge: 'Or', image: '/category_food.png' },
    { id: 6, name: 'Art & Tradition CI', category: 'Artisanat', rating: 5.0, products: 89, transactions: '980+', location: 'Abidjan, Plateau', verified: true, badge: 'Certifié', image: '/category_jewelry.png' },
    { id: 7, name: 'Nature Ivoire Beauté', category: 'Beauté', rating: 4.8, products: 67, transactions: '6,200+', location: 'Korhogo', verified: true, badge: 'Platine', image: '/category_cashew.png' },
    { id: 8, name: 'Tech Ivoire Electronique', category: 'Électronique', rating: 4.5, products: 213, transactions: '4,100+', location: 'Abidjan, Abobo', verified: false, badge: '', image: '/category_cocoa.png' },
  ];

  const filtered = allSuppliers.filter(s => {
    const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !selectedCategory || s.category === selectedCategory;
    const matchBadge = !selectedBadge || s.badge === selectedBadge;
    return matchSearch && matchCat && matchBadge;
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className="container">
            <nav className={styles.breadcrumb}>
              <Link href="/">Accueil</Link>
              <span>›</span>
              <span>Fournisseurs</span>
            </nav>
            <h1 className={styles.title}>Fournisseurs Certifiés</h1>
            <p className={styles.subtitle}>
              Découvrez les meilleurs fournisseurs ivoiriens vérifiés par Tieba Market.
              Sourcing direct, qualité garantie.
            </p>

            {/* Stats */}
            <div className={styles.heroStats}>
              {[
                { val: '3 200+', lbl: 'Fournisseurs actifs' },
                { val: '98%', lbl: 'Taux de satisfaction' },
                { val: '15', lbl: 'Pays d\'export' },
                { val: '24h', lbl: 'Réponse moyenne' },
              ].map(s => (
                <div key={s.lbl} className={styles.heroStat}>
                  <span className={styles.heroStatVal}>{s.val}</span>
                  <span className={styles.heroStatLbl}>{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '32px 24px 64px' }}>
          {/* Search & Filters */}
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInputEl}
                id="supplier-search"
              />
            </div>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              id="cat-filter"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select
              className={styles.filterSelect}
              value={selectedBadge}
              onChange={e => setSelectedBadge(e.target.value)}
              id="badge-filter"
            >
              <option value="">Tous les niveaux</option>
              <option value="Platine">Platine</option>
              <option value="Or">Or</option>
              <option value="Certifié">Certifié</option>
            </select>
          </div>

          <p className={styles.resultInfo}>
            <strong>{filtered.length}</strong> fournisseurs trouvés
          </p>

          {/* Supplier Grid */}
          <div className={styles.suppliersGrid}>
            {filtered.map(supplier => (
              <Link key={supplier.id} href={`/fournisseurs/${supplier.id}`} className={styles.supplierCard} id={`supplier-${supplier.id}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar} style={{ position: 'relative' }}>
                    <Image src={supplier.image} alt={supplier.name} fill sizes="72px" style={{ objectFit: 'cover', borderRadius: '12px' }} />
                  </div>
                  <div className={styles.supplierInfo}>
                    <div className={styles.supplierName}>{supplier.name}</div>
                    <div className={styles.supplierCat}>{supplier.category}</div>
                    {supplier.verified && <span className="badge badge-green" style={{ fontSize: '10px' }}>✓ Vérifié</span>}
                  </div>
                  {supplier.badge && (
                    <div className={`${styles.levelBadge} ${supplier.badge === 'Platine' ? styles.platine : supplier.badge === 'Or' ? styles.or : styles.certifie}`}>
                      {supplier.badge === 'Platine' ? '💎' : supplier.badge === 'Or' ? '🥇' : '✅'} {supplier.badge}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{supplier.rating}★</span>
                    <span className={styles.statLabel}>Note</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{supplier.products}</span>
                    <span className={styles.statLabel}>Produits</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{supplier.transactions}</span>
                    <span className={styles.statLabel}>Ventes</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.location}>📍 {supplier.location}</span>
                  <span className={styles.viewBtn}>Voir la boutique →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* B2B CTA */}
          <div className={styles.b2bBanner}>
            <div className={styles.b2bContent}>
              <div className={styles.b2bIcon}>📋</div>
              <div>
                <h3 className={styles.b2bTitle}>Besoin de sourcing B2B ?</h3>
                <p className={styles.b2bDesc}>Publiez votre demande d'approvisionnement et recevez des devis de plusieurs fournisseurs certifiés.</p>
              </div>
              <Link href="/sourcing" className="btn btn-primary btn-lg" id="sourcing-cta">
                Publier une demande →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
