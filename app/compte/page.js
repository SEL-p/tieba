'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { featuredProducts, formatPrice } from '../data/mockData';
import styles from './compte.module.css';

const mockUser = {
  name: 'Kouamé Assi',
  email: 'kouame.assi@gmail.com',
  phone: '+225 07 12 34 56',
  location: 'Abidjan, Cocody',
  memberSince: 'Janvier 2024',
  avatar: 'K',
  level: 'Acheteur Premium',
};

const mockOrders = [
  { id: 'TM-2024-001', date: '22 Avril 2026', status: 'Livré', items: 3, total: 145000 },
  { id: 'TM-2024-002', date: '18 Avril 2026', status: 'En transit', items: 1, total: 85000 },
  { id: 'TM-2024-003', date: '10 Avril 2026', status: 'En cours', items: 2, total: 42000 },
];

const statusConfig = {
  'Livré': { color: 'var(--green)', bg: 'rgba(22,163,74,0.1)', icon: '✓' },
  'En transit': { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: '🚚' },
  'En cours': { color: 'var(--orange)', bg: 'rgba(249,115,22,0.1)', icon: '⏳' },
};

const tabs = [
  { key: 'tableau-de-bord', label: '🏠 Tableau de bord', icon: '🏠' },
  { key: 'commandes', label: '📦 Mes commandes', icon: '📦' },
  { key: 'favoris', label: '❤️ Mes favoris', icon: '❤️' },
  { key: 'adresses', label: '📍 Mes adresses', icon: '📍' },
  { key: 'paiements', label: '💳 Paiements', icon: '💳' },
  { key: 'profil', label: '👤 Mon profil', icon: '👤' },
];

