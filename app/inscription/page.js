'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Loader2, AlertCircle, ShoppingBag, Store, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './inscription.module.css';

export default function InscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ACHETEUR'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue");
      } else {
        router.push('/connexion?registered=true');
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <h1>Rejoignez l'aventure</h1>
            <p>Choisissez votre profil et commencez sur Tiéba Market</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className={styles.roleGrid}>
              {[
                { id: 'ACHETEUR', label: 'Acheteur', icon: <ShoppingBag size={24} />, desc: 'Pour acheter' },
                { id: 'VENDEUR', label: 'Vendeur', icon: <Store size={24} />, desc: 'Pour vendre' },
                { id: 'LIVREUR', label: 'Livreur', icon: <Truck size={24} />, desc: 'Pour livrer' },
              ].map((r) => (
                <div
                  key={r.id}
                  className={`${styles.roleCard} ${formData.role === r.id ? styles.roleActive : ''}`}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                >
                  <div className={styles.roleIcon}>{r.icon}</div>
                  <div className={styles.roleLabel}>{r.label}</div>
                  <div className={styles.roleDesc}>{r.desc}</div>
                  {formData.role === r.id && <div className={styles.check}>✓</div>}
                </div>
              ))}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="name">Nom complet</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={20} />
                <input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email professionnel ou personnel</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mot de passe</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <Loader2 className={styles.spin} size={20} /> : 'Créer mon compte'}
            </button>
          </form>

          <div className={styles.terms}>
            En créant un compte, vous acceptez nos <Link href="/conditions">Conditions d'Utilisation</Link> et notre <Link href="/vie-privee">Politique de Confidentialité</Link>.
          </div>

          <div className={styles.footer}>
            Déjà inscrit ? <Link href="/connexion">Se connecter</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
