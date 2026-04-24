'use client';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowLeftRight, Lock, 
  Star, MessageCircle, Store, Truck, 
  ChevronRight, Minus, Plus, ShoppingCart, Zap, Heart,
  MapPin, Package, CheckCircle
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { formatPrice } from '../../data/mockData';
import styles from './produit.module.css';

export default function ProduitPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        if (data.categoryId) {
          const relatedRes = await fetch(`/api/products?categoryId=${data.categoryId}`);
          const relatedData = await relatedRes.json();
          setRelated(relatedData.filter(p => p.id != id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Chargement du produit...</div>;
  if (!product) return <div className={styles.error}>Produit non trouvé.</div>;

  const images = [product.image, '/category_cocoa.png', '/category_textile.png', '/category_cashew.png'];
  
  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <ChevronRight size={14} />
            <Link href={`/categories/${product.categoryId}`}>{product.category || 'Catégorie'}</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          {/* Main Product Section */}
          <div className={styles.productLayout}>
            {/* Images */}
            <div className={styles.imageSection}>
              <div className={styles.mainImageWrapper}>
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${i === selectedImage ? styles.activeThumbnail : ''}`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`Image ${i + 1}`}
                    id={`thumb-${i}`}
                  >
                    <Image src={img} alt={`Vue ${i + 1}`} fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className={styles.infoSection}>
              {/* Seller & badges */}
              <div className={styles.sellerRow}>
                <div className={styles.sellerBadge}>
                  <BadgeCheck size={16} className={styles.verifiedIcon} />
                  <span>{product.seller?.businessName || 'Vendeur Tiéba'}</span>
                </div>
                <span className="badge badge-orange">Gros & Détail</span>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Rating */}
              <div className={styles.ratingSection}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18} fill={s <= 4 ? '#F59E0B' : 'transparent'} color={s <= 4 ? '#F59E0B' : '#E5E7EB'} />
                  ))}
                </div>
                <span className={styles.ratingNum}>4.0</span>
                <span className={styles.reviewCount}>(24 avis)</span>
                <span className={styles.salesCount}>150+ vendus</span>
              </div>

              {/* Price */}
              <div className={styles.priceSection}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
              </div>

              {/* Key info */}
              <div className={styles.keyInfoGrid}>
                <div className={styles.keyInfo}>
                  <span className={styles.keyInfoLabel}>📍 Localisation</span>
                  <span className={styles.keyInfoValue}>{product.location}</span>
                </div>
                <div className={styles.keyInfo}>
                  <span className={styles.keyInfoLabel}>📦 Commande min.</span>
                  <span className={styles.keyInfoValue}>{product.minOrder}</span>
                </div>
                <div className={styles.keyInfo}>
                  <span className={styles.keyInfoLabel}>🚚 Livraison</span>
                  <span className={styles.keyInfoValue}>2 500 FCFA / Abidjan</span>
                </div>
                <div className={styles.keyInfo}>
                  <span className={styles.keyInfoLabel}>✅ Disponibilité</span>
                  <span className={styles.keyInfoValue} style={{ color: 'var(--green)' }}>En stock</span>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className={styles.actionsSection}>
                <div className={styles.quantityRow}>
                  <label className={styles.qtyLabel}>Quantité :</label>
                  <div className={styles.qtyControls}>
                    <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))} id="qty-minus">−</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className={styles.qtyInput}
                      id="quantity-input"
                    />
                    <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)} id="qty-plus">+</button>
                  </div>
                  <span className={styles.totalCalc}>= {formatPrice(product.price * quantity)}</span>
                </div>

                <div className={styles.actionBtns}>
                  <button
                    className={`${styles.addCartBtn} ${addedToCart ? styles.addedBtn : ''}`}
                    onClick={handleAddToCart}
                    id="add-to-cart-btn"
                  >
                    {addedToCart ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
                    {addedToCart ? 'Ajouté !' : 'Ajouter au panier'}
                  </button>
                  <button className={styles.buyNowBtn} id="buy-now-btn">
                    <Zap size={20} />
                    Acheter maintenant
                  </button>
                </div>

                <div className={styles.contactBtns}>
                  <button className={styles.contactBtn} id="contact-seller-btn">
                    💬 Contacter le vendeur
                  </button>
                  <button className={styles.wishlistBtn} id="add-wishlist-btn">
                    🤍 Favoris
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trust}>🛡️ Acheteur protégé</div>
                <div className={styles.trust}>↩️ Retour 14j</div>
                <div className={styles.trust}>🔒 Paiement sécurisé</div>
              </div>
            </div>
          </div>

          {/* Tabs: Description, Avis, Vendeur */}
          <div className={styles.tabsSection}>
            <div className={styles.tabNav}>
              {[
                { key: 'description', label: '📋 Description' },
                { key: 'avis', label: '⭐ Avis clients' },
                { key: 'vendeur', label: '🏭 Le vendeur' },
                { key: 'livraison', label: '🚚 Livraison & Retour' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTabBtn : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  id={`tab-${tab.key}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div className={styles.descContent}>
                  <h3>À propos de ce produit</h3>
                  <p>
                    Découvrez <strong>{product.name}</strong>, un produit de qualité supérieure provenant directement des producteurs ivoiriens.
                    Certifié et vérifié par notre équipe Tieba Market, ce produit répond aux standards les plus élevés du marché international.
                  </p>
                  <h3>Caractéristiques</h3>
                  <ul>
                    <li>✓ Origine : {product.location}, Côte d'Ivoire</li>
                    <li>✓ Qualité certifiée premium</li>
                    <li>✓ Conditionnement adapté à l'export</li>
                    <li>✓ Traçabilité complète disponible</li>
                    <li>✓ Commande minimum : {product.minOrder}</li>
                  </ul>
                  <h3>Spécifications</h3>
                  <div className={styles.specTable}>
                    {[
                      ['Catégorie', product.category],
                      ['Vendeur', product.seller],
                      ['Localisation', product.location],
                      ['Note', `${product.rating}/5 (${product.reviews} avis)`],
                      ['Vendus', `${product.sales.toLocaleString()} unités`],
                    ].map(([key, val]) => (
                      <div key={key} className={styles.specRow}>
                        <span className={styles.specKey}>{key}</span>
                        <span className={styles.specVal}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'avis' && (
                <div className={styles.reviewsContent}>
                  <div className={styles.reviewSummary}>
                    <div className={styles.bigRating}>{product.rating}</div>
                    <div>
                      <div className={styles.bigStars}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB', fontSize: '28px' }}>★</span>
                        ))}
                      </div>
                      <p>{product.reviews.toLocaleString()} avis clients</p>
                    </div>
                  </div>
                  {[
                    { name: 'Kouamé A.', note: 5, text: 'Excellent produit, livraison rapide ! Je recommande vivement ce vendeur.', date: 'Il y a 2 jours' },
                    { name: 'Fatima B.', note: 4, text: 'Très bonne qualité, conforme à la description. Emballage soigné.', date: 'Il y a 1 semaine' },
                    { name: 'Ibrahim K.', note: 5, text: 'Parfait pour mon business. Je commande régulièrement ici.', date: 'Il y a 2 semaines' },
                  ].map((review, i) => (
                    <div key={i} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewAvatar}>{review.name[0]}</div>
                        <div>
                          <div className={styles.reviewName}>{review.name}</div>
                          <div className={styles.reviewDate}>{review.date}</div>
                        </div>
                        <div className={styles.reviewStars}>
                          {'★'.repeat(review.note)}{'☆'.repeat(5 - review.note)}
                        </div>
                      </div>
                      <p className={styles.reviewText}>{review.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'vendeur' && (
                <div className={styles.vendeurContent}>
                  <div className={styles.vendeurCard}>
                    <div className={styles.vendeurHeader}>
                      <div className={styles.vendeurLogo}>{product.seller[0]}</div>
                      <div>
                        <h3 className={styles.vendeurName}>{product.seller}</h3>
                        <span className="badge badge-green">✓ Vendeur vérifié</span>
                      </div>
                    </div>
                    <div className={styles.vendeurStats}>
                      <div className={styles.vendeurStat}><span>{product.rating}</span><small>Note</small></div>
                      <div className={styles.vendeurStat}><span>{product.reviews}+</span><small>Avis</small></div>
                      <div className={styles.vendeurStat}><span>{product.sales.toLocaleString()}+</span><small>Ventes</small></div>
                    </div>
                    <div className={styles.vendeurLocation}>📍 {product.location}, Côte d'Ivoire</div>
                    <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                      Voir toute la boutique
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'livraison' && (
                <div className={styles.livraisonContent}>
                  <h3>🚚 Livraison</h3>
                  <ul>
                    <li>Abidjan : 2 500 FCFA sous 24–48h</li>
                    <li>Autres villes CI : 4 500–8 000 FCFA sous 2–5 jours</li>
                    <li>International (Afrique de l'Ouest) : Sur devis</li>
                  </ul>
                  <h3>↩️ Retours</h3>
                  <ul>
                    <li>Retour gratuit sous 14 jours</li>
                    <li>Produit doit être dans son état d'origine</li>
                    <li>Remboursement sous 3–5 jours ouvrés</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <section aria-labelledby="related-title" style={{ marginTop: '48px' }}>
            <div className="section-header">
              <div>
                <h2 className="section-title" id="related-title">Produits similaires</h2>
                <div className="divider"></div>
              </div>
              <Link href="/produits" className="btn btn-outline btn-sm">Voir plus →</Link>
            </div>
            <div className={styles.relatedGrid}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
