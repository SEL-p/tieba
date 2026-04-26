'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  Truck, 
  LogOut, 
  User, 
  MapPin
} from 'lucide-react';
import styles from './Header.module.css';
import NotificationCenter from './NotificationCenter'; // Reuse some styles but we'll keep it simple

export default function DeliveryHeader() {
  const { data: session } = useSession();

  return (
    <header style={{ 
      background: '#1e293b', 
      color: 'white', 
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo spécifique Livreur */}
        <Link href="/livreur/dashboard" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--orange)', padding: '8px', borderRadius: '8px' }}>
            <Truck size={24} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', lineHeight: 1 }}>Tiéba</div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Logistique</div>
          </div>
        </Link>

        {/* Actions Livreur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
            <MapPin size={16} color="var(--orange)" />
            Abidjan, CI
          </div>
          
          {session && <NotificationCenter userId={session.user.id} />}

          <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{session?.user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--orange)', fontWeight: 'bold' }}>LIVREUR VÉRIFIÉ</div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
