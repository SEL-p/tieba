'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, MapPin, ExternalLink, Award, Users, Package } from 'lucide-react';
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
              Identifiez et connectez-vous avec les entreprises ivoiriennes les plus performantes. 
              Sourcing B2B simplifié et vérifié.
            </p>

            {/* Stats */}
            <div className={styles.heroStats}>
              {[
                { val: '3 200+', lbl: 'Fournisseurs actifs', icon: <Users size={18} /> },
                { val: '98%', lbl: 'Confiance client', icon: <ShieldCheck size={18} /> },
                { val: '15', lbl: 'Pays desservis', icon: <Award size={18} /> },
                { val: '24h', lbl: 'Réponse moyenne', icon: <Package size={18} /> },
              ].map(s => (
                <div key={s.lbl} className={styles.heroStat}>
                  <div className={styles.heroStatHeader}>
                    {s.icon}
                    <span className={styles.heroStatVal}>{s.val}</span>
                  </div>
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
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Ex: Huilerie du Sud, Artisanat..."
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
              <option value="Platine">Membre Platine</option>
              <option value="Or">Membre Or</option>
              <option value="Certifié">Vendeur Certifié</option>
            </select>
          </div>

          <p className={styles.resultInfo}>
            Nous avons trouvé <strong>{filtered.length}</strong> partenaires potentiels pour vous.
          </p>

          {/* Supplier Grid */}
          <div className={styles.suppliersGrid}>
            {filtered.map(supplier => (
              <Link key={supplier.id} href={`/fournisseurs/${supplier.id}`} className={styles.supplierCard} id={`supplier-${supplier.id}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar} style={{ position: 'relative' }}>
                    <Image src={supplier.image} alt={supplier.name} fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.supplierInfo}>
                    <div className={styles.supplierNameRow}>
                      <h3 className={styles.supplierName}>{supplier.name}</h3>
                      {supplier.verified && <ShieldCheck size={16} className={styles.verifiedIcon} title="Vérifié par Tiéba" />}
                    </div>
                    <div className={styles.supplierCat}>{supplier.category}</div>
                    
                    {supplier.badge && (
                      <div className={`${styles.levelBadge} ${supplier.badge === 'Platine' ? styles.platine : supplier.badge === 'Or' ? styles.or : styles.certifie}`}>
                        <Award size={12} />
                        <span>{supplier.badge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{supplier.rating}</span>
                    <span className={styles.statLabel}>Avis</span>
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
                  <div className={styles.location}>
                    <MapPin size={14} />
                    <span>{supplier.location}</span>
                  </div>
                  <div className={styles.viewBtn}>
                    <span>Voir Profil</span>
                    <ExternalLink size={14} />
                  </div>
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
