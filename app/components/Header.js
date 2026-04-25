'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, User, Heart, ShoppingBag, Menu, ChevronDown, 
  Sprout, Scissors, Soup, Brush, Diamond, Cpu, Activity, Home, 
  Flame, Factory, ClipboardList, Newspaper, Briefcase, Zap
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

const categories = [
  { name: 'Agricole', icon: <Sprout size={18} />, href: '/categories/agricole' },
  { name: 'Textile & Pagnes', icon: <Scissors size={18} />, href: '/categories/textile' },
  { name: 'Alimentation', icon: <Soup size={18} />, href: '/categories/alimentation' },
  { name: 'Artisanat', icon: <Brush size={18} />, href: '/categories/artisanat' },
  { name: 'Bijoux', icon: <Diamond size={18} />, href: '/categories/bijoux' },
  { name: 'Électronique', icon: <Cpu size={18} />, href: '/categories/electronique' },
  { name: 'Beauté & Santé', icon: <Activity size={18} />, href: '/categories/beaute' },
  { name: 'Bâtiment', icon: <Briefcase size={18} />, href: '/categories/batiment' },
];

import DeliveryHeader from './DeliveryHeader';

export default function Header() {
  const { data: session } = useSession();
  
  // Si c'est un livreur, on affiche le header logistique simplifié partout
  if (session?.user?.role === 'LIVREUR') {
    return <DeliveryHeader />;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  const { cartCount, cartTotal, wishlistCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardUrl = () => {
    if (!session?.user) return '/connexion';
    if (session.user.role === 'ADMIN') return '/admin/dashboard';
    if (session.user.role === 'VENDEUR') return '/vendeur/dashboard';
    if (session.user.role === 'LIVREUR') return '/livreur/dashboard';
    return '/dashboard';
  };

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
                <>
                  <Link href={getDashboardUrl()} className={styles.topLink}>Dashboard</Link>
                  <span className={styles.dot}>·</span>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>Se déconnecter</button>
                </>
              ) : (
                <Link href="/connexion" className={styles.topLink}>Se connecter</Link>
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
                <form className={styles.searchBar} onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Rechercher des produits, des fournisseurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchBtn} aria-label="Rechercher">
                    <Search size={22} />
                    <span>Rechercher</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Actions */}
            <div className={styles.actions}>
              <Link href={getDashboardUrl()} className={styles.actionBtn} id="account-link">
                <div className={styles.actionIcon}>
                  <User size={22} />
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>
                    {session ? `Bonjour, ${session.user.name.split(' ')[0]} 👋` : 'Bonjour 👋'}
                  </span>
                   <span className={styles.actionMain}>
                    {session ? (
                      session.user.role === 'VENDEUR' ? 'Dashboard' : 
                      session.user.role === 'LIVREUR' ? 'Missions' : 'Dashboard'
                    ) : 'Se connecter'}
                  </span>
                </div>
              </Link>

              <Link href="/favoris" className={styles.actionBtn} id="wishlist-link">
                <div className={styles.actionIconWrapper}>
                  <div className={styles.actionIcon}>
                    <Heart size={22} />
                  </div>
                  {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>Sauvegardés</span>
                  <span className={styles.actionMain}>Favoris</span>
                </div>
              </Link>

              <Link href="/panier" className={styles.cartBtn} id="cart-link">
                <div className={styles.cartIconWrapper}>
                  <ShoppingBag size={24} />
                  {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                </div>
                <div className={styles.actionLabel}>
                  <span className={styles.actionSub}>Votre panier</span>
                  <span className={styles.actionMain}>
                    {cartTotal > 0 ? `${cartTotal.toLocaleString()} CFA` : '0 CFA'}
                  </span>
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
                <Menu size={18} />
                Toutes les Catégories
                <ChevronDown size={14} />
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
                { href: '/', label: 'Accueil', icon: <Home size={18} /> },
                { href: '/nouveautes', label: 'Nouveautés', icon: <Zap size={18} /> },
                { href: '/promotions', label: 'Promotions', icon: <Flame size={18} /> },
                { href: '/fournisseurs', label: 'Fournisseurs', icon: <Factory size={18} /> },
                { href: '/sourcing', label: 'Sourcing B2B', icon: <ClipboardList size={18} /> },
                { href: '/blog', label: 'Actualités', icon: <Newspaper size={18} /> },
              ].map(link => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  <span style={{ marginRight: '6px', display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>
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
