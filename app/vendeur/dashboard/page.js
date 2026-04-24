'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wallet, 
  Settings, 
  LogOut, 
  Rocket, 
  Star, 
  Edit2, 
  Trash2, 
  Plus,
  Store,
  TrendingUp,
  Activity,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './dashboard.module.css';

export default function VendorDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchVendorData = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/products?sellerId=${session.user.id}`);
          const products = await res.json();
          
          setVendorData({
            plan: 'BUSINESS',
            balance: 1250000,
            salesCount: 145,
            activeOrders: 4,
            rating: 4.8,
            products: products,
            recentOrders: [
              { id: '1042', customer: 'Moussa Fofana', total: 45000, status: 'En préparation', date: 'Aujourd\'hui' },
              { id: '1041', customer: 'Awa Koné', total: 12000, status: 'Livré', date: 'Hier' },
              { id: '1040', customer: 'Jean Koffi', total: 85000, status: 'Expédié', date: 'Hier' }
            ]
          });
        } catch (err) {
          console.error('Error fetching vendor products:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVendorData();
    }
  }, [session]);

  if (isLoading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Chargement de votre espace de travail...</p>
    </div>
  );

  return (
    <>
      <Header />
      <div className={styles.dashboardLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarProfile}>
            <div className={styles.avatar}>
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className={styles.profileInfo}>
              <h3>{session?.user?.name || 'Boutique'}</h3>
              <span className={styles.planBadge}>
                <Star className={styles.badgeIcon} size={12} />
                {vendorData?.plan || 'STARTER'}
              </span>
            </div>
          </div>
          
          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={20} />
              <span>Vue d'ensemble</span>
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={20} />
              <span>Mes Produits</span>
            </button>
            {session?.user?.id && (
              <Link 
                href={`/boutique/${session.user.id}`}
                className={styles.navItem}
                style={{ textDecoration: 'none' }}
              >
                <Store size={20} />
                <span>Voir ma boutique</span>
              </Link>
            )}
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={20} />
              <span>Commandes</span>
              {vendorData?.activeOrders > 0 && (
                <span className={styles.navBadge}>{vendorData.activeOrders}</span>
              )}
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'wallet' ? styles.active : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              <Wallet size={20} />
              <span>Portefeuille</span>
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Paramètres</span>
            </button>
            
            <div className={styles.navSpacer}></div>
            
            <button 
              className={`${styles.navItem} ${styles.logoutBtn}`}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut size={20} />
              <span>Se déconnecter</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.premiumPromo}>
              <div className={styles.premiumIcon}><Rocket size={24} /></div>
              <h4>Passez au niveau supérieur</h4>
              <p>Débloquez des outils analytics avancés et augmentez vos ventes.</p>
              <Link href="/vendeur/tarifs" className={styles.upgradeBtn}>
                Découvrir Premium
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.mainHeader}>
            <div className={styles.headerGreeting}>
              <h1>Bonjour, {session?.user?.name ? session.user.name.split(' ')[0] : 'Vendeur'}</h1>
              <p>Voici un récapitulatif de l'activité de votre boutique aujourd'hui.</p>
            </div>
            <div className={styles.headerActions}>

              <Link href="/vendeur/produits/nouveau" className={styles.primaryBtn} style={{ textDecoration: 'none' }}>
                <Plus size={18} />
                <span>Nouveau Produit</span>
              </Link>
            </div>
          </header>

          {/* Tab Content */}
          <div className={styles.contentSection}>
            {activeTab === 'overview' && (
              <div className={styles.overviewDashboard}>
                
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                      <Wallet size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <span className={styles.statLabel}>Chiffre d'affaires</span>
                      <div className={styles.statValue}>{vendorData.balance.toLocaleString()} <small>FCFA</small></div>
                      <div className={styles.statTrend}>
                        <TrendingUp size={16} className={styles.trendUpIcon} />
                        <span className={styles.trendUp}>+12.5%</span> <span className={styles.trendText}>ce mois</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
                      <ShoppingCart size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <span className={styles.statLabel}>Commandes actives</span>
                      <div className={styles.statValue}>{vendorData.activeOrders}</div>
                      <div className={styles.statTrend}>
                        <Activity size={16} className={styles.trendNeutralIcon} />
                        <span className={styles.trendNeutral}>En cours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                      <Star size={24} />
                    </div>
                    <div className={styles.statContent}>
                      <span className={styles.statLabel}>Note Boutique</span>
                      <div className={styles.statValue}>{vendorData.rating} <small>/ 5</small></div>
                      <div className={styles.statTrend}>
                        <span className={styles.trendText}>Sur 45 avis clients</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.overviewGrid}>
                  {/* Recent Orders */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2>Commandes Récentes</h2>
                      <button className={styles.viewAllBtn}>
                        Tout voir <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Commande</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorData.recentOrders.map(order => (
                            <tr key={order.id}>
                              <td className={styles.fw500}>#{order.id}</td>
                              <td>{order.customer}</td>
                              <td className={styles.fw600}>{order.total.toLocaleString()} FCFA</td>
                              <td><span className={styles.dateLabel}><Clock size={12} /> {order.date}</span></td>
                              <td><span className={`${styles.statusBadge} ${styles['status' + order.status.replace(/ /g, '')]}`}>{order.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className={styles.sideCards}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2>Activité</h2>
                      </div>
                      <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                          <div className={styles.activityIcon}><Package size={16} /></div>
                          <div className={styles.activityDetails}>
                            <p>Produit <strong>Sac Cacao 50kg</strong> ajouté</p>
                            <span>Il y a 2 heures</span>
                          </div>
                        </div>
                        <div className={styles.activityItem}>
                          <div className={styles.activityIcon}><ShoppingCart size={16} /></div>
                          <div className={styles.activityDetails}>
                            <p>Nouvelle commande <strong>#1042</strong></p>
                            <span>Il y a 5 heures</span>
                          </div>
                        </div>
                        <div className={styles.activityItem}>
                          <div className={styles.activityIcon}><Star size={16} /></div>
                          <div className={styles.activityDetails}>
                            <p>Nouvel avis 5 étoiles reçu</p>
                            <span>Hier</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Mes Produits en Ligne ({vendorData.products.length})</h2>
                  <div className={styles.tableActions}>
                    <input type="text" placeholder="Rechercher un produit..." className={styles.searchInput} />
                  </div>
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Statut</th>
                        <th className={styles.textRight}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.products.length > 0 ? (
                        vendorData.products.map(product => (
                          <tr key={product.id}>
                            <td className={styles.productCell}>
                              <div className={styles.productImageMini}>
                                {product.image ? (
                                  <Image src={product.image} alt={product.name} width={40} height={40} className={styles.productImg} />
                                ) : (
                                  <Package size={20} className={styles.placeholderIcon} />
                                )}
                              </div>
                              <div className={styles.productInfo}>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productCat}>{product.categoryId}</span>
                              </div>
                            </td>
                            <td className={styles.fw600}>{product.price.toLocaleString()} FCFA</td>
                            <td>
                              <span className={`${styles.stockBadge} ${product.inStock ? styles.stockIn : styles.stockOut}`}>
                                {product.inStock ? 'En stock' : 'Rupture'}
                              </span>
                            </td>
                            <td><span className={styles.statusActive}>Publié</span></td>
                            <td className={styles.textRight}>
                              <div className={styles.actionButtons}>
                                <button className={styles.iconBtn} title="Modifier"><Edit2 size={16} /></button>
                                <button className={`${styles.iconBtn} ${styles.dangerBtn}`} title="Supprimer"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className={styles.emptyState}>
                            <div className={styles.emptyIcon}><Package size={32} /></div>
                            <h3>Aucun produit trouvé</h3>
                            <p>Commencez par ajouter votre premier produit à la boutique.</p>
                            <button className={styles.primaryBtn} style={{ marginTop: '16px' }}>
                              <Plus size={18} /> Ajouter un produit
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {(activeTab === 'orders' || activeTab === 'wallet' || activeTab === 'settings') && (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>
                  {activeTab === 'orders' && <ShoppingCart size={40} />}
                  {activeTab === 'wallet' && <Wallet size={40} />}
                  {activeTab === 'settings' && <Settings size={40} />}
                </div>
                <h3>Module en développement</h3>
                <p>Cette fonctionnalité sera bientôt disponible dans votre espace Vendeur.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
