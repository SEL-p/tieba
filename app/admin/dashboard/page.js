'use client';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 45200000,
    totalCommissions: 904000,
    pendingVendors: 12,
    activeLivreurs: 45,
    disputes: 3
  });

  const [pendingVendors, setPendingVendors] = useState([
    { id: 1, name: 'Samba Diop', store: 'Diop Textiles', date: '2024-04-23', docs: 'Vérifiés' },
    { id: 2, name: 'Grace Amoin', store: 'Beauté Naturelle', date: '2024-04-22', docs: 'En attente' },
  ]);

  return (
    <>
      <Header />
      <div className={styles.adminContainer}>
        <div className="container">
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
        </div>
      </div>
      <Footer />
    </>
  );
}
