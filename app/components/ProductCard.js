'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { formatPrice, getDiscount } from '../data/mockData';

export default function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false);
  const discount = getDiscount(product.price, product.originalPrice);

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
          onClick={() => setWishlist(!wishlist)}
          aria-label="Ajouter aux favoris"
          id={`wishlist-${product.id}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick actions overlay */}
        <div className={styles.overlay}>
          <Link href={`/produit/${product.id}`} className={styles.quickView}>
            👁 Aperçu rapide
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Seller */}
        <div className={styles.seller}>
          <span className={styles.sellerName}>{product.seller}</span>
          {product.sellerVerified && (
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
          <span className={styles.reviews}>({product.reviews.toLocaleString()})</span>
          <span className={styles.sales}>·  {product.sales.toLocaleString()} vendus</span>
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
          className={styles.addToCartBtn}
          id={`add-cart-${product.id}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
