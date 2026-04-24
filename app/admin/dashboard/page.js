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
      <p>Liste et gestion de tous les acheteurs et livreurs inscrits sur la plateforme.</p>
      {/* Here you could map through actual users fetched from another API route */}
      <div className={styles.loading}>Module en cours de construction...</div>
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
      <h2>Paramètres de la Plateforme</h2>
      <p>Configuration des frais de livraison globaux, bannières d'accueil et SEO.</p>
      <div className={styles.loading}>Module en cours de construction...</div>
    </div>
  )}

  </main>
</div>
</div>
<Footer />
</>
);
}
