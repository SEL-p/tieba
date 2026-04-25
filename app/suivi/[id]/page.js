'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone,
  ArrowLeft,
  Store,
  Navigation,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatWindow from '../../components/ChatWindow';
import styles from './tracking.module.css';

export default function TrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
      // Polling every 30 seconds for real-time tracking
      const interval = setInterval(fetchOrder, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) setOrder(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Localisation de votre colis...</div>;
  if (!order) return <div className={styles.error}>Commande introuvable</div>;

  const steps = [
    { 
      id: 'PENDING', 
      label: 'Commande passée', 
      icon: <Clock size={20} />, 
      completed: true, 
      date: order.createdAt 
    },
    { 
      id: 'PREPARING', 
      label: 'En préparation à la boutique', 
      icon: <Store size={20} />, 
      completed: ['PREPARING', 'IN_TRANSIT', 'DELIVERED'].includes(order.status),
      current: order.status === 'PREPARING'
    },
    { 
      id: 'IN_TRANSIT', 
      label: 'Récupéré par le livreur', 
      icon: <Truck size={20} />, 
      completed: ['IN_TRANSIT', 'DELIVERED'].includes(order.status),
      current: order.status === 'IN_TRANSIT'
    },
    { 
      id: 'DELIVERED', 
      label: 'Colis livré', 
      icon: <CheckCircle2 size={20} />, 
      completed: order.status === 'DELIVERED',
      current: order.status === 'DELIVERED'
    },
  ];

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className="container">
          <Link href="/dashboard" className={styles.backLink}>
            <ArrowLeft size={18} /> Retour à mes commandes
          </Link>

          <div className={styles.trackingGrid}>
            <div className={styles.mainContent}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h1>Suivi de Commande</h1>
                    <p>Référence: <strong>#{order.id.slice(-8).toUpperCase()}</strong></p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </div>

                {/* OTP Code for delivery */}
                {order.status === 'IN_TRANSIT' && order.mission?.otpCode && (
                  <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', border: '2px dashed #d97706', marginBottom: '24px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: '700', color: '#92400e' }}>Code de validation à donner au livreur :</p>
                    <h2 style={{ fontSize: '2.5rem', margin: '8px 0', letterSpacing: '4px', color: '#b45309' }}>{order.mission.otpCode}</h2>
                  </div>
                )}

                {/* Timeline */}
                <div className={styles.timeline}>
                  {steps.map((step, index) => (
                    <div key={step.id} className={`${styles.step} ${step.completed ? styles.completed : ''} ${step.current ? styles.active : ''}`}>
                      <div className={styles.stepIcon}>{step.icon}</div>
                      <div className={styles.stepContent}>
                        <h3>{step.label}</h3>
                        {step.date && <p>{new Date(step.date).toLocaleString('fr-FR')}</p>}
                        {step.current && <p className={styles.currentStatus}>Action en cours...</p>}
                      </div>
                      {index < steps.length - 1 && <div className={styles.line} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className={styles.detailsGrid}>
                <div className={styles.card}>
                  <h3><MapPin size={18} /> Adresse de livraison</h3>
                  <p>{order.mission?.deliveryAddress || "Adresse non définie"}</p>
                </div>
                <div className={styles.card}>
                  <h3><Package size={18} /> Contenu</h3>
                  <div className={styles.itemsList}>
                    {order.items.map(item => (
                      <div key={item.id} className={styles.item}>
                        <span>{item.quantity}x {item.product.name}</span>
                        <strong>{(item.price * item.quantity).toLocaleString()} CFA</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className={styles.sidebar}>
              {/* Livreur Card */}
              {order.mission?.livreur ? (
                <div className={styles.livreurCard}>
                  <div className={styles.livreurHeader}>
                    <div className={styles.avatar}>
                      {order.mission.livreur.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4>{order.mission.livreur.user.name}</h4>
                      <p>Votre livreur Tiéba</p>
                    </div>
                  </div>
                  <div className={styles.livreurInfo}>
                    <div className={styles.infoRow}>
                      <span>Véhicule:</span>
                      <strong>{order.mission.livreur.vehicleType} ({order.mission.livreur.vehiclePlate})</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Note:</span>
                      <strong>⭐ {order.mission.livreur.rating} / 5</strong>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <a href={`tel:${order.mission.livreur.user.phone}`} className={styles.callBtn}>
                      <Phone size={18} /> Appeler
                    </a>
                    <button onClick={() => setShowChat(true)} className={styles.chatBtn}>
                      <MessageSquare size={18} /> Chat
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.waitingCard}>
                  <Clock size={32} />
                  <h4>Recherche d'un livreur</h4>
                  <p>Nous assignons le meilleur livreur disponible à votre commande.</p>
                </div>
              )}

              {/* Help Card */}
              <div className={styles.helpCard}>
                <h4>Besoin d'aide ?</h4>
                <p>Un problème avec votre livraison ?</p>
                <Link href="/aide" className={styles.helpBtn}>Contacter le support</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      {showChat && (
        <ChatWindow 
          orderId={order.id} 
          recipientName={order.mission.livreur.user.name} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </>
  );
}
