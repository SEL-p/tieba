'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './connexion.module.css';

export default function ConnexionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        const session = await getSession();
        const role = session?.user?.role;
        
        if (role === 'ADMIN') router.push('/admin/dashboard');
        else if (role === 'VENDEUR') router.push('/vendeur/dashboard');
        else if (role === 'LIVREUR') router.push('/livreur/dashboard');
        else router.push('/dashboard');
        
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1>Bon retour !</h1>
            <p>Connectez-vous pour accéder à votre espace Tieba</p>
          </div>

          {isRegistered && (
            <div className={styles.successBox}>
              <CheckCircle2 size={20} />
              <span>Votre compte a été créé avec succès ! Connectez-vous maintenant.</span>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Mot de passe</label>
                <Link href="/mot-de-passe-oublie" className={styles.forgotLink}>Oublié ?</Link>
              </div>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? <Loader2 className={styles.spin} size={20} /> : 'Se connecter'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <div className={styles.socialLogins}>
            <button className={styles.socialBtn}>
              <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
              Continuer avec Google
            </button>
          </div>

          <div className={styles.footer}>
            Nouveau sur Tiéba Market ? <Link href="/inscription">Créer un compte</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
