'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Package, 
  Truck, 
  Wallet, 
  Settings, 
  LogOut, 
  Clock,
  Camera,
  AlertCircle,
  TrendingUp,
  Copy,
  Gift,
  Trophy,
  Zap
} from 'lucide-react';
import DeliveryHeader from '../../components/DeliveryHeader';
import DeliveryFooter from '../../components/DeliveryFooter';
import ChatWindow from '../../components/ChatWindow';
import styles from './livreur.module.css';

export default function DeliveryDashboard() {
  const { data: session } = useSession();
  const [activeMissions, setActiveMissions] = useState([]);
  const [availableMissions, setAvailableMissions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [activeTab, setActiveTab] = useState('missions');
  const [payouts, setPayouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [payoutForm, setPayoutForm] = useState({ amount: '', method: 'Orange Money', phone: '' });
  const [showOtpPrompt, setShowOtpPrompt] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
      startLocationTracking();
    }
  }, [session]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const zoneName = await reverseGeocode(latitude, longitude);
        
        // Update zone if changed
        if (zoneName && zoneName !== profile?.zone) {
          try {
            await fetch('/api/delivery/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ zone: zoneName, lat: latitude, lng: longitude })
            });
            setProfile(prev => prev ? { ...prev, zone: zoneName } : prev);
          } catch (err) {
            console.error('Zone update failed:', err);
          }
        }
      },
      (err) => {
        console.error('Geolocation error details:', { code: err.code, message: err.message });
        if (err.code === 1) {
          alert("Veuillez autoriser l'accès à votre position pour le suivi automatique de la zone.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  const reverseGeocode = async (lat, lng) => {
    // Dans un projet réel, on utiliserait Google Maps ou Nominatim
    // Ici on simule une détection par zones pour Abidjan
    try {
      // Simulation: si lat est proche de Cocody
      if (lat > 5.34 && lat < 5.40 && lng > -3.99 && lng < -3.90) return 'Cocody';
      if (lat > 5.28 && lat < 5.32 && lng > -4.00 && lng < -3.95) return 'Marcory';
      if (lat > 5.31 && lat < 5.35 && lng > -4.08 && lng < -4.00) return 'Yopougon';
      if (lat > 5.32 && lat < 5.36 && lng > -4.02 && lng < -3.98) return 'Adjamé';
      
      // Appel à un service gratuit (Nominatim) pour plus de réalisme
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
      const data = await res.json();
      return data.address?.suburb || data.address?.city || 'Abidjan';
    } catch (e) {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch profile
      const profRes = await fetch('/api/delivery/profile');
      if (profRes.ok) setProfile(await profRes.json());

      // Fetch available missions
      const availRes = await fetch('/api/delivery/missions?type=available');
      if (availRes.ok) {
        setAvailableMissions(await availRes.json());
        setVerificationError(null);
      } else if (availRes.status === 403) {
        const err = await availRes.json();
        if (err.isVerified === false) setVerificationError('UNVERIFIED');
      }

      // Fetch my missions
      const myRes = await fetch('/api/delivery/missions?type=mine');
      if (myRes.ok) {
        const myMissions = await myRes.json();
        setActiveMissions(myMissions.filter(m => m.status !== 'COMPLETED' && m.status !== 'CANCELLED'));
      }

      // Fetch payouts
      const payRes = await fetch('/api/delivery/payouts');
      if (payRes.ok) setPayouts(await payRes.json());

      // Fetch challenges
      const chalRes = await fetch('/api/delivery/challenges');
      if (chalRes.ok) setChallenges(await chalRes.json());
    } catch (err) {
      console.error('Error fetching delivery data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Document téléchargé avec succès !');
        fetchData();
      } else {
        alert('Erreur lors du téléchargement');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePayout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/delivery/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payoutForm.amount,
          method: payoutForm.method,
          phoneNumber: payoutForm.phone
        })
      });
      if (res.ok) {
        alert('Demande de retrait envoyée !');
        setPayoutForm({ amount: '', method: 'Orange Money', phone: '' });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      alert('Erreur lors du retrait');
    }
  };

  const handleAction = async (missionId, action) => {
    if (action === 'COMPLETE' && !showOtpPrompt) {
      setShowOtpPrompt(missionId);
      return;
    }

    try {
      const res = await fetch('/api/delivery/missions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, action, otp: otpValue })
      });
      if (res.ok) {
        setShowOtpPrompt(null);
        setOtpValue('');
        fetchData(); 
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      alert('Erreur lors de l\'action');
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch('/api/delivery/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProfile({ ...profile, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className={styles.loading}>Chargement de votre interface...</div>;

  return (
    <>
      <DeliveryHeader />
      <div className={styles.container}>
        <div className="container">
          <header className={styles.header}>
            <div className={styles.profile}>
              <div className={styles.avatar}>
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'L'}
              </div>
              <div>
                <h1>{session?.user?.name || 'Livreur'}</h1>
                <div className={styles.statusRow}>
                  <span className={`${styles.statusDot} ${profile?.status === 'ACTIF' ? styles.active : profile?.status === 'OCCUPÉ' ? styles.busy : ''}`} />
                  <span className={styles.statusText}>
                    {profile?.status === 'ACTIF' ? 'En ligne (Disponible)' : 
                     profile?.status === 'OCCUPÉ' ? 'En livraison (Occupé)' : 'Hors ligne'}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.verificationStatus}>
                {profile?.isVerified ? (
                  <span className={styles.verifiedBadge}><CheckCircle2 size={16} /> Compte Vérifié</span>
                ) : (
                  <span className={styles.unverifiedBadge}><AlertCircle size={16} /> En attente de vérification</span>
                )}
              </div>
              <div className={styles.quickStats}>
                <div className={styles.quickStat}>
                  <span>Solde</span>
                  <strong>{(profile?.balance || 0).toLocaleString()} FCFA</strong>
                </div>
                <div className={styles.quickStat}>
                  <span>Gains Totaux</span>
                  <strong>{(profile?.totalEarnings || 0).toLocaleString()} FCFA</strong>
                </div>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className={styles.btnLogout}
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          {!profile?.isVerified && (
            <div className={styles.verificationAlert}>
              <div className={styles.alertHeader}>
                <AlertCircle size={24} />
                <h2>Action Requise : Vérification de votre compte</h2>
              </div>
              <p>Pour commencer à recevoir des missions de livraison, vous devez soumettre vos documents pour validation par nos administrateurs.</p>
              
              <div className={styles.uploadGrid}>
                <div className={styles.uploadBox}>
                  <label>Pièce d'Identité (CNI / Passeport)</label>
                  {profile?.idCardUrl ? (
                    <div className={styles.docDone}>✅ Reçu</div>
                  ) : (
                    <input type="file" onChange={(e) => handleFileUpload(e, 'idCard')} disabled={isUploading} />
                  )}
                </div>
                <div className={styles.uploadBox}>
                  <label>Permis de conduire</label>
                  {profile?.licenseUrl ? (
                    <div className={styles.docDone}>✅ Reçu</div>
                  ) : (
                    <input type="file" onChange={(e) => handleFileUpload(e, 'license')} disabled={isUploading} />
                  )}
                </div>
                <div className={styles.uploadBox}>
                  <label>Documents du Véhicule</label>
                  {profile?.vehicleDocUrl ? (
                    <div className={styles.docDone}>✅ Reçu</div>
                  ) : (
                    <input type="file" onChange={(e) => handleFileUpload(e, 'vehicleDoc')} disabled={isUploading} />
                  )}
                </div>
              </div>
            </div>
          )}

          <nav className={styles.tabsNav}>
            <button className={`${styles.tabBtn} ${activeTab === 'missions' ? styles.tabActive : ''}`} onClick={() => setActiveTab('missions')}>📦 Mes Missions</button>
            <button className={`${styles.tabBtn} ${activeTab === 'wallet' ? styles.tabActive : ''}`} onClick={() => setActiveTab('wallet')}>💰 Mon Portefeuille</button>
            <button className={`${styles.tabBtn} ${activeTab === 'performance' ? styles.tabActive : ''}`} onClick={() => setActiveTab('performance')}>📊 Performance</button>
          </nav>

          {activeTab === 'missions' && (
            <div className={styles.dashboardGrid}>
            {/* Active Missions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>🚀 Mission en cours</h2>
              {activeMissions.length === 0 ? (
                <div className={styles.emptyState}>
                  <Truck size={48} className={styles.emptyIcon} />
                  <p>Aucune mission active. Acceptez une mission ci-contre.</p>
                </div>
              ) : (
                <div className={styles.activeMissionsList}>
                  {activeMissions.map(mission => (
                    <div key={mission.id} className={styles.activeCard}>
                      <div className={styles.missionHeader}>
                        <span className={styles.missionId}>#{mission.id.slice(-6)}</span>
                        <span className={styles.statusTag}>{mission.status}</span>
                      </div>
                      <div className={styles.missionPoints}>
                        <div className={styles.point}>
                          <div className={styles.dotPickup} />
                          <div>
                            <small>Enlèvement (Vendeur)</small>
                            <p>{mission.pickupAddress || 'Adresse du vendeur'}</p>
                          </div>
                        </div>
                        <div className={styles.line} />
                        <div className={styles.point}>
                          <div className={styles.dotDropoff} />
                          <div>
                            <small>Destination (Client)</small>
                            <p>{mission.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.activeActions}>
                        <button 
                          className={styles.btnNav}
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mission.deliveryAddress)}`, '_blank')}
                        >
                          <Navigation size={16} /> Itinéraire
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                          <button 
                            className={styles.btnChat}
                            onClick={() => setActiveChat({ id: mission.order.id, name: mission.order.user.name })}
                          >
                            <MessageSquare size={14} /> Client
                          </button>
                          <button 
                            className={styles.btnChat}
                            style={{ background: '#334155' }}
                            onClick={() => setActiveChat({ id: mission.order.id, name: "La Boutique" })}
                          >
                            <MessageSquare size={14} /> Boutique
                          </button>
                        </div>
                        {mission.status === 'ACCEPTED' && (
                          <button 
                            className={styles.btnPickup}
                            onClick={() => handleAction(mission.id, 'PICKUP')}
                          >
                            📦 Colis ramassé
                          </button>
                        )}
                        {mission.status === 'DELIVERING' && (
                          <button 
                            className={styles.btnSuccess}
                            onClick={() => handleAction(mission.id, 'COMPLETE')}
                          >
                            ✅ Livré
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Available Missions */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📍 Missions à proximité</h2>
              <div className={styles.missionsList}>
                {availableMissions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Clock size={48} className={styles.emptyIcon} />
                    <p>En attente de nouvelles missions...</p>
                  </div>
                ) : (
                  availableMissions.map(m => (
                    <div key={m.id} className={styles.missionCard}>
                      <div className={styles.missionMain}>
                        <div className={styles.missionInfo}>
                          <h3>{m.deliveryAddress}</h3>
                          <p>De: {m.order?.items?.[0]?.product?.seller?.businessName || m.pickupAddress || 'Boutique Partenaire'}</p>
                          <div className={styles.missionMeta}>
                            <span>📏 {m.distanceKm || '?'} km</span>
                            <span>⏱️ {m.estimatedTime || '?'} min</span>
                          </div>
                        </div>
                        <div className={styles.missionFee}>
                          <strong>{(m.order?.deliveryFee || 0).toLocaleString()}</strong>
                          <small>FCFA</small>
                        </div>
                      </div>
                      <button 
                        className={styles.btnAccept} 
                        onClick={() => handleAction(m.id, 'ACCEPT')}
                      >
                        Accepter la livraison
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
          )}

          {activeTab === 'wallet' && (
            <div className={styles.walletView}>
              <div className={styles.walletHeader}>
                <div className={styles.balanceMain}>
                  <Wallet size={32} />
                  <div>
                    <span>Solde actuel</span>
                    <h2>{(profile?.balance || 0).toLocaleString()} FCFA</h2>
                  </div>
                </div>
                <div className={styles.payoutFormCard}>
                  <h3>Demande de retrait</h3>
                  <form onSubmit={handlePayout} className={styles.payoutForm}>
                    <input 
                      type="number" 
                      placeholder="Montant (min 1000)" 
                      value={payoutForm.amount}
                      onChange={e => setPayoutForm({...payoutForm, amount: e.target.value})}
                      required 
                    />
                    <select 
                      value={payoutForm.method}
                      onChange={e => setPayoutForm({...payoutForm, method: e.target.value})}
                    >
                      <option>Orange Money</option>
                      <option>Wave</option>
                      <option>MTN MoMo</option>
                    </select>
                    <input 
                      type="tel" 
                      placeholder="N° de téléphone" 
                      value={payoutForm.phone}
                      onChange={e => setPayoutForm({...payoutForm, phone: e.target.value})}
                      required 
                    />
                    <button type="submit" className={styles.btnAction}>Retirer fonds</button>
                  </form>
                </div>
              </div>

              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Historique des retraits</h3>
                <div className={styles.payoutsList}>
                  {payouts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Clock size={40} color="#cbd5e1" />
                      <p>Aucun retrait effectué pour le moment.</p>
                    </div>
                  ) : payouts.map(p => (
                    <div key={p.id} className={styles.payoutItem}>
                      <div className={styles.payoutMain}>
                        <h4>{p.amount.toLocaleString()} FCFA</h4>
                        <p>{p.method} • {p.phoneNumber}</p>
                      </div>
                      <span className={`${styles.payoutStatus} ${styles[p.status.toLowerCase()]}`}>
                        {p.status === 'PENDING' ? 'En attente' : p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className={styles.performanceView}>
              {/* Referral Section Premium */}
              <div className={styles.referralCard}>
                <div className={styles.referralInfo}>
                  <h3>🤝 Programme de Parrainage</h3>
                  <p>Faites grandir la communauté et gagnez <strong>500 FCFA</strong> pour chaque nouveau livreur actif parrainé !</p>
                </div>
                <div className={styles.codeBox}>
                  <code>{profile?.referralCode || '---'}</code>
                  <button 
                    className={styles.copyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(profile?.referralCode);
                      alert('Code copié !');
                    }}
                  >
                    <Copy size={16} /> Copier
                  </button>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                    <Package size={28} />
                  </div>
                  <div>
                    <h4>{profile?.missions?.length || 0}</h4>
                    <p>Livraisons totales</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                    <Navigation size={28} />
                  </div>
                  <div>
                    <h4>{(profile?.missions?.length || 0) * 4} km</h4>
                    <p>Distance parcourue</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                    <Trophy size={28} />
                  </div>
                  <div>
                    <h4>Top 10%</h4>
                    <p>Rang actuel</p>
                  </div>
                </div>
              </div>

              {/* Challenges Section Premium */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={24} color="var(--orange)" /> Défis et Bonus
                </h3>
                <div className={styles.challengesGrid}>
                  {challenges.map(c => (
                    <div key={c.id} className={`${styles.challengeCard} ${c.isCompleted ? styles.challengeDone : ''}`}>
                      <span className={styles.rewardBadge}>+{c.rewardAmount} FCFA</span>
                      <h4>{c.title}</h4>
                      <p>{c.description}</p>
                      
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${Math.min(100, (c.currentCount / c.targetCount) * 100)}%` }} 
                        />
                      </div>
                      <div className={styles.progressLabel}>
                        <span>Progression</span>
                        <span>{c.currentCount} / {c.targetCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chartPlaceholder}>
                <p style={{ fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
                  <TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> 
                  Activité des 7 derniers jours
                </p>
                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        flex: 1, 
                        background: 'linear-gradient(to top, #6366f1, #a855f7)', 
                        height: `${h}%`, 
                        borderRadius: '8px 8px 0 0', 
                        opacity: 0.8,
                        transition: 'height 0.5s ease-out'
                      }} 
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                  <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                </div>
              </div>
            </div>
          )}

          {/* OTP PROMPT MODAL */}
          {showOtpPrompt && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Confirmer la livraison</h3>
                <p>Veuillez demander le code de sécurité à 4 chiffres au client.</p>
                <input 
                  type="text" 
                  maxLength="4" 
                  placeholder="CODE OTP" 
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value)}
                  className={styles.otpInput}
                />
                <div className={styles.modalActions}>
                  <button onClick={() => setShowOtpPrompt(null)} className={styles.btnCancel}>Annuler</button>
                  <button onClick={() => handleAction(showOtpPrompt, 'COMPLETE')} className={styles.btnConfirm}>Valider Livraison</button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3><Truck size={24} color="#6366f1" /> Votre Véhicule</h3>
              <div className={styles.vehicleDetails}>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}><Truck size={20} /></div>
                  <div className={styles.detailText}>
                    <small>Type de véhicule</small>
                    <p>{profile?.vehicleType || 'MOTO'}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}><AlertCircle size={20} /></div>
                  <div className={styles.detailText}>
                    <small>Plaque d'immatriculation</small>
                    <p>{profile?.vehiclePlate || 'CI-1234-AB'}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}><MapPin size={20} /></div>
                  <div className={styles.detailText}>
                    <small>Zone d'activité actuelle</small>
                    <p>{profile?.zone || 'Yopougon'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoCard} style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className={styles.commissionNote} style={{ marginTop: 0 }}>
                <AlertCircle size={24} color="var(--orange)" />
                <h3 style={{ margin: '16px 0 8px 0' }}>Frais de service</h3>
                <p>Tiéba prélève une commission de 2% sur chaque mission pour assurer la maintenance de la plateforme et votre assurance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeChat && (
        <ChatWindow 
          orderId={activeChat.id} 
          recipientName={activeChat.name} 
          onClose={() => setActiveChat(null)} 
        />
      )}
      <DeliveryFooter />
    </>
  );
}
