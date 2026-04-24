'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid, ChevronRight, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className="container">
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <LayoutGrid className={styles.titleIcon} size={32} />
              <h1>Toutes les Catégories</h1>
            </div>
            <p>Explorez la richesse des produits ivoiriens par thématique</p>
          </header>

          {loading ? (
            <div className={styles.loading}>Chargement des catégories...</div>
          ) : (
            <div className={styles.grid}>
              {categories.map(cat => (
                <Link key={cat.id} href={`/categories/${cat.id}`} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={cat.image || '/category_placeholder.png'} 
                      alt={cat.name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                    <div className={styles.overlay} />
                  </div>
                  <div className={styles.content}>
                    <h3>{cat.name}</h3>
                    <ChevronRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
