'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  href: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={star <= Math.floor(rating) ? 'var(--color-luxury-gold)' : star - 0.5 <= rating ? 'url(#half)' : 'none'}
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
  );
}

export default function ProductCard({ id, name, price, image, rating, reviewCount, isNew, href }: ProductCardProps) {
  const [wished, setWished] = useState(false);

  return (
    <div className={styles.card} id={`product-card-${id}`}>
      <Link href={href} className={styles.imageWrap}>
        {isNew && <span className={styles.newBadge}>NEW</span>}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 45vw, 16vw"
          className={styles.image}
        />
        <div className={styles.overlay} />
        <span className={styles.quickView}>
          Quick View
        </span>
      </Link>

      <button
        className={`${styles.wishlistBtn} ${wished ? styles.wished : ''}`}
        onClick={() => setWished(!wished)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        id={`wishlist-${id}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'var(--color-burgundy)' : 'none'} stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link href={href}>{name}</Link>
        </h3>
        <p className={styles.price}>LKR {price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
        <div className={styles.rating}>
          <StarRating rating={rating} />
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
