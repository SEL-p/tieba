'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './forgot.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real app, you would call an API like /api/auth/forgot-password
      // We'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.card}>
          <Link href="/connexion" className={styles.backLink}>
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>

          {!isSubmitted ? (
            <>
              <div className={styles.header}>
                <h1>Mot de passe oublié ?</h1>
                <p>Entrez votre email pour recevoir les instructions de réinitialisation.</p>
              </div>

              {error && (
                <div className={styles.errorBox}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Votre Email</label>
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

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                  {isLoading ? <Loader2 className={styles.spin} size={20} /> : 'Envoyer le lien'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle size={64} color="#16a34a" />
              </div>
              <h2>Vérifiez votre boîte mail</h2>
              <p>
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe sous quelques minutes.
              </p>
              <button 
                className={styles.submitBtn} 
                onClick={() => setIsSubmitted(false)}
              >
                Renvoyer le mail
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
