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
  Clock,
  Users,
  UserPlus,
  Video,
  PlayCircle,
  Share2,
  Globe,
  ClipboardList,
  Building,
  CheckCircle2
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './dashboard.module.css';

export default function VendorDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', phone: '', shopRole: 'COMMERCIAL' });
  const [livestreams, setLivestreams] = useState([]);
  const [showAddLive, setShowAddLive] = useState(false);
  const [newLive, setNewLive] = useState({ title: '', description: '', streamUrl: '', featuredProdId: '' });
  const [socialSettings, setSocialSettings] = useState({ 
    facebookUrl: '', instagramUrl: '', tiktokUrl: '', pixelId: '', id: '',
    facebookConnected: false, instagramConnected: false, tiktokConnected: false
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [sourcingRequests, setSourcingRequests] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchVendorData = async () => {
        try {
          setIsLoading(true);
          const queryParam = session.user.role === 'COMMERCIAL' ? `sellerId=${session.user.sellerId}` : `userId=${session.user.id}`;
          const res = await fetch(`/api/products?${queryParam}`);
          const products = res.ok ? await res.json() : [];
          
          if (session.user.role === 'VENDEUR') {
            const staffRes = await fetch('/api/vendors/staff');
            if (staffRes.ok) {
              const staff = await staffRes.json();
              setStaffList(Array.isArray(staff) ? staff : []);
            }
          }
          
          const liveRes = await fetch('/api/vendors/livestreams');
          if (liveRes.ok) {
            const lives = await liveRes.json();
            setLivestreams(Array.isArray(lives) ? lives : []);
          }

          const sourcingRes = await fetch('/api/sourcing');
          if (sourcingRes.ok) {
            const sourcing = await sourcingRes.json();
            setSourcingRequests(Array.isArray(sourcing) ? sourcing : []);
          }

          if (session.user.role === 'VENDEUR') {
            const settingsRes = await fetch('/api/vendors/settings');
            if (settingsRes.ok) {
              const settings = await settingsRes.json();
              setSocialSettings({
                facebookUrl: settings.facebookUrl || '',
                instagramUrl: settings.instagramUrl || '',
                tiktokUrl: settings.tiktokUrl || '',
                pixelId: settings.pixelId || '',
                id: settings.id || '',
                facebookConnected: !!settings.facebookAccessToken,
                instagramConnected: !!settings.instagramAccessToken,
                tiktokConnected: !!settings.tiktokAccessToken
              });
            }
          }

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

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vendors/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      if (res.ok) {
        const addedStaff = await res.json();
        setStaffList([addedStaff, ...staffList]);
        setShowAddStaff(false);
        setNewStaff({ name: '', email: '', password: '', phone: '', shopRole: 'COMMERCIAL' });
        alert('Compte commercial créé avec succès !');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur serveur');
    }
  };

  const handleAddLive = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vendors/livestreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLive)
      });
      if (res.ok) {
        const added = await res.json();
        setLivestreams([added, ...livestreams]);
        setShowAddLive(false);
        setNewLive({ title: '', description: '', streamUrl: '', featuredProdId: '' });
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur lors de la programmation du live');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur serveur');
    }
  };

  const handleUpdateLiveStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/vendors/livestreams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setLivestreams(livestreams.map(l => l.id === id ? updated : l));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/vendors/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialSettings)
      });
      if (res.ok) alert('Paramètres sauvegardés avec succès !');
      else alert('Erreur lors de la sauvegarde');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const feedUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/catalog/${socialSettings.id}/feed` : '';

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

          <div className={styles.sidebarPremiumTop}>
            <div className={styles.premiumPromo}>
              <div className={styles.premiumIcon}><Rocket size={20} /></div>
              <div className={styles.premiumText}>
                <h4>Passez au niveau supérieur</h4>
                <p>Outils analytics & ventes boostées.</p>
                <Link href="/vendeur/tarifs" className={styles.upgradeBtn}>
                  Découvrir Premium
                </Link>
              </div>
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
            
            {session?.user?.role === 'VENDEUR' && (
              <button 
                className={`${styles.navItem} ${activeTab === 'team' ? styles.active : ''}`}
                onClick={() => setActiveTab('team')}
              >
                <Users size={20} />
                <span>Mon Équipe</span>
              </button>
            )}
            
            <button 
              className={`${styles.navItem} ${activeTab === 'live' ? styles.active : ''}`}
              onClick={() => setActiveTab('live')}
            >
              <Video size={20} />
              <span>Live Shopping</span>
            </button>

            <button 
              className={`${styles.navItem} ${activeTab === 'sourcing' ? styles.active : ''}`}
              onClick={() => setActiveTab('sourcing')}
            >
              <ClipboardList size={20} />
              <span>Opportunités B2B</span>
              {sourcingRequests.length > 0 && (
                <span className={styles.navBadge} style={{ background: 'var(--green)' }}>{sourcingRequests.length}</span>
              )}
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
            
            {activeTab === 'team' && (
              <div className={styles.teamDashboard}>
                <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Mon Équipe Commerciale</h2>
                  <button className={styles.primaryBtn} onClick={() => setShowAddStaff(true)}>
                    <UserPlus size={18} />
                    <span>Nouveau Membre</span>
                  </button>
                </div>

                {showAddStaff && (
                  <div className={styles.card} style={{ marginBottom: '24px', padding: '24px' }}>
                    <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ajouter un compte commercial</h3>
                    </div>
                    <form onSubmit={handleAddStaff}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Nom complet</label>
                          <input type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Email de connexion</label>
                          <input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Mot de passe temporaire</label>
                          <input type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Téléphone (Optionnel)</label>
                          <input type="text" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Rôle défini</label>
                          <select value={newStaff.shopRole} onChange={e => setNewStaff({...newStaff, shopRole: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                            <option value="COMMERCIAL">Commercial / Vendeur</option>
                            <option value="MANAGER">Manager / Gérant</option>
                            <option value="SUPPORT">Service Client</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowAddStaff(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}>Annuler</button>
                        <button type="submit" className={styles.primaryBtn} style={{ padding: '10px 20px' }}>Créer le compte</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className={styles.card}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Email / Contact</th>
                          <th>Rôle</th>
                          <th>Statut</th>
                          <th>Date de création</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.length > 0 ? (
                          staffList.map(staff => (
                            <tr key={staff.id}>
                              <td className={styles.fw600}>{staff.user.name}</td>
                              <td>{staff.user.email}<br/><small style={{color: '#6b7280'}}>{staff.user.phone || 'Non renseigné'}</small></td>
                              <td>
                                <span style={{ padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>{staff.shopRole}</span>
                              </td>
                              <td>
                                <span className={staff.user.isActive ? styles.statusActive : styles.stockOut}>
                                  {staff.user.isActive ? 'Actif' : 'Inactif'}
                                </span>
                              </td>
                              <td>{new Date(staff.createdAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className={styles.emptyState}>
                              <div className={styles.emptyIcon}><Users size={32} /></div>
                              <h3>Aucun membre dans l'équipe</h3>
                              <p>Vous êtes seul pour le moment. Ajoutez des commerciaux pour vous aider à gérer la boutique.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'live' && (
              <div className={styles.teamDashboard}>
                <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Live Shopping Studio</h2>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Planifiez et gérez vos directs pour interagir avec vos clients</p>
                  </div>
                  <button className={styles.primaryBtn} onClick={() => setShowAddLive(!showAddLive)}>
                    <Video size={18} />
                    <span>Nouveau Live</span>
                  </button>
                </div>

                {showAddLive && (
                  <div className={styles.card} style={{ marginBottom: '24px', padding: '24px' }}>
                    <div className={styles.cardHeader} style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Programmer un Live Shopping</h3>
                    </div>
                    <form onSubmit={handleAddLive}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Titre du Live</label>
                          <input type="text" value={newLive.title} onChange={e => setNewLive({...newLive, title: e.target.value})} placeholder="Ex: Grand destockage de fin d'année !" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Description (Optionnel)</label>
                          <textarea value={newLive.description} onChange={e => setNewLive({...newLive, description: e.target.value})} placeholder="De quoi allez-vous parler ?" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', minHeight: '80px' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Produit principal à présenter</label>
                            <select value={newLive.featuredProdId} onChange={e => setNewLive({...newLive, featuredProdId: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                              <option value="">Sélectionner un produit</option>
                              {vendorData?.products?.map(p => (
                                <option key={p.id} value={p.id}>{p.name} - {p.price} FCFA</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowAddLive(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}>Annuler</button>
                        <button type="submit" className={styles.primaryBtn} style={{ padding: '10px 20px' }}>Créer le Live</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className={styles.card}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Direct</th>
                          <th>Produit mis en avant</th>
                          <th>Statut</th>
                          <th>Spectateurs</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {livestreams.length > 0 ? (
                          livestreams.map(live => (
                            <tr key={live.id}>
                              <td className={styles.fw600}>
                                {live.title}
                                <br/><small style={{color: '#6b7280'}}>{new Date(live.createdAt).toLocaleDateString('fr-FR')}</small>
                              </td>
                              <td>{live.product?.name || 'Aucun'}</td>
                              <td>
                                {live.status === 'LIVE' ? (
                                  <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', width: 'max-content' }}><div className={styles.pulseDot} style={{width:'8px',height:'8px',background:'red',borderRadius:'50%'}}></div> En Direct</span>
                                ) : live.status === 'SCHEDULED' ? (
                                  <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>Programmé</span>
                                ) : (
                                  <span style={{ padding: '4px 8px', background: '#f3f4f6', color: '#4b5563', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>Terminé</span>
                                )}
                              </td>
                              <td>{live.viewersCount} <Users size={14} style={{verticalAlign:'middle'}}/></td>
                              <td>
                                {live.status === 'SCHEDULED' && (
                                  <Link href={`/vendeur/live/${live.id}`} style={{ textDecoration: 'none', padding: '6px 12px', background: 'var(--orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', width: 'max-content' }}>
                                    <Video size={14} /> Entrer dans le Studio
                                  </Link>
                                )}
                                {live.status === 'LIVE' && (
                                  <Link href={`/vendeur/live/${live.id}`} style={{ textDecoration: 'none', padding: '6px 12px', background: '#111827', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', width: 'max-content' }}>
                                    <PlayCircle size={14} /> Rejoindre le Studio
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className={styles.emptyState}>
                              <div className={styles.emptyIcon}><Video size={32} /></div>
                              <h3>Aucun Live programmé</h3>
                              <p>Interagissez avec vos clients en vidéo et augmentez vos ventes en créant votre premier événement Live Shopping.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={styles.teamDashboard}>
                <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Canaux de vente & Réseaux Sociaux</h2>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Connectez votre boutique à Facebook, Instagram et TikTok pour vendre plus.</p>
                </div>

                <div className={styles.card} style={{ marginBottom: '24px', padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={18} color="var(--orange)" /> Exporter votre Catalogue (Flux XML)
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '16px' }}>
                    Utilisez cette URL dans <strong>Facebook Commerce Manager</strong> ou <strong>TikTok Seller Center</strong> pour synchroniser automatiquement vos produits avec vos boutiques sociales.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={feedUrl} 
                      style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', color: '#4b5563', fontFamily: 'monospace' }}
                    />
                    <button 
                      onClick={() => { navigator.clipboard.writeText(feedUrl); alert('URL copiée !'); }}
                      style={{ padding: '12px 20px', background: '#111827', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Copier l'URL
                    </button>
                  </div>
                </div>

                <div className={styles.card} style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '24px' }}>Liens et Tracking Social</h3>
                  <form onSubmit={handleSaveSettings}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} /> Page Facebook URL</label>
                          {socialSettings.facebookConnected && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>✓ API Connectée</span>
                          )}
                        </div>
                        <input type="url" placeholder="https://facebook.com/maboutique" value={socialSettings.facebookUrl} onChange={e => setSocialSettings({...socialSettings, facebookUrl: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} /> Page Instagram URL</label>
                          {socialSettings.instagramConnected && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>✓ API Connectée</span>
                          )}
                        </div>
                        <input type="url" placeholder="https://instagram.com/maboutique" value={socialSettings.instagramUrl} onChange={e => setSocialSettings({...socialSettings, instagramUrl: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>TikTok URL</label>
                          {socialSettings.tiktokConnected && (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>✓ API Connectée</span>
                          )}
                        </div>
                        <input type="url" placeholder="https://tiktok.com/@maboutique" value={socialSettings.tiktokUrl} onChange={e => setSocialSettings({...socialSettings, tiktokUrl: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>ID du Pixel Facebook / TikTok (Optionnel)</label>
                        <input type="text" placeholder="Ex: 1234567890" value={socialSettings.pixelId} onChange={e => setSocialSettings({...socialSettings, pixelId: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Permet de suivre les conversions sur votre vitrine publique Tieba Market.</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" disabled={isSavingSettings} className={styles.primaryBtn} style={{ padding: '12px 24px', fontSize: '1rem' }}>
                        {isSavingSettings ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'sourcing' && (
              <div className={styles.teamDashboard}>
                <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Opportunités de Sourcing B2B</h2>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                    Répondez aux appels d'offres des acheteurs et développez votre activité de gros.
                  </p>
                </div>

                <div className={styles.card}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Produit Recherché</th>
                          <th>Quantité</th>
                          <th>Localisation</th>
                          <th>Échéance</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sourcingRequests.length > 0 ? (
                          sourcingRequests.map(req => (
                            <tr key={req.id}>
                              <td>
                                <div className={styles.fw600}>{req.productName}</div>
                                <small style={{ color: 'var(--orange)', fontWeight: 'bold' }}>{req.category}</small>
                              </td>
                              <td>{req.quantity}</td>
                              <td><MapPin size={14} style={{verticalAlign:'middle'}}/> {req.location}</td>
                              <td>
                                <span style={{ color: new Date(req.deadline) < new Date() ? '#ef4444' : '#4b5563' }}>
                                  {new Date(req.deadline).toLocaleDateString('fr-FR')}
                                </span>
                              </td>
                              <td>
                                <button className={styles.primaryBtn} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                  Envoyer un devis
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className={styles.emptyState}>
                              <div className={styles.emptyIcon}><ClipboardList size={32} /></div>
                              <h3>Aucune demande en cours</h3>
                              <p>Les appels d'offres des acheteurs apparaîtront ici dès qu'ils seront publiés.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'orders' || activeTab === 'wallet') && (
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>
                  {activeTab === 'orders' && <ShoppingCart size={40} />}
                  {activeTab === 'wallet' && <Wallet size={40} />}
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
