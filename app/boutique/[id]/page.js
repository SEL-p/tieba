import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, ShieldCheck, Mail, Phone, Clock, Package, Plus } from 'lucide-react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { PrismaClient } from '@prisma/client';
import styles from './boutique.module.css';

const prisma = new PrismaClient();

export default async function BoutiquePage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Fetch the seller and their products
  let seller = await prisma.seller.findUnique({
    where: { id: id },
    include: {
      user: {
        select: { name: true, email: true, phone: true }
      },
      products: {
        where: { inStock: true },
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!seller) {
    seller = await prisma.seller.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        products: {
          where: { inStock: true },
          include: {
            category: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  if (!seller) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === seller.userId;

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Banner Shop */}
        <div className={styles.shopBanner}>
          <div className="container">
            <div className={styles.shopHeader}>
              <div className={styles.shopAvatar}>
                {seller.businessName.charAt(0).toUpperCase()}
              </div>
              <div className={styles.shopInfo}>
                <div className={styles.shopTitleRow}>
                  <h1 className={styles.shopName}>{seller.businessName}</h1>
                  {seller.verified && (
                    <span className={styles.verifiedBadge}>
                      <ShieldCheck size={16} /> Vendeur Vérifié
                    </span>
                  )}
                </div>
                <p className={styles.shopDesc}>
                  {seller.description || "Aucune description fournie par ce vendeur."}
                </p>
                <div className={styles.shopMeta}>
                  {seller.location && (
                    <div className={styles.metaItem}>
                      <MapPin size={16} /> {seller.location}
                    </div>
                  )}
                  <div className={styles.metaItem}>
                    <Star size={16} className={styles.starIcon} /> {seller.rating} / 5
                  </div>
                  <div className={styles.metaItem}>
                    <Package size={16} /> {seller.products.length} produits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.shopContent}>
            {/* Products Grid */}
            <section className={styles.productsSection}>
              <div className={styles.sectionHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <h2>Catalogue de produits</h2>
                  {isOwner && (
                    <Link href="/vendeur/produits/nouveau" className={styles.addProductBtn}>
                      <Plus size={16} /> Ajouter un produit
                    </Link>
                  )}
                </div>
                <div className={styles.filterBar}>
                  <select className={styles.sortSelect}>
                    <option>Les plus récents</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                  </select>
                </div>
              </div>

              {seller.products.length > 0 ? (
                <div className={styles.productsGrid}>
                  {seller.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Package size={48} className={styles.emptyIcon} />
                  <h3>Aucun produit disponible</h3>
                  <p>Ce vendeur n'a pas encore ajouté de produits ou ils sont en rupture de stock.</p>
                </div>
              )}
            </section>

            {/* Sidebar info */}
            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3>À propos du vendeur</h3>
                
                <div className={styles.infoList}>
                  {seller.user?.name && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Propriétaire:</span>
                      <span className={styles.infoValue}>{seller.user.name}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Membre depuis:</span>
                    <span className={styles.infoValue}>{new Date(seller.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</span>
                  </div>
                  {seller.registrationNumber && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>N° Registre:</span>
                      <span className={styles.infoValue}>{seller.registrationNumber}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Type de livraison:</span>
                    <span className={styles.infoValue}>{seller.deliveryType}</span>
                  </div>
                </div>

                <div className={styles.contactActions}>
                  <button className={styles.contactBtn}>
                    <Mail size={16} /> Contacter le vendeur
                  </button>
                  {seller.user?.phone && (
                    <a href={`https://wa.me/${seller.user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                      <Phone size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
