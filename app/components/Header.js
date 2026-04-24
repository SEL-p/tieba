'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.css';

const categories = [
  { name: 'Agricole', icon: '🌱', href: '/categories/agricole' },
  { name: 'Textile & Pagnes', icon: '👘', href: '/categories/textile' },
  { name: 'Alimentation', icon: '🍽️', href: '/categories/alimentation' },
  { name: 'Artisanat', icon: '🎨', href: '/categories/artisanat' },
  { name: 'Bijoux', icon: '💎', href: '/categories/bijoux' },
  { name: 'Électronique', icon: '📱', href: '/categories/electronique' },
  { name: 'Beauté & Santé', icon: '💄', href: '/categories/beaute' },
  { name: 'Bâtiment', icon: '🏗️', href: '/categories/batiment' },
];

export default function Header() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(7);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner */}
      <div className={styles.topBanner}>
        <div className="container">
          <div className={styles.topBannerInner}>
            <span>🇨🇮 Livraison dans toute la Côte d'Ivoire &nbsp;|&nbsp; 📞 +225 07 00 00 00 &nbsp;|&nbsp; ✉️ contact@tiebamarket.ci</span>
            <div className={styles.topLinks}>
              {session?.user?.role === 'VENDEUR' && <Link href="/vendeur/dashboard">📊 Dashboard Vendeur</Link>}
              {session?.user?.role === 'LIVREUR' && <Link href="/livreur/dashboard">🚴 Espace Livreur</Link>}
              {!session && <Link href="/vendeur">Devenir Vendeur</Link>}
              <span className={styles.dot}>·</span>
              <Link href="/aide">Aide</Link>
              <span className={styles.dot}>·</span>
              {session ? (
                <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>Se déconnecter</button>
              ) : (
                <Link href="/compte">Mon Compte</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.headerInner}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>T</span>
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>Tieba</span>
                <span className={styles.logoSub}>Market</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchTabs}>
                <button className={`${styles.searchTab} ${styles.active}`}>Produits</button>
                <button className={styles.searchTab}>Fournisseurs</button>
              </div>
              <div className={styles.searchBar}>
                <select className={styles.categorySelect} aria-label="Catégorie de recherche">
                  <option value="">Tout</option>
                  {categories.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className={styles.searchDivider}></div>
                <input
                  type="text"
                  id="search-input"
                  placeholder="Rechercher sur Tiéba Market..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button className={styles.searchBtn} aria-label="Rechercher">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <span>Rechercher</span>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className={styles.actions}>
              <Link href="/compte" className={styles.actionBtn} id="account-link">
                <div className={styles.actionIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>
                    {session ? `Bonjour, ${session.user.name.split(' ')[0]} 👋` : 'Bonjour 👋'}
                  </span>
                  <span className={styles.actionMain}>
                    {session?.user?.role === 'VENDEUR' ? 'Dashboard' : 
                     session?.user?.role === 'LIVREUR' ? 'Missions' : 'Mon Compte'}
                  </span>
                </div>
              </Link>

              <Link href="/favoris" className={styles.actionBtn} id="wishlist-link">
                <div className={styles.actionIconWrapper}>
                  <div className={styles.actionIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <span className={styles.badge}>{wishlistCount}</span>
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>Sauvegardés</span>
                  <span className={styles.actionMain}>Favoris</span>
                </div>
              </Link>

              <Link href="/panier" className={styles.cartBtn} id="cart-link">
                <div className={styles.cartIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <span className={styles.cartBadge}>{cartCount}</span>
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>Votre panier</span>
                  <span className={styles.actionMain}>CFA 45,000</span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className="container">
          <div className={styles.navInner}>
            {/* All Categories */}
            <div className={styles.allCategoriesWrapper}>
              <button className={styles.allCategoriesBtn} id="all-categories-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
                Toutes les Catégories
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Mega Dropdown */}
              <div className={styles.megaMenu}>
                {categories.map(cat => (
                  <Link key={cat.name} href={cat.href} className={styles.megaMenuItem}>
                    <span className={styles.megaIcon}>{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav Links */}
            <div className={styles.navLinks}>
              {[
                { href: '/', label: '🏠 Accueil' },
                { href: '/nouveautes', label: '✨ Nouveautés' },
                { href: '/promotions', label: '🔥 Promotions' },
                { href: '/fournisseurs', label: '🏭 Fournisseurs' },
                { href: '/sourcing', label: '📋 Sourcing B2B' },
                { href: '/blog', label: '📰 Actualités' },
              ].map(link => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Promo tag */}
            <div className={styles.navPromo}>
              <span className="badge badge-red">🎁 -30% sur les pagnes cette semaine</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearch}>
            <input type="text" placeholder="Rechercher..." className="input" />
          </div>
          {categories.map(cat => (
            <Link key={cat.name} href={cat.href} className={styles.mobileMenuItem}
              onClick={() => setMobileMenuOpen(false)}>
              <span>{cat.icon}</span> {cat.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
