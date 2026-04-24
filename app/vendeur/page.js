'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './vendeur.module.css';

const steps = [
  { num: '01', title: 'Créez votre compte', desc: 'Inscription gratuite en 2 minutes avec votre email ou numéro de téléphone.', icon: '👤' },
  { num: '02', title: 'Ajoutez vos produits', desc: 'Publiez vos produits avec photos, descriptions et prix en toute simplicité.', icon: '📦' },
  { num: '03', title: 'Recevez des commandes', desc: 'Vos produits sont visibles par des milliers d\'acheteurs en Côte d\'Ivoire.', icon: '🛒' },
  { num: '04', title: 'Encaissez vos paiements', desc: 'Paiements sécurisés via Mobile Money ou virement bancaire.', icon: '💰' },
];

const plans = [
  {
    name: 'Starter',
    price: 'Gratuit',
    priceNote: 'pour toujours',
    commission: '8%',
    features: ['10 produits max', 'Support email', 'Dashboard basique', 'Paiement Mobile Money'],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '9 900 FCFA',
    priceNote: 'par mois',
    commission: '5%',
    features: ['Produits illimités', 'Support prioritaire 24/7', 'Analytics avancés', 'Boutique personnalisée', 'Badge "Vendeur Pro"', 'Export de données'],
    cta: 'Essai 30 jours gratuit',
    highlight: true,
    badge: '⭐ Populaire',
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    priceNote: '',
    commission: '3%',
    features: ['Tout Pro inclus', 'Manager dédié', 'API & intégrations', 'Contrats B2B', 'Formation équipe', 'SLA garanti'],
    cta: 'Nous contacter',
    highlight: false,
  },
];

