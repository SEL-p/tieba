'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './dashboard.module.css';

export default function VendorDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch this from /api/vendor/profile
    // Mocking for now based on our seed data
    setTimeout(() => {
      setVendorData({
        businessName: 'Kouassi Cacao & Co',
        plan: 'BUSINESS',
        balance: 1250000,
        salesCount: 124,
        activeOrders: 8,
        rating: 4.8,
        products: [
          { id: 1, name: 'Cacao en Fèves Premium', stock: 45, price: 85000, status: 'Active' },
          { id: 2, name: 'Noix de Cajou Brutes', stock: 12, price: 42000, status: 'Active' },
        ],
        recentOrders: [
          { id: 'ORD-5421', customer: 'Jean Dupont', total: 85000, status: 'En préparation', date: 'Aujourd\'hui, 10:24' },
          { id: 'ORD-5420', customer: 'Marie Koffi', total: 12500, status: 'Expédié', date: 'Hier, 16:45' },
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) return <div className={styles.loading}>Chargement du dashboard...</div>;

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
            <div>
              <h3>{session?.user?.name || 'Vendeur'}</h3>
              <span className={styles.planBadge}>{vendorData?.plan || 'STARTER'}</span>
            </div>
          </div>
          
          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Vue d'ensemble
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'products' ? styles.active : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Mes Produits
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📝 Commandes
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'wallet' ? styles.active : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              💰 Portefeuille
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Paramètres
            </button>
            <button 
              className={styles.navItem}
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ marginTop: 'auto', color: '#ef4444' }}
            >
              🚪 Se déconnecter
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <Link href="/vendeur/tarifs" className={styles.upgradeBtn}>
              🚀 Passer en Premium
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <header className={styles.mainHeader}>
            <div>
              <h1>Bonjour, {session?.user?.name ? session.user.name.split(' ')[0] : 'Vendeur'} 👋</h1>
              <p>Voici l'activité de votre boutique aujourd'hui.</p>
            </div>
            <div className={styles.headerActions}>
              <button className="btn btn-primary">+ Ajouter un produit</button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Chiffre d'affaires</span>
              <div className={styles.statValue}>1,250,000 <small>FCFA</small></div>
              <span className={`${styles.trend} ${styles.up}`}>+12.5% vs mois dernier</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Commandes actives</span>
              <div className={styles.statValue}>{vendorData.activeOrders}</div>
              <span className={styles.statSub}>4 en attente de livraison</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Note Boutique</span>
              <div className={styles.statValue}>{vendorData.rating} <small>⭐</small></div>
              <span className={styles.statSub}>98% de satisfaction</span>
            </div>
          </div>

          {/* Tab Content */}
          <div className={styles.contentSection}>
            {activeTab === 'overview' && (
              <div className={styles.overviewGrid}>
                {/* Recent Orders */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Commandes Récentes</h2>
                    <button className={styles.viewAll}>Voir tout</button>
                  </div>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.recentOrders.map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>
                          <td>{order.customer}</td>
                          <td>{order.total.toLocaleString()} FCFA</td>
                          <td><span className={styles.statusBadge}>{order.status}</span></td>
                          <td><button className={styles.actionBtn}>Détails</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Commissions Info */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2>Modèle Économique</h2>
                  </div>
                  <div className={styles.commissionBox}>
                    <div className={styles.commItem}>
                      <span>Commission Vente (Tiéba)</span>
                      <strong>2%</strong>
                    </div>
                    <div className={styles.commItem}>
                      <span>Frais Livraison (Livreur)</span>
                      <strong>2%</strong>
                    </div>
                    <p className={styles.commInfo}>
                      *Les commissions sont déduites automatiquement de votre solde lors de la validation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>Mes Produits en Ligne</h2>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorData.products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price.toLocaleString()} FCFA</td>
                        <td>{product.stock}</td>
                        <td><span className={styles.statusBadgeActive}>{product.status}</span></td>
                        <td>
                          <button className={styles.iconBtn}>✏️</button>
                          <button className={styles.iconBtn}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
