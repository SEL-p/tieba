'use client';
import Link from 'next/link';
import { Construction, ArrowLeft, Home } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

export default function ComingSoon({ title = "Cette page arrive bientôt" }) {
  return (
    <>
      <Header />
      <main style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        padding: '40px 20px'
      }}>
        <div style={{ 
          maxWidth: '500px', 
          textAlign: 'center',
          background: 'white',
          padding: '48px',
          borderRadius: '24px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            background: '#fff7ed', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#f97316'
          }}>
            <Construction size={40} />
          </div>
          
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>
            {title}
          </h1>
          
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
            Nos équipes travaillent d'arrache-pied pour vous offrir la meilleure expérience sur cette section de Tiéba Market. Revenez très bientôt !
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={18} /> Accueil
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={18} /> Retour
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
