'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './MobileNav.module.css';

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { href: '/', icon: <Home size={22} />, label: 'Accueil' },
    { href: '/recherche', icon: <Search size={22} />, label: 'Explorer' },
    { href: '/panier', icon: <ShoppingBag size={22} />, label: 'Panier', count: cartCount },
    { href: '/favoris', icon: <Heart size={22} />, label: 'Favoris' },
    { href: '/dashboard', icon: <User size={22} />, label: 'Compte' },
  ];

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <div className={styles.iconWrapper}>
              {item.icon}
              {item.count > 0 && <span className={styles.badge}>{item.count}</span>}
            </div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
