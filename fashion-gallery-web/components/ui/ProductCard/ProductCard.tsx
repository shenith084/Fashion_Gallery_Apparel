'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
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
            <linearGradient id={`half-${star}`}>
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
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const router = useRouter();
  
  const [wished, setWished] = useState(false);

  useEffect(() => {
    if (user && user.wishlist?.includes(id)) {
      setWished(true);
    } else {
      setWished(false);
    }
  }, [user, id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    const newWished = !wished;
    setWished(newWished); // Optimistic UI update
    
    let currentWishlist = user.wishlist || [];
    if (newWished) {
      currentWishlist = [...currentWishlist, id];
    } else {
      currentWishlist = currentWishlist.filter(itemId => itemId !== id);
    }
    
    updateUser({ wishlist: currentWishlist });
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        wishlist: currentWishlist
      });
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  return (
    <div className={styles.card} id={`product-card-${id}`}>
      <Link href={href} className={styles.imageWrap}>
        {isNew && <span className={styles.newBadge}>NEW</span>}
        <Image
          src={image || '/logo.svg'}
          alt={name || 'Product Image'}
          fill
          sizes="(max-width: 768px) 45vw, 16vw"
          className={styles.image}
          unoptimized={true}
        />
        <div className={styles.overlay} />
      </Link>

      <button
        className={`${styles.wishlistBtn} ${wished ? styles.wished : ''}`}
        onClick={toggleWishlist}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        id={`wishlist-${id}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'var(--color-burgundy)' : 'none'} stroke="var(--color-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <div className={styles.info}>
        <div className={styles.colorSwatches}>
          <span className={styles.colorSwatch} style={{ backgroundColor: '#6B2335' }}></span>
          <span className={styles.colorSwatch} style={{ backgroundColor: '#EAD1D8' }}></span>
          <span className={styles.colorSwatch} style={{ backgroundColor: '#E4DFD8' }}></span>
        </div>
        <h3 className={styles.name}>
          <Link href={href}>{name}</Link>
        </h3>
        <p className={styles.price}>LKR {price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
        <div className={styles.rating}>
          <StarRating rating={rating} />
          <span className={styles.reviewCount}>({reviewCount})</span>
        </div>
        <div className={styles.actionRow}>
          <button 
            className={styles.addToCartBtn} 
            id={`add-to-cart-${id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = href;
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
