'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AccountTabs.module.css';

export default function Wishlist() {
  // In a real app, this would be fetched from a wishlist store or Firebase
  const mockWishlist = [
    {
      id: 'w1',
      name: 'Burgundy Office Midi',
      price: 4500,
      image: '/prod-wrap-midi.png',
      slug: 'burgundy-office-midi'
    },
    {
      id: 'w2',
      name: 'Floral Summer Dress',
      price: 5200,
      image: '/prod-office-dress.png', // reusing existing mock image
      slug: 'floral-summer-dress'
    }
  ];

  return (
    <div className={styles.tabContainer}>
      <h2 className={styles.title}>My Wishlist</h2>
      <p className={styles.subtitle}>Items you have saved for later.</p>

      {mockWishlist.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {mockWishlist.map(item => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#fff', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '1rem' }}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--color-charcoal)' }}>{item.name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: 'var(--color-burgundy)' }}>LKR {item.price.toLocaleString('en-LK')}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href={`/product/${item.slug}`} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                  View Product
                </Link>
                <button className={styles.actionBtn} style={{ color: 'var(--color-charcoal-light)', textDecoration: 'underline' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Your wishlist is currently empty.</p>
          <Link href="/dresses" className="btn btn-primary">Browse Dresses</Link>
        </div>
      )}
    </div>
  );
}
