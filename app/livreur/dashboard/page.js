'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from './livreur.module.css';

export default function DeliveryDashboard() {
  const [activeMissions, setActiveMissions] = useState([]);
  const [availableMissions, setAvailableMissions] = useState([]);
  const [status, setStatus] = useState('ACTIF');
  const [stats, setStats] = useState({ earnings: 0, completed: 0 });

  useEffect(() => {
    // Mock data for delivery person
    setAvailableMissions([
      { id: 'M-101', pickup: 'Kouassi Cacao, Cocody', dropoff: 'Plateau Dokui', distance: '5.2km', fee: 1200, time: '15 min' },
      { id: 'M-102', pickup: 'Maison du Pagne, Marcory', dropoff: 'Angré 7e Tranche', distance: '8.4km', fee: 2500, time: '25 min' },
    ]);
    setActiveMissions([]);
    setStats({ earnings: 45200, completed: 18 });
  }, []);

  const acceptMission = (id) => {
    const mission = availableMissions.find(m => m.id === id);
    setActiveMissions([...activeMissions, { ...mission, status: 'PICKING_UP' }]);
    setAvailableMissions(availableMissions.filter(m => m.id !== id));
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className="container">
          <header className={styles.header}>
            <div className={styles.profile}>
              <div className={styles.avatar}>MT</div>
              <div>
                <h1>Moussa Traoré</h1>
                <div className={styles.statusRow}>
                  <span className={`${styles.statusDot} ${status === 'ACTIF' ? styles.active : ''}`} />
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.statusSelect}>
                    <option value="ACTIF">En ligne (Prêt)</option>
                    <option value="INACTIF">Hors ligne</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.quickStats}>
              <div className={styles.quickStat}>
                <span>Gains Totaux</span>
                <strong>{stats.earnings.toLocaleString()} FCFA</strong>
              </div>
              <div className={styles.quickStat}>
                <span>Livraisons</span>
                <strong>{stats.completed}</strong>
              </div>
            </div>
          </header>

          <div className={styles.dashboardGrid}>
            {/* Active Missions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>🚀 Mission en cours</h2>
              {activeMissions.length === 0 ? (
                <div className={styles.emptyState}>
                  Aucune mission active. Acceptez une mission ci-dessous.
                </div>
              ) : (
                <div className={styles.activeCard}>
                  <div className={styles.missionHeader}>
                    <span className={styles.missionId}>#{activeMissions[0].id}</span>
                    <span className={styles.statusTag}>EN COURS</span>
                  </div>
                  <div className={styles.missionPoints}>
                    <div className={styles.point}>
                      <div className={styles.dotPickup} />
                      <div>
                        <small>Ramassage</small>
                        <p>{activeMissions[0].pickup}</p>
                      </div>
                    </div>
                    <div className={styles.line} />
                    <div className={styles.point}>
                      <div className={styles.dotDropoff} />
                      <div>
                        <small>Livraison</small>
                        <p>{activeMissions[0].dropoff}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.activeActions}>
                    <button className={styles.btnNav}>📍 Itinéraire</button>
                    <button className={styles.btnSuccess}>✅ Valider livraison</button>
                  </div>
                </div>
              )}
            </section>

            {/* Available Missions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📍 Missions disponibles</h2>
              <div className={styles.missionsList}>
                {availableMissions.map(m => (
                  <div key={m.id} className={styles.missionCard}>
                    <div className={styles.missionMain}>
                      <div className={styles.missionInfo}>
                        <h3>{m.dropoff}</h3>
                        <p>De: {m.pickup}</p>
                        <div className={styles.missionMeta}>
                          <span>📏 {m.distance}</span>
                          <span>⏱️ {m.time}</span>
                        </div>
                      </div>
                      <div className={styles.missionFee}>
                        <strong>{m.fee}</strong>
                        <small>FCFA</small>
                      </div>
                    </div>
                    <button className={styles.btnAccept} onClick={() => acceptMission(m.id)}>
                      Accepter la mission
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Model Note */}
          <div className={styles.commissionNote}>
            ℹ️ Tiéba prélève 2% de commission sur chaque frais de livraison. Vos gains affichés sont nets.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