export default function VendeurPage() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', business: '', category: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      <Header />
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <span className={styles.heroBadge}>🇨🇮 Plateforme ivoirienne</span>
                <h1 className={styles.heroTitle}>
                  Vendez vos produits à<br />
                  <span className={styles.heroAccent}>des milliers d'acheteurs</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Rejoignez 3 200+ vendeurs qui développent leur business sur Tieba Market.
                  Inscription gratuite. Commissions transparentes. Support en français.
                </p>
                <div className={styles.heroStats}>
                  {[
                    { val: '3 200+', lbl: 'Vendeurs actifs' },
                    { val: '120 000+', lbl: 'Acheteurs' },
                    { val: '50 000+', lbl: 'Produits listés' },
                    { val: '98%', lbl: 'Satisfaction' },
                  ].map(s => (
                    <div key={s.lbl} className={styles.stat}>
                      <span className={styles.statVal}>{s.val}</span>
                      <span className={styles.statLbl}>{s.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign up form */}
              <div className={styles.signupCard}>
                <div className={styles.signupHeader}>
                  <h2>Créer mon compte vendeur</h2>
                  <p>Étape {formStep}/2 · Gratuit</p>
                </div>

                {formStep === 1 ? (
                  <div className={styles.formFields}>
                    <div className={styles.formGroup}>
                      <label>Nom complet *</label>
                      <input type="text" name="name" className="input" placeholder="Kouamé Assi" value={formData.name} onChange={handleChange} id="vendeur-name" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email *</label>
                      <input type="email" name="email" className="input" placeholder="email@exemple.com" value={formData.email} onChange={handleChange} id="vendeur-email" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Téléphone (WhatsApp) *</label>
                      <input type="tel" name="phone" className="input" placeholder="+225 07 00 00 00" value={formData.phone} onChange={handleChange} id="vendeur-phone" />
                    </div>
                    <button className={styles.nextBtn} onClick={() => setFormStep(2)} id="form-next-btn">
                      Continuer →
                    </button>
                  </div>
                ) : (
                  <div className={styles.formFields}>
                    <div className={styles.formGroup}>
                      <label>Nom de votre boutique *</label>
                      <input type="text" name="business" className="input" placeholder="Ma Boutique CI" value={formData.business} onChange={handleChange} id="vendeur-business" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Catégorie principale *</label>
                      <select name="category" className="input" value={formData.category} onChange={handleChange} id="vendeur-category">
                        <option value="">Choisir une catégorie</option>
                        <option>Agricole & Cacao</option>
                        <option>Textile & Pagnes</option>
                        <option>Alimentation</option>
                        <option>Artisanat & Art</option>
                        <option>Bijoux & Accessoires</option>
                        <option>Beauté & Santé</option>
                        <option>Électronique</option>
                        <option>Bâtiment & BTP</option>
                      </select>
                    </div>
                    <div className={styles.formActions}>
                      <button className={styles.backBtn} onClick={() => setFormStep(1)}>← Retour</button>
                      <button className={styles.nextBtn} style={{ flex: 1 }} id="form-submit-btn">
                        🚀 Créer mon compte
                      </button>
                    </div>
                  </div>
                )}

                <p className={styles.formNote}>
                  En vous inscrivant, vous acceptez nos <Link href="/cgv">CGV</Link> et notre <Link href="/confidentialite">politique de confidentialité</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.howSection}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className={styles.eyebrow}>Simple & rapide</p>
              <h2 className="section-title">Comment ça marche ?</h2>
              <div className="divider" style={{ margin: '8px auto 0' }}></div>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map((step, i) => (
                <div key={step.num} className={styles.stepCard}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  {i < steps.length - 1 && <div className={styles.stepArrow}>→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.pricingSection}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className={styles.eyebrow}>Transparent & flexible</p>
              <h2 className="section-title" style={{ color: 'white' }}>Nos Tarifs</h2>
              <div className="divider" style={{ margin: '8px auto 0' }}></div>
            </div>
            <div className={styles.plansGrid}>
              {plans.map(plan => (
                <div key={plan.name} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
                  {plan.badge && <div className={styles.planBadge}>{plan.badge}</div>}
                  <div className={styles.planName}>{plan.name}</div>
                  <div className={styles.planPrice}>
                    {plan.price}
                    {plan.priceNote && <span className={styles.planNote}>/{plan.priceNote}</span>}
                  </div>
                  <div className={styles.planCommission}>
                    Commission : <strong>{plan.commission}</strong> par vente
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map(f => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                  <button className={`${styles.planBtn} ${plan.highlight ? styles.planBtnHighlight : ''}`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialsSection}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p className={styles.eyebrow}>Ils nous font confiance</p>
              <h2 className="section-title">Nos Vendeurs Témoignent</h2>
              <div className="divider" style={{ margin: '8px auto 0' }}></div>
            </div>
            <div className={styles.testimonialsGrid}>
              {[
                {
                  name: 'Aya Koffi',
                  business: 'Boutique de pagnes – Abidjan',
                  text: '"Depuis que j\'ai rejoint Tieba Market, mes ventes ont triplé en 6 mois ! La plateforme est simple et mes clientes viennent de partout en Côte d\'Ivoire."',
                  rating: 5,
                  revenue: '+312% de chiffre d\'affaires',
                },
                {
                  name: 'Konan Bertin',
                  business: 'Coopérative cacao – Yamoussoukro',
                  text: '"J\'exporte maintenant mon cacao directement depuis Tieba Market vers des acheteurs au Ghana et au Sénégal. Incroyable !"',
                  rating: 5,
                  revenue: '15 pays clients',
                },
                {
                  name: 'Mariam Coulibaly',
                  business: 'Artisanat & bijoux – Bouaké',
                  text: '"Le support est excellent. À chaque problème, l\'équipe répond rapidement en français. Je me sens vraiment accompagnée."',
                  rating: 5,
                  revenue: '840 commandes/mois',
                },
              ].map((t, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars}>
                    {'★'.repeat(t.rating)}
                  </div>
                  <p className={styles.testimonialText}>{t.text}</p>
                  <div className={styles.testimonialFooter}>
                    <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                    <div>
                      <div className={styles.testimonialName}>{t.name}</div>
                      <div className={styles.testimonialBusiness}>{t.business}</div>
                    </div>
                    <div className={styles.testimonialRevenue}>{t.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
