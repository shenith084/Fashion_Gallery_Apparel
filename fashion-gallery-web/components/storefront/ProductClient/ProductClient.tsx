'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type Product } from '@/lib/data/products';
import styles from './ProductClient.module.css';

interface ProductClientProps {
  product: Product;
}

export default function ProductClient({ product }: ProductClientProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color.');
      return;
    }
    setAdding(true);
    // Simulate API call for adding to cart
    setTimeout(() => {
      setAdding(false);
      alert(`Added ${qty} ${product.name} to cart!`);
    }, 600);
  };

  return (
    <div className={styles.wrapper}>
      {/* ──── IMAGE GALLERY ──── */}
      <div className={styles.gallery}>
        <div className={styles.thumbnailList}>
          {product.images.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumbnail} ${activeImage === img ? styles.thumbnailActive : ''}`}
              onClick={() => setActiveImage(img)}
              aria-label={`View image ${idx + 1}`}
            >
              <Image src={img} alt="" fill sizes="80px" className={styles.thumbImg} />
            </button>
          ))}
        </div>
        <div className={styles.mainImageWrap}>
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.mainImage}
            priority
          />
          {product.isNew && <span className={styles.newBadge}>NEW</span>}
        </div>
      </div>

      {/* ──── PRODUCT INFO ──── */}
      <div className={styles.info}>
        <nav className={styles.breadcrumb}>
          <a href="/">Home</a> <span>›</span>
          <a href="/shop">Shop</a> <span>›</span>
          <a href={`/category/${product.categorySlug}`}>{product.category}</a> <span>›</span>
          <span>{product.name}</span>
        </nav>

        <h1 className={styles.title}>{product.name}</h1>
        
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={star <= Math.floor(product.rating) ? 'var(--color-luxury-gold)' : star - 0.5 <= product.rating ? 'url(#half)' : 'none'}
                stroke="var(--color-luxury-gold)"
                strokeWidth="1.5"
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="var(--color-luxury-gold)"/>
                    <stop offset="50%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className={styles.reviews}>{product.reviewCount} Reviews</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            LKR {product.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              LKR {product.originalPrice.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        <p className={styles.description}>{product.description}</p>

        {/* Variations */}
        <div className={styles.variants}>
          <div className={styles.variantGroup}>
            <div className={styles.variantHeader}>
              <span className={styles.variantLabel}>Color: <span className={styles.variantSelected}>{selectedColor || 'Select'}</span></span>
            </div>
            <div className={styles.optionsList}>
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorBtn} ${selectedColor === color ? styles.colorActive : ''}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.variantGroup}>
            <div className={styles.variantHeader}>
              <span className={styles.variantLabel}>Size: <span className={styles.variantSelected}>{selectedSize || 'Select'}</span></span>
              <button className={styles.sizeGuideBtn}>Size Guide</button>
            </div>
            <div className={styles.optionsList}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.qtyControl}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
          </div>
          <button 
            className={`btn btn-primary ${styles.addToCartBtn}`} 
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button className={styles.wishlistBtn} aria-label="Add to wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Extra Info */}
        <div className={styles.extraInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Fabric:</span>
            <span>{product.fabric}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Model:</span>
            <span>Wearing size {product.modelSize}</span>
          </div>
        </div>

        {/* Trust features */}
        <div className={styles.trustFeatures}>
          <div className={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Secure Payment</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>Island-wide Delivery</span>
          </div>
          <div className={styles.trustItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
            </svg>
            <span>7 Days Return</span>
          </div>
        </div>

      </div>
    </div>
  );
}
