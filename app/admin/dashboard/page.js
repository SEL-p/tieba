'use client';
import { useState, useEffect } from 'react';
import { 
  Users, ShoppingBag, DollarSign, AlertCircle, 
  CheckCircle, XCircle, FileText, Activity, LogOut, Settings
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Box');
  const [newCatColor, setNewCatColor] = useState('#f97316');
  const [settingsTab, setSettingsTab] = useState('categories');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Stats (Overview)
  useEffect(() => {
    if (activeTab === 'overview') {
      const fetchStats = async () => {
        try {
          setIsLoading(true);
          const res = await fetch('/api/admin');
          const data = await res.json();
          setStats(data.stats);
          setPendingVendors(data.pendingVendors);
        } catch (error) {
          console.error('Error fetching admin data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  // Fetch All Vendors
  useEffect(() => {
    if (activeTab === 'vendors') {
      const fetchVendors = async () => {
        try {
          const res = await fetch('/api/admin/vendors');
          const data = await res.json();
          setAllVendors(data);
        } catch (error) {
          console.error('Error fetching vendors:', error);
        }
      };
      fetchVendors();
    }
  }, [activeTab]);

  // Fetch All Users
  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        try {
          const res = await fetch('/api/admin/users');
          const data = await res.json();
          setAllUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch Categories for Settings
  useEffect(() => {
    if (activeTab === 'settings') {
      const fetchCategories = async () => {
        try {
          const res = await fetch('/api/categories');
          const data = await res.json();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }
  }, [activeTab]);

  const updateVendorStatus = async (sellerId, verified) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, verified })
      });
      if (res.ok) {
        setAllVendors(prev => prev.map(v => v.id === sellerId ? { ...v, verified } : v));
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive })
      });
      if (res.ok) {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive } : u));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, icon: newCatIcon, color: newCatColor })
      });
      if (res.ok) {
        const added = await res.json();
        setCategories([added, ...categories]);
        setNewCatName('');
      } else {
        alert('Erreur: la catégorie existe peut-être déjà.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (isLoading) return <div className={styles.loading}>Chargement de l'administration...</div>;

  return (
    <>
      <Header />
      <div className={styles.adminContainer}>
        <div className={styles.dashboardLayout}>
          
          {/* Admin Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarProfile}>
              <div className={styles.avatar}>
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h3>{session?.user?.name || 'Administrateur'}</h3>
                <span className={styles.adminBadge}>SUPER ADMIN</span>
              </div>
            </div>
            
            <nav className={styles.nav}>
              <button 
                className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={18} /> Vue d'ensemble
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} /> Utilisateurs
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'vendors' ? styles.active : ''}`}
                onClick={() => setActiveTab('vendors')}
              >
                <ShoppingBag size={18} /> Vendeurs
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'finances' ? styles.active : ''}`}
                onClick={() => setActiveTab('finances')}
              >
                <DollarSign size={18} /> Finances
              </button>
              <button 
                className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} /> Paramètres
              </button>
              
              <button 
                className={styles.navItem}
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{ marginTop: 'auto', color: '#ef4444' }}
              >
                <LogOut size={18} /> Se déconnecter
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className={styles.mainContent}>
            {activeTab === 'overview' && (
              <>
                <header className={styles.header}>
            <h1>👑 Administration Tiéba</h1>
            <div className={styles.systemStatus}>
              <span className={styles.pulse}></span> Système Opérationnel
            </div>
          </header>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <small>Volume de Ventes (GMV)</small>
              <strong>{stats.totalSales.toLocaleString()} CFA</strong>
            </div>
            <div className={styles.statCard}>
              <small>Commissions (2%)</small>
              <strong style={{ color: 'var(--green)' }}>{stats.totalCommissions.toLocaleString()} CFA</strong>
            </div>
            <div className={styles.statCard}>
              <small>Vendeurs en attente</small>
              <strong style={{ color: 'var(--orange)' }}>{stats.pendingVendors}</strong>
            </div>
            <div className={styles.statCard}>
              <small>Litiges actifs</small>
              <strong style={{ color: '#ef4444' }}>{stats.disputes}</strong>
            </div>
          </div>

          <div className={styles.mainGrid}>
            {/* Vendor Approvals */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>🏪 Validation des Vendeurs</h2>
                <button className={styles.btnOutline}>Voir tout</button>
              </div>
              <div className={styles.list}>
                {pendingVendors.map(v => (
                  <div key={v.id} className={styles.item}>
                    <div>
                      <h3>{v.store}</h3>
                      <p>{v.name} • Inscrit le {v.date}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button className={styles.btnCheck}>📄 Voir RCCM</button>
                      <button className={styles.btnApprove}>Approuver</button>
                      <button className={styles.btnReject}>Refuser</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Commissions & Finances */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>💸 Finances & Commissions</h2>
              </div>
              <div className={styles.financeTable}>
                <div className={styles.financeRow}>
                  <span>Commissions Ventes (Mois)</span>
                  <strong>+ { (stats.totalSales * 0.02).toLocaleString() } CFA</strong>
                </div>
                <div className={styles.financeRow}>
                  <span>Commissions Livraisons (Mois)</span>
                  <strong>+ 124,500 CFA</strong>
                </div>
                <div className={styles.financeRow}>
                  <span>Abonnements (SaaS)</span>
                  <strong>+ 340,000 CFA</strong>
                </div>
                <div className={styles.totalRow}>
                  <span>Revenu Net Tiéba</span>
                  <strong>1,368,500 CFA</strong>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

  {activeTab === 'users' && (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      <p style={{ marginBottom: '24px', color: '#64748b' }}>Liste et gestion de tous les acheteurs et livreurs inscrits sur la plateforme.</p>
      
      <div className={styles.list}>
        {allUsers.map(u => (
          <div key={u.id} className={styles.item}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: u.role === 'LIVREUR' ? '#dbeafe' : '#f1f5f9', color: u.role === 'LIVREUR' ? '#1e3a8a' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {u.name || 'Utilisateur Anonyme'} 
                  <span style={{ fontSize: '11px', padding: '2px 6px', background: u.role === 'LIVREUR' ? '#bfdbfe' : '#e2e8f0', borderRadius: '4px' }}>{u.role}</span>
                </h3>
                <p>Email: {u.email} {u.phone && `| Tél: ${u.phone}`}</p>
                <p>Inscrit le: {new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.itemActions}>
              {!u.isActive ? (
                <button 
                  className={styles.btnApprove}
                  onClick={() => updateUserStatus(u.id, true)}
                >
                  Débloquer
                </button>
              ) : (
                <button 
                  className={styles.btnReject}
                  onClick={() => updateUserStatus(u.id, false)}
                >
                  Bloquer
                </button>
              )}
            </div>
          </div>
        ))}
        {allUsers.length === 0 && (
          <div className={styles.loading}>Aucun utilisateur trouvé.</div>
        )}
      </div>
    </div>
  )}

  {activeTab === 'vendors' && (
    <div>
      <h2>Gestion des Vendeurs</h2>
      <p style={{ marginBottom: '24px', color: '#64748b' }}>Validation des RCCM, suspension de comptes et gestion des vendeurs de la marketplace.</p>
      
      <div className={styles.list}>
        {allVendors.map(v => (
          <div key={v.id} className={styles.item}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {v.businessName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {v.businessName} 
                  {v.verified && <CheckCircle size={14} color="#16a34a" />}
                </h3>
                <p>Propriétaire: {v.user?.name} | Email: {v.user?.email}</p>
                <p>Créé le: {new Date(v.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.btnCheck}>📄 Voir RCCM</button>
              {!v.verified ? (
                <button 
                  className={styles.btnApprove}
                  onClick={() => updateVendorStatus(v.id, true)}
                >
                  Approuver
                </button>
              ) : (
                <button 
                  className={styles.btnReject}
                  onClick={() => updateVendorStatus(v.id, false)}
                >
                  Suspendre
                </button>
              )}
            </div>
          </div>
        ))}
        {allVendors.length === 0 && (
          <div className={styles.loading}>Aucun vendeur trouvé.</div>
        )}
      </div>
    </div>
  )}

  {activeTab === 'finances' && (
    <div>
      <h2>Finances & Rapports</h2>
      <p>Historique complet des transactions, paiements et calcul des revenus nets.</p>
      <div className={styles.loading}>Module en cours de construction...</div>
    </div>
  )}

  {activeTab === 'settings' && (
    <div>
      <h2>Paramètres & Configuration</h2>
      <p style={{ marginBottom: '24px', color: '#64748b' }}>Gérez les différents aspects techniques et commerciaux de la plateforme.</p>
      
      {/* Sub-navigation for Settings */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <button 
          onClick={() => setSettingsTab('categories')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: settingsTab === 'categories' ? '#fff7ed' : 'transparent', color: settingsTab === 'categories' ? '#ea580c' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🏷️ Catégories
        </button>
        <button 
          onClick={() => setSettingsTab('delivery')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: settingsTab === 'delivery' ? '#fff7ed' : 'transparent', color: settingsTab === 'delivery' ? '#ea580c' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🚚 Frais de Livraison
        </button>
        <button 
          onClick={() => setSettingsTab('banners')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: settingsTab === 'banners' ? '#fff7ed' : 'transparent', color: settingsTab === 'banners' ? '#ea580c' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🖼️ Bannières
        </button>
        <button 
          onClick={() => setSettingsTab('general')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: settingsTab === 'general' ? '#fff7ed' : 'transparent', color: settingsTab === 'general' ? '#ea580c' : '#64748b', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ⚙️ Général
        </button>
      </div>

      {/* Sub-tab: Categories */}
      {settingsTab === 'categories' && (
        <>
          <section className={styles.section} style={{ marginBottom: '32px' }}>
            <div className={styles.sectionHeader}>
              <h3>Ajouter une Catégorie</h3>
            </div>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Nom de la catégorie</label>
                <input 
                  type="text" 
                  value={newCatName} 
                  onChange={e => setNewCatName(e.target.value)} 
                  placeholder="Ex: Électronique" 
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ width: '150px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Icône (Lucide)</label>
                <input 
                  type="text" 
                  value={newCatIcon} 
                  onChange={e => setNewCatIcon(e.target.value)} 
                  placeholder="Ex: Smartphone" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ width: '100px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Couleur</label>
                <input 
                  type="color" 
                  value={newCatColor} 
                  onChange={e => setNewCatColor(e.target.value)} 
                  style={{ width: '100%', height: '42px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
              </div>
              <button type="submit" className={styles.btnApprove} style={{ padding: '12px 24px', fontSize: '14px' }}>
                Ajouter
              </button>
            </form>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Catégories Existantes</h3>
            </div>
            <div className={styles.list}>
              {categories.map(c => (
                <div key={c.id} className={styles.item}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: c.color || '#f1f5f9', opacity: 0.8 }} />
                    <div>
                      <h3 style={{ margin: 0 }}>{c.name}</h3>
                      <small style={{ color: '#64748b' }}>Icône: {c.icon || 'Aucune'} | Produits liés: {c._count?.products || 0}</small>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteCategory(c.id)} 
                    className={styles.btnReject}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className={styles.loading}>Aucune catégorie.</p>}
            </div>
          </section>
        </>
      )}

      {/* Sub-tab: Delivery */}
      {settingsTab === 'delivery' && (
        <section className={styles.section}>
          <h3>Configuration des Frais de Livraison</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>Définissez les frais de base et le pourcentage alloué au livreur.</p>
          <div className={styles.loading}>Module en cours de construction...</div>
        </section>
      )}

      {/* Sub-tab: Banners */}
      {settingsTab === 'banners' && (
        <section className={styles.section}>
          <h3>Gestion des Bannières</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>Ajoutez ou supprimez des bannières pour la page d'accueil (Carousel).</p>
          <div className={styles.loading}>Module en cours de construction...</div>
        </section>
      )}

      {/* Sub-tab: General */}
      {settingsTab === 'general' && (
        <section className={styles.section}>
          <h3>Paramètres Généraux</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>Informations de contact, Liens réseaux sociaux et SEO.</p>
          <div className={styles.loading}>Module en cours de construction...</div>
        </section>
      )}
    </div>
  )}

  </main>
</div>
</div>
<Footer />
</>
);
}
