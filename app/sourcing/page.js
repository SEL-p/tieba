'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './sourcing.module.css';
import { ShieldCheck, Send, ClipboardList, Globe, Building2, Truck } from 'lucide-react';

export default function SourcingPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic to send to API would go here
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--green)', marginBottom: '24px' }}>
            <ShieldCheck size={80} style={{ margin: '0 auto' }} />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '36px', marginBottom: '16px' }}>Demande Envoyée !</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Votre demande de sourcing a été transmise à notre réseau de fournisseurs certifiés. 
            Vous recevrez les premiers devis sous 24 à 48 heures.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn btn-primary">Envoyer une autre demande</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <h1>Sourcing B2B sur Mesure</h1>
            <p>
              Vous ne trouvez pas ce que vous cherchez ? Décrivez votre besoin et laissez nos 
              fournisseurs ivoiriens qualifiés vous envoyer leurs meilleures offres.
            </p>

            <div className={styles.steps}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.stepTitle}>Décrivez le besoin</h3>
                <p className={styles.stepDesc}>Produits, quantités, spécifications techniques et délais souhaités.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.stepTitle}>Recevez des devis</h3>
                <p className={styles.stepDesc}>Nos fournisseurs vérifiés analysent votre demande et vous répondent.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.stepTitle}>Négociez & Signez</h3>
                <p className={styles.stepDesc}>Comparez les offres, discutez en direct et finalisez vos contrats.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <div className="container">
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nom du Produit / Service</label>
                <input type="text" placeholder="Ex: 50 tonnes de Noix de Cajou" className={styles.input} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Catégorie</label>
                <select className={styles.select}>
                  <option>Agricole</option>
                  <option>Textile & Pagnes</option>
                  <option>Alimentation</option>
                  <option>Artisanat</option>
                  <option>Bâtiment</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Quantité Estimée</label>
                <input type="text" placeholder="Ex: 500 unités / 10 tonnes" className={styles.input} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Budget Maximum (Optionnel)</label>
                <input type="number" placeholder="Budget en CFA" className={styles.input} />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Détails & Spécifications</label>
                <textarea 
                  placeholder="Décrivez précisément votre besoin : qualité, emballage, certifications requises, etc." 
                  className={styles.textarea}
                  required
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lieu de Livraison</label>
                <input type="text" placeholder="Ex: Port d'Abidjan / Entrepôt" className={styles.input} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Délai de livraison souhaité</label>
                <input type="date" className={styles.input} required />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <Send size={18} style={{ marginRight: '10px' }} />
              Publier l'Appel d'Offres
            </button>
          </form>

          {/* Trust Badges */}
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <ShieldCheck className={styles.trustIcon} />
              <span>Fournisseurs Vérifiés</span>
            </div>
            <div className={styles.trustBadge}>
              <Globe className={styles.trustIcon} />
              <span>Réseau International</span>
            </div>
            <div className={styles.trustBadge}>
              <Building2 className={styles.trustIcon} />
              <span>Accompagnement B2B</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
