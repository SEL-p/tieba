'use client';
import Link from 'next/link';

export default function DeliveryFooter() {
  return (
    <footer style={{ 
      background: '#f8fafc', 
      padding: '30px 0', 
      borderTop: '1px solid #e2e8f0',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7, fontSize: '0.9rem' }}>
          <div>
            © 2026 <strong>Tiéba Logistique</strong>. Tous droits réservés.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/aide/livreurs" style={{ color: 'inherit', textDecoration: 'none' }}>Assistance</Link>
            <Link href="/conditions/livreurs" style={{ color: 'inherit', textDecoration: 'none' }}>Charte de livraison</Link>
            <Link href="/securite" style={{ color: 'inherit', textDecoration: 'none' }}>Sécurité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
