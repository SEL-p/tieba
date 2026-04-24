'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingCart, Eye, Star, MapPin, Package, CheckCircle } from 'lucide-react';
import styles from './ProductCard.module.css';
import { formatPrice } from '../data/mockData';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState(false);
  const [adding, setAdding] = useState(false);
  
  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!session) return alert('Veuillez vous connecter');
    
    setWishlist(!wishlist);
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!session) return alert('Veuillez vous connecter');
    
    setAdding(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      setTimeout(() => setAdding(false), 1500);
    } catch (err) {
      setAdding(false);
    }
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const badgeClass = {
    green: 'badge-green',
    orange: 'badge-orange',
    gold: 'badge-gold',
    red: 'badge-red',
    gray: 'badge-gray',
  }[product.badgeType] || 'badge-gray';

  return (
    <div className={styles.card} id={`product-${product.id}`}>
      {/* Image */}
      <div className={styles.imageWrapper}>
        <Link href={`/produit/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={styles.image}
          />
        </Link>

        {/* Badges */}
        <div className={styles.imageBadges}>
          {discount && (
            <span className={`badge badge-red ${styles.discountBadge}`}>-{discount}%</span>
          )}
          {product.badge && (
            <span className={`badge ${badgeClass} ${styles.productBadge}`}>{product.badge}</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`${styles.wishlistBtn} ${wishlist ? styles.active : ''}`}
          onClick={handleFavorite}
          aria-label="Ajouter aux favoris"
          id={`wishlist-${product.id}`}
        >
          <Heart size={18} fill={wishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Quick actions overlay */}
        <div className={styles.overlay}>
          <Link href={`/produit/${product.id}`} className={styles.quickView}>
            <Eye size={16} /> Aperçu rapide
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Seller */}
        <div className={styles.seller}>
          <span className={styles.sellerName}>{product.seller?.businessName || 'Vendeur Tieba'}</span>
          {product.seller?.verified && (
            <span className={styles.verified} title="Vendeur vérifié">✓</span>
          )}
        </div>

        {/* Name */}
        <Link href={`/produit/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ color: s <= Math.round(product.rating) ? '#F59E0B' : '#D1D5DB' }}>★</span>
            ))}
          </div>
          <span className={styles.ratingNum}>{product.rating}</span>
          <span className={styles.reviews}>({(product.reviewsCount || 0).toLocaleString()})</span>
          <span className={styles.sales}>·  {(product.salesCount || 0).toLocaleString()} vendus</span>
        </div>

        {/* Price */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.location}>📍 {product.location}</span>
          <span className={styles.minOrder}>Min: {product.minOrder}</span>
        </div>

        {/* Add to Cart */}
        <button
          className={`${styles.addToCartBtn} ${adding ? styles.added : ''}`}
          onClick={handleAddToCart}
          disabled={adding}
          id={`add-cart-${product.id}`}
        >
          {adding ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
          {adding ? 'Ajouté !' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}
