'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc, arrayRemove, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import styles from './AccountTabs.module.css';

export default function Wishlist() {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user || !user.wishlist || user.wishlist.length === 0) {
        setWishlist([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'products'),
          where(documentId(), 'in', user.wishlist),
          where('status', '==', 'Active')
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setWishlist(products);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeWishlist = async (productId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { wishlist: arrayRemove(productId) });
      updateUser({ wishlist: (user.wishlist || []).filter(id => id !== productId) });
      setWishlist(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading wishlist...</div>;

  return (
    <div className={styles.tabContainer}>
      <h2 className={styles.title}>My Wishlist</h2>
      <p className={styles.subtitle}>Items you have saved for later.</p>

      {wishlist.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(item => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#fff', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1rem' }}>
                <Image 
                  src={
                    item.image || 
                    (item.images && item.images[0]?.secureUrl) || 
                    (item.images && typeof item.images[0] === 'string' ? item.images[0] : null) || 
                    '/logo.svg'
                  } 
                  alt={item.name} 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--color-charcoal)' }}>{item.name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: 'var(--color-burgundy)' }}>
                LKR {(item.price || item.basePrice || 0).toLocaleString('en-LK')}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href={`/product/${item.slug}`} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                  View Product
                </Link>
                <button onClick={() => removeWishlist(item.id)} className={styles.actionBtn} style={{ color: 'var(--color-charcoal-light)', textDecoration: 'underline' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Your wishlist is currently empty.</p>
          <Link href="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      )}
    </div>
  );
}