export default function ComptePage() {
  const [activeTab, setActiveTab] = useState('tableau-de-bord');
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.userCard}>
                <div className={styles.avatar}>{mockUser.avatar}</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{mockUser.name}</div>
                  <div className={styles.userLevel}>{mockUser.level}</div>
                  <div className={styles.userMember}>Membre depuis {mockUser.memberSince}</div>
                </div>
              </div>

              <nav className={styles.sideNav}>
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`${styles.sideNavItem} ${activeTab === tab.key ? styles.sideNavActive : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                    id={`nav-${tab.key}`}
                  >
                    <span className={styles.navIcon}>{tab.icon}</span>
                    {tab.label.split(' ').slice(1).join(' ')}
                  </button>
                ))}
                <button className={`${styles.sideNavItem} ${styles.logoutBtn}`} id="logout-btn">
                  <span className={styles.navIcon}>🚪</span>
                  Se déconnecter
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div className={styles.content}>

              {/* DASHBOARD */}
              {activeTab === 'tableau-de-bord' && (
                <div className={styles.tabContent}>
                  <h1 className={styles.pageTitle}>Bonjour, {mockUser.name.split(' ')[0]} 👋</h1>
                  <p className={styles.pageSubtitle}>Bienvenue sur votre espace personnel Tieba Market.</p>

                  {/* Stats */}
                  <div className={styles.statsGrid}>
                    {[
                      { icon: '📦', val: '12', lbl: 'Commandes', color: 'var(--orange)' },
                      { icon: '❤️', val: '24', lbl: 'Favoris', color: '#EF4444' },
                      { icon: '⭐', val: '4.9', lbl: 'Ma note', color: 'var(--gold)' },
                      { icon: '💰', val: formatPrice(272000), lbl: 'Total achats', color: 'var(--green)' },
                    ].map(s => (
                      <div key={s.lbl} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ color: s.color, background: s.color + '15' }}>{s.icon}</div>
                        <div>
                          <div className={styles.statVal}>{s.val}</div>
                          <div className={styles.statLbl}>{s.lbl}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders */}
                  <h2 className={styles.sectionTitle}>Commandes récentes</h2>
                  <div className={styles.ordersTable}>
                    {mockOrders.map(order => {
                      const conf = statusConfig[order.status];
                      return (
                        <div key={order.id} className={styles.orderRow} id={`order-${order.id}`}>
                          <div className={styles.orderId}>
                            <span className={styles.orderIdNum}>{order.id}</span>
                            <span className={styles.orderDate}>{order.date}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{order.items} articles</span>
                          </div>
                          <div
                            className={styles.statusBadge}
                            style={{ color: conf.color, background: conf.bg }}
                          >
                            {conf.icon} {order.status}
                          </div>
                          <div className={styles.orderTotal}>{formatPrice(order.total)}</div>
                          <Link href={`/commandes/${order.id}`} className={styles.orderLink}>Détails →</Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommended */}
                  <h2 className={styles.sectionTitle} style={{ marginTop: '32px' }}>Recommandés pour vous</h2>
                  <div className={styles.recommendedGrid}>
                    {featuredProducts.slice(0, 4).map(p => (
                      <Link key={p.id} href={`/produit/${p.id}`} className={styles.miniProductCard} id={`rec-${p.id}`}>
                        <div className={styles.miniProductName}>{p.name.substring(0, 40)}...</div>
                        <div className={styles.miniProductPrice}>{formatPrice(p.price)}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* COMMANDES */}
              {activeTab === 'commandes' && (
                <div className={styles.tabContent}>
                  <h1 className={styles.pageTitle}>Mes Commandes</h1>
                  <div className={styles.orderFilters}>
                    {['Toutes', 'En cours', 'En transit', 'Livré', 'Annulé'].map(f => (
                      <button key={f} className={`${styles.filterChip} ${f === 'Toutes' ? styles.filterChipActive : ''}`} id={`filter-${f}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  {mockOrders.map(order => {
                    const conf = statusConfig[order.status];
                    return (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderCardHeader}>
                          <div>
                            <span className={styles.orderIdNum}>{order.id}</span>
                            <span className={styles.orderDate} style={{ marginLeft: '12px' }}>{order.date}</span>
                          </div>
                          <span className={styles.statusBadge} style={{ color: conf.color, background: conf.bg }}>
                            {conf.icon} {order.status}
                          </span>
                        </div>
                        <div className={styles.orderCardBody}>
                          <span>{order.items} article(s)</span>
                          <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                        </div>
                        <div className={styles.orderCardFooter}>
                          <button className="btn btn-ghost btn-sm">Voir les détails</button>
                          {order.status === 'Livré' && (
                            <button className="btn btn-outline btn-sm">↩️ Retourner</button>
                          )}
                          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                            🔄 Commander à nouveau
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PROFIL */}
              {activeTab === 'profil' && (
                <div className={styles.tabContent}>
                  <div className={styles.profileHeader}>
                    <h1 className={styles.pageTitle}>Mon Profil</h1>
                    <button
                      className={`btn ${editMode ? 'btn-secondary' : 'btn-outline'}`}
                      onClick={() => setEditMode(!editMode)}
                      id="edit-profile-btn"
                    >
                      {editMode ? '✓ Enregistrer' : '✏️ Modifier'}
                    </button>
                  </div>
                  <div className={styles.profileCard}>
                    <div className={styles.profileAvatarSection}>
                      <div className={styles.profileAvatar}>{mockUser.avatar}</div>
                      <button className={styles.changeAvatarBtn}>📸 Changer la photo</button>
                    </div>
                    <div className={styles.profileFields}>
                      {[
                        { label: 'Nom complet', value: mockUser.name, id: 'profile-name' },
                        { label: 'Email', value: mockUser.email, id: 'profile-email' },
                        { label: 'Téléphone', value: mockUser.phone, id: 'profile-phone' },
                        { label: 'Localisation', value: mockUser.location, id: 'profile-location' },
                      ].map(field => (
                        <div key={field.id} className={styles.profileField}>
                          <label className={styles.profileLabel}>{field.label}</label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            disabled={!editMode}
                            className={`input ${styles.profileInput} ${!editMode ? styles.profileInputDisabled : ''}`}
                            id={field.id}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className={styles.securityCard}>
                    <h3 className={styles.securityTitle}>🔒 Sécurité</h3>
                    <div className={styles.securityActions}>
                      <button className="btn btn-outline" id="change-password-btn">Changer le mot de passe</button>
                      <button className="btn btn-outline" id="two-factor-btn">Activer l'authentification 2FA</button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAVORIS */}
              {activeTab === 'favoris' && (
                <div className={styles.tabContent}>
                  <h1 className={styles.pageTitle}>Mes Favoris</h1>
                  <div className={styles.favGrid}>
                    {featuredProducts.slice(0, 6).map(p => (
                      <Link key={p.id} href={`/produit/${p.id}`} className={styles.favCard} id={`fav-${p.id}`}>
                        <div className={styles.favInfo}>
                          <div className={styles.favName}>{p.name}</div>
                          <div className={styles.favSeller}>{p.seller}</div>
                          <div className={styles.favPrice}>{formatPrice(p.price)}</div>
                        </div>
                        <div className={styles.favActions}>
                          <button className="btn btn-primary btn-sm" onClick={e => e.preventDefault()}>Ajouter au panier</button>
                          <button className={styles.removeFavBtn} onClick={e => e.preventDefault()} aria-label="Retirer des favoris">🗑</button>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ADRESSES */}
              {activeTab === 'adresses' && (
                <div className={styles.tabContent}>
                  <div className={styles.profileHeader}>
                    <h1 className={styles.pageTitle}>Mes Adresses</h1>
                    <button className="btn btn-primary" id="add-address-btn">+ Ajouter une adresse</button>
                  </div>
                  {[
                    { id: 1, label: 'Domicile', name: 'Kouamé Assi', address: 'Rue des Jardins, Cocody', city: 'Abidjan', default: true },
                    { id: 2, label: 'Bureau', name: 'Kouamé Assi', address: 'Avenue Chardy, Plateau', city: 'Abidjan', default: false },
                  ].map(addr => (
                    <div key={addr.id} className={styles.addressCard} id={`addr-${addr.id}`}>
                      <div className={styles.addressHeader}>
                        <span className={styles.addressLabel}>{addr.label}</span>
                        {addr.default && <span className="badge badge-green">Par défaut</span>}
                      </div>
                      <p className={styles.addressText}>{addr.name}</p>
                      <p className={styles.addressText}>{addr.address}</p>
                      <p className={styles.addressText}>{addr.city}</p>
                      <div className={styles.addressActions}>
                        <button className="btn btn-ghost btn-sm">Modifier</button>
                        {!addr.default && <button className="btn btn-ghost btn-sm">Définir par défaut</button>}
                        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAIEMENTS */}
              {activeTab === 'paiements' && (
                <div className={styles.tabContent}>
                  <h1 className={styles.pageTitle}>Méthodes de Paiement</h1>
                  <div className={styles.paymentCards}>
                    {[
                      { type: 'Orange Money', number: '+225 07 ** ** 56', icon: '🟠', default: true },
                      { type: 'Wave', number: '+225 05 ** ** 89', icon: '🔵', default: false },
                    ].map((pay, i) => (
                      <div key={i} className={styles.paymentCard} id={`payment-${i}`}>
                        <div className={styles.paymentIcon}>{pay.icon}</div>
                        <div>
                          <div className={styles.paymentType}>{pay.type}</div>
                          <div className={styles.paymentNum}>{pay.number}</div>
                        </div>
                        {pay.default && <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>Par défaut</span>}
                      </div>
                    ))}
                    <button className={styles.addPaymentBtn} id="add-payment-btn">+ Ajouter un moyen de paiement</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
