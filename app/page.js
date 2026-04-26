'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, Globe, BadgeCheck, 
  Sprout, Scissors, Soup, Brush, Diamond, Cpu, Activity, Briefcase,
  ChevronRight, User
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { formatPrice } from './data/mockData';
import styles from './page.module.css';

// Flash deal timer component
function CountdownTimer({ timeLeft }) {
  const [time, setTime] = useState(timeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return prev;
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.timer}>
      <div className={styles.timeBlock}><span>{pad(time.hours)}</span><small>h</small></div>
      <span className={styles.timeSep}>:</span>
      <div className={styles.timeBlock}><span>{pad(time.minutes)}</span><small>m</small></div>
      <span className={styles.timeSep}>:</span>
      <div className={styles.timeBlock}><span>{pad(time.seconds)}</span><small>s</small></div>
    </div>
  );
}

// Hero Slider
const heroSlides = [
  {
    id: 1,
    title: 'La Plateforme\nIvoirienne Pro',
    subtitle: 'Achetez et vendez des produits authentiques de Côte d\'Ivoire. Cacao, pagnes, artisanat et bien plus.',
    cta: 'Explorer le marché',
    ctaSecondary: 'Devenir vendeur',
    badge: '🇨🇮 Made in Côte d\'Ivoire',
    image: '/hero_banner.png',
    accent: 'var(--orange)',
  },
  {
    id: 2,
    title: 'Pagnes & Textiles\nAuthentiques',
    subtitle: 'Découvrez notre sélection premium de pagnes wax, kente et bazin. Direct des artisans ivoiriens.',
    cta: 'Voir les pagnes',
    ctaSecondary: 'Voir les offres',
    badge: '🎁 -30% cette semaine',
    image: '/category_textile.png',
    accent: '#7C3AED',
  },
  {
    id: 3,
    title: 'Sourcing B2B\nDirect Producteurs',
    subtitle: 'Connectez-vous directement avec les meilleurs fournisseurs ivoiriens. Cacao, cajou, café bio certifié.',
    cta: 'Sourcing B2B',
    ctaSecondary: 'Voir les fournisseurs',
    badge: '✅ Fournisseurs certifiés',
    image: '/category_cocoa.png',
    accent: 'var(--green)',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('populaires');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const slideInterval = useRef(null);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval.current);
  }, []);

  const goToSlide = (i) => {
    setCurrentSlide(i);
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  const filteredProducts = activeTab === 'populaires'
    ? products
    : activeTab === 'nouveaux'
    ? products.slice(0, 4)
    : products.slice(4, 8);

  const slide = heroSlides[currentSlide];

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* ===== HERO SECTION (Alibaba Style) ===== */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroGrid}>
              
              {/* 1. Left Sidebar: Categories */}
              <aside className={styles.heroSidebar}>
                <div className={styles.sidebarHeader}>
                  <h3>Catégories pour vous</h3>
                </div>
                <div className={styles.sidebarList}>
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/categories/${cat.id}`} className={styles.sidebarItem}>
                      <span className={styles.sidebarIcon}>
                        {cat.id === 'agricole' && <Sprout size={18} />}
                        {cat.id === 'textile' && <Scissors size={18} />}
                        {cat.id === 'alimentation' && <Soup size={18} />}
                        {cat.id === 'artisanat' && <Brush size={18} />}
                        {cat.id === 'bijoux' && <Diamond size={18} />}
                        {cat.id === 'electronique' && <Cpu size={18} />}
                        {cat.id === 'beaute' && <Activity size={18} />}
                        {cat.id === 'batiment' && <Briefcase size={18} />}
                      </span>
                      <span className={styles.sidebarName}>{cat.name}</span>
                      <ChevronRight size={14} className={styles.sidebarArrow} />
                    </Link>
                  ))}
                  <Link href="/categories" className={styles.sidebarMore}>Toutes les catégories</Link>
                </div>
              </aside>

              {/* 2. Middle: Carousel */}
              <div className={styles.heroMain}>
                <div className={styles.heroSlider}>
                  {heroSlides.map((s, i) => (
                    <div
                      key={s.id}
                      className={`${styles.heroSlide} ${i === currentSlide ? styles.active : ''}`}
                    >
                      <Image
                        src={s.image}
                        alt={s.title.replace('\n', ' ')}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className={styles.heroImage}
                      />
                      <div className={styles.heroSlideContent}>
                        <span className={styles.slideBadge}>{s.badge}</span>
                        <h2 className={styles.slideTitle}>{s.title}</h2>
                        <Link href="/categories" className="btn btn-primary">Découvrir</Link>
                      </div>
                    </div>
                  ))}
                  <div className={styles.slideDots}>
                    {heroSlides.map((_, i) => (
                      <span 
                        key={i} 
                        className={`${styles.slideDot} ${i === currentSlide ? styles.dotActive : ''}`}
                        onClick={() => goToSlide(i)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Right: Account & Small Promos */}
              <aside className={styles.heroRight}>
                <div className={styles.accountCard}>
                  <div className={styles.accountAvatar}>
                    <User size={24} />
                  </div>
                  <p className={styles.accountWelcome}>Bienvenue sur Tieba</p>
                  <div className={styles.accountBtns}>
                    <Link href="/inscription" className={styles.btnJoin}>S'inscrire</Link>
                    <Link href="/connexion" className={styles.btnLogin}>Connexion</Link>
                  </div>
                </div>
                
                <div className={styles.promoCard} style={{ background: '#FFF7ED' }}>
                  <span className={styles.promoLabel}>Offre Spéciale</span>
                  <h4>Nouveaux Vendeurs</h4>
                  <p>0% commission pendant 30 jours</p>
                  <Link href="/vendeur" className={styles.promoLink}>En savoir plus →</Link>
                </div>

                <div className={styles.promoCard} style={{ background: '#ECFDF5' }}>
                  <span className={styles.promoLabel} style={{ background: '#10B981' }}>B2B</span>
                  <h4>Sourcing Direct</h4>
                  <p>Devis gratuit en 24h</p>
                  <Link href="/sourcing" className={styles.promoLink}>Demander →</Link>
                </div>
              </aside>

            </div>
          </div>
        </section>

        {/* ===== SERVICE BANNERS (Alibaba Style) ===== */}
        <div className={styles.promoBanners}>
          <div className="container">
            <div className={styles.promoBannerGrid}>
              {[
                { icon: <ShieldCheck size={28} />, title: 'Protection Tieba', desc: 'Sécurité de la commande au paiement', color: '#16A34A', href: '/protection' },
                { icon: <Globe size={28} />, title: 'Sourcing Direct', desc: 'Connectez-vous aux producteurs', color: '#0EA5E9', href: '/sourcing' },
                { icon: <BadgeCheck size={28} />, title: 'Vendeurs Vérifiés', desc: 'Contrôlés par nos équipes locales', color: '#F59E0B', href: '/fournisseurs' },
              ].map(b => (
                <Link key={b.title} href={b.href} className={styles.promoBanner} style={{ '--accent': b.color }}>
                  <span className={styles.promoBannerIcon} style={{ color: b.color }}>{b.icon}</span>
                  <div>
                    <div className={styles.promoBannerTitle}>{b.title}</div>
                    <div className={styles.promoBannerDesc}>{b.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>



        {/* ===== FLASH DEALS ===== */}
        <section className={styles.flashSection} aria-labelledby="flash-title">
          <div className="container">
            <div className={styles.flashHeader}>
              <div className={styles.flashTitle}>
                <span className={styles.flashIcon}>⚡</span>
                <h2 id="flash-title">Flash Deals</h2>
                <span className={styles.flashSubtitle}>Offres limitées dans le temps</span>
              </div>
              <Link href="/flash" className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                Toutes les offres →
              </Link>
            </div>

            <div className={styles.flashGrid}>
              {/* Using mock flash deals for now as they are time-sensitive/special */}
              {[
                {
                  id: 101,
                  name: 'Café Robusta Ivoirien Torréfié – 1kg',
                  price: 7500,
                  originalPrice: 15000,
                  discount: 50,
                  image: '/category_cocoa.png',
                  timeLeft: { hours: 4, minutes: 23, seconds: 15 },
                  sold: 847,
                  total: 1000,
                }
              ].map(deal => {
                const progress = Math.round((deal.sold / deal.total) * 100);
                return (
                  <div key={deal.id} className={styles.flashCard} id={`flash-${deal.id}`}>
                    <div className={styles.flashImageWrapper}>
                      <Image
                        src={deal.image}
                        alt={deal.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 30vw"
                        className={styles.flashImage}
                      />
                      <div className={styles.flashDiscount}>-{deal.discount}%</div>
                    </div>
                    <div className={styles.flashContent}>
                      <h3 className={styles.flashName}>{deal.name}</h3>
                      <CountdownTimer timeLeft={deal.timeLeft} />
                      <div className={styles.flashPrices}>
                        <span className={styles.flashPrice}>{formatPrice(deal.price)}</span>
                        <span className={styles.flashOriginal}>{formatPrice(deal.originalPrice)}</span>
                      </div>
                      <div className={styles.stockBar}>
                        <div className={styles.stockBarFill} style={{ width: `${progress}%` }} />
                      </div>
                      <p className={styles.stockText}><span>{deal.sold}</span> vendus sur {deal.total}</p>
                      <button className={styles.flashBtn} id={`flash-cart-${deal.id}`}>
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className={styles.section} aria-labelledby="products-title">
          <div className="container">
            <div className="section-header">
              <div>
                <p className={styles.sectionEyebrow}>Sélection du marché</p>
                <h2 className="section-title" id="products-title">Produits Vedettes</h2>
                <div className="divider"></div>
              </div>
              <Link href="/produits" className="btn btn-outline btn-sm">Tout voir →</Link>
            </div>

            {/* Tabs */}
            <div className={styles.productTabs}>
              {[
                { key: 'populaires', label: '🔥 Populaires' },
                { key: 'nouveaux', label: '✨ Nouveaux' },
                { key: 'promos', label: '🎁 En promo' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.productTab} ${activeTab === tab.key ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  id={`tab-${tab.key}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className={styles.productsGrid}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/produits" className="btn btn-primary btn-lg">
                Voir tous les produits →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== WHY TIEBA ===== */}
        <section className={styles.whySection} aria-labelledby="why-title">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className={styles.sectionEyebrow}>Pourquoi nous choisir</p>
              <h2 className="section-title" id="why-title">La Plateforme de Confiance</h2>
              <div className="divider" style={{ margin: '8px auto 0' }}></div>
            </div>
            <div className={styles.whyGrid}>
              {[
                {
                  icon: '🛡️',
                  title: 'Acheteurs Protégés',
                  desc: 'Notre système de garantie protège chaque transaction. Remboursement si le produit ne correspond pas.',
                  color: '#F97316',
                },
                {
                  icon: '✅',
                  title: 'Vendeurs Vérifiés',
                  desc: 'Chaque vendeur est vérifié et certifié par notre équipe. Vous achetez en toute confiance.',
                  color: '#16A34A',
                },
                {
                  icon: '📱',
                  title: 'Paiement Mobile Money',
                  desc: 'Payez facilement via Orange Money, MTN MoMo, Wave ou par carte bancaire.',
                  color: '#7C3AED',
                },
                {
                  icon: '🚚',
                  title: 'Livraison Nationale',
                  desc: 'Livraison dans toutes les villes de Côte d\'Ivoire. Suivi en temps réel de vos commandes.',
                  color: '#0EA5E9',
                },
                {
                  icon: '🤝',
                  title: 'B2B & Sourcing',
                  desc: 'Plateforme dédiée aux professionnels. Négociation directe et contrats sécurisés.',
                  color: '#D97706',
                },
                {
                  icon: '🇨🇮',
                  title: '100% Ivoirien',
                  desc: 'Plateforme conçue pour et par les Ivoiriens. Support en français et en langues locales.',
                  color: '#EF4444',
                },
              ].map(item => (
                <div key={item.title} className={styles.whyCard}>
                  <div className={styles.whyIcon} style={{ background: item.color + '15', color: item.color }}>
                    {item.icon}
                  </div>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TOP SUPPLIERS ===== */}
        <section className={styles.section} aria-labelledby="suppliers-title">
          <div className="container">
            <div className="section-header">
              <div>
                <p className={styles.sectionEyebrow}>Partenaires de confiance</p>
                <h2 className="section-title" id="suppliers-title">Fournisseurs Certifiés</h2>
                <div className="divider"></div>
              </div>
              <Link href="/fournisseurs" className="btn btn-outline btn-sm">Voir tous →</Link>
            </div>

            <div className={styles.suppliersGrid}>
              {/* Mock suppliers for now */}
              {[
                {
                  id: 1,
                  name: 'COOP-CI Export',
                  category: 'Agriculture',
                  rating: 4.9,
                  products: 145,
                  transactions: '5,000+',
                  location: 'Yamoussoukro',
                  verified: true,
                  badge: 'Or',
                  image: '/category_cocoa.png',
                }
              ].map(supplier => (
                <Link key={supplier.id} href={`/fournisseurs/${supplier.id}`} className={styles.supplierCard} id={`supplier-${supplier.id}`}>
                  <div className={styles.supplierHeader}>
                    <div className={styles.supplierAvatar} style={{ position: 'relative' }}>
                      <Image
                        src={supplier.image}
                        alt={supplier.name}
                        fill
                        sizes="60px"
                        className={styles.supplierAvatarImg}
                      />
                    </div>
                    <div className={styles.supplierInfo}>
                      <div className={styles.supplierName}>{supplier.name}</div>
                      <div className={styles.supplierCategory}>{supplier.category}</div>
                    </div>
                    <span className={`badge ${supplier.badge === 'Platine' ? 'badge-gray' : 'badge-gold'}`}>
                      {supplier.badge}
                    </span>
                  </div>
                  <div className={styles.supplierStats}>
                    <div className={styles.supplierStat}>
                      <span className={styles.supplierStatValue}>{supplier.rating}</span>
                      <span className={styles.supplierStatLabel}>Note ⭐</span>
                    </div>
                    <div className={styles.supplierStat}>
                      <span className={styles.supplierStatValue}>{supplier.products}</span>
                      <span className={styles.supplierStatLabel}>Produits</span>
                    </div>
                    <div className={styles.supplierStat}>
                      <span className={styles.supplierStatValue}>{supplier.transactions}</span>
                      <span className={styles.supplierStatLabel}>Ventes</span>
                    </div>
                  </div>
                  <div className={styles.supplierFooter}>
                    <span className={styles.supplierLocation}>📍 {supplier.location}</span>
                    {supplier.verified && (
                      <span className="badge badge-green">✓ Vérifié</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className={styles.ctaBanner}>
          <div className="container">
            <div className={styles.ctaInner}>
              <div className={styles.ctaText}>
                <h2 className={styles.ctaTitle}>Devenez Vendeur sur Tieba</h2>
                <p className={styles.ctaSubtitle}>
                  Rejoignez 3,200+ vendeurs et accédez à des milliers d'acheteurs partout en Côte d'Ivoire et en Afrique.
                  Inscription gratuite, commissions transparentes.
                </p>
                <div className={styles.ctaBenefits}>
                  {['✓ Inscription gratuite', '✓ Dashboard intuitif', '✓ Support dédié', '✓ Paiement rapide'].map(b => (
                    <span key={b} className={styles.ctaBenefit}>{b}</span>
                  ))}
                </div>
              </div>
              <div className={styles.ctaActions}>
                <Link href="/vendeur" className="btn btn-primary btn-lg" id="become-seller-cta">
                  🚀 Commencer à vendre
                </Link>
                <Link href="/vendeur/tarifs" className="btn btn-ghost btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
