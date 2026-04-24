import Link from 'next/link';
import { 
  Truck, Lock, BadgeCheck, RotateCcw, Headset
} from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Trust Badges */}
      <div className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: <Truck size={32} />, title: 'Livraison Rapide', desc: 'Partout en Côte d\'Ivoire sous 48h' },
              { icon: <Lock size={32} />, title: 'Paiement Sécurisé', desc: 'Mobile Money, Carte, Virement' },
              { icon: <BadgeCheck size={32} />, title: 'Vendeurs Vérifiés', desc: '100% fournisseurs certifiés' },
              { icon: <RotateCcw size={32} />, title: 'Retour Facile', desc: '14 jours pour changer d\'avis' },
              { icon: <Headset size={32} />, title: 'Support 24/7', desc: 'Assistance en français et en dioula' },
            ].map(item => (
              <div key={item.title} className={styles.trustItem}>
                <span className={styles.trustIcon}>{item.icon}</span>
                <div>
                  <div className={styles.trustTitle}>{item.title}</div>
                  <div className={styles.trustDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand */}
            <div className={styles.brandCol}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>T</div>
                <div>
                  <div className={styles.footerLogoMain}>Tieba Market</div>
                  <div className={styles.footerLogoSub}>La Marketplace Ivoirienne N°1</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                Tieba Market connecte les acheteurs et vendeurs ivoiriens à travers une plateforme digitale moderne, sécurisée et accessible à tous.
              </p>
              <div className={styles.socialLinks}>
                {[
                  { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, href: '#' },
                  { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, href: '#' },
                  { name: 'WhatsApp', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>, href: '#' },
                  { name: 'Twitter', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>, href: '#' },
                ].map(s => (
                  <a key={s.name} href={s.href} className={styles.socialLink} aria-label={s.name}>
                    {s.icon}
                  </a>
                ))}
              </div>
              {/* Payment methods */}
              <div className={styles.paymentMethods}>
                <span className={styles.payMethod}>Orange Money</span>
                <span className={styles.payMethod}>MTN MoMo</span>
                <span className={styles.payMethod}>Visa</span>
                <span className={styles.payMethod}>Wave</span>
              </div>
            </div>

            {/* Links columns */}
            {[
              {
                title: 'Marketplace',
                links: [
                  ['Toutes les catégories', '/categories'],
                  ['Produits populaires', '/populaires'],
                  ['Nouveautés', '/nouveautes'],
                  ['Promotions', '/promotions'],
                  ['Fournisseurs certifiés', '/fournisseurs'],
                  ['Sourcing B2B', '/sourcing'],
                ]
              },
              {
                title: 'Vendeurs',
                links: [
                  ['Devenir vendeur', '/vendeur'],
                  ['Espace vendeur', '/vendeur/dashboard'],
                  ['Tarifs & commissions', '/vendeur/tarifs'],
                  ['Formation vendeurs', '/vendeur/formation'],
                  ['Succès vendeurs', '/vendeur/success'],
                ]
              },
              {
                title: 'Support',
                links: [
                  ['Centre d\'aide', '/aide'],
                  ['Suivi de commande', '/suivi'],
                  ['Politique de retour', '/retours'],
                  ['Sécurité des paiements', '/paiements'],
                  ['Signaler un problème', '/signaler'],
                  ['Contactez-nous', '/contact'],
                ]
              },
            ].map(col => (
              <div key={col.title} className={styles.linkCol}>
                <h3 className={styles.colTitle}>{col.title}</h3>
                <ul className={styles.linkList}>
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className={styles.footerLink}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div className={styles.newsletterCol}>
              <h3 className={styles.colTitle}>Newsletter</h3>
              <p className={styles.newsletterDesc}>
                Recevez les meilleures offres et nouveautés directement dans votre boîte mail.
              </p>
              <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className={styles.newsletterInput}
                  id="newsletter-email"
                />
                <button type="submit" className={styles.newsletterBtn}>
                  S'abonner
                </button>
              </form>
              <p className={styles.newsletterNote}>
                🇨🇮 Fait avec fierté en Côte d'Ivoire
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>© 2026 Tieba Market. Tous droits réservés. Abidjan, Côte d'Ivoire.</p>
            <div className={styles.bottomLinks}>
              <Link href="/confidentialite">Confidentialité</Link>
              <Link href="/cgv">CGV</Link>
              <Link href="/mentions-legales">Mentions légales</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
