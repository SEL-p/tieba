import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Trust Badges */}
      <div className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: '🚚', title: 'Livraison Rapide', desc: 'Partout en Côte d\'Ivoire sous 48h' },
              { icon: '🔒', title: 'Paiement Sécurisé', desc: 'Mobile Money, Carte, Virement' },
              { icon: '✅', title: 'Vendeurs Vérifiés', desc: '100% fournisseurs certifiés' },
              { icon: '↩️', title: 'Retour Facile', desc: '14 jours pour changer d\'avis' },
              { icon: '🤝', title: 'Support 24/7', desc: 'Assistance en français et en dioula' },
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
                  { name: 'Facebook', icon: 'f', href: '#' },
                  { name: 'Instagram', icon: '📸', href: '#' },
                  { name: 'WhatsApp', icon: '💬', href: '#' },
                  { name: 'Twitter', icon: 'X', href: '#' },
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
