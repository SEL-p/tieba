import Link from 'next/link';

export const metadata = {
  title: '404 – Page introuvable | Tieba Market',
};

export default function NotFound() {
  return (
    <html lang="fr">
      <body style={{
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(135deg, #0A0F1A 0%, #1A0A3C 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
      }}>
        <div>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🇨🇮</div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '80px',
            fontWeight: 900,
            color: '#F97316',
            lineHeight: 1,
            marginBottom: '16px',
          }}>404</h1>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
            Page introuvable
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', maxWidth: '400px' }}>
            Cette page n'existe pas ou a été déplacée. Retournez à l'accueil pour découvrir nos produits ivoiriens.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: '#F97316',
              color: 'white',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
            }}
          >
            🏠 Retourner à l'accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
