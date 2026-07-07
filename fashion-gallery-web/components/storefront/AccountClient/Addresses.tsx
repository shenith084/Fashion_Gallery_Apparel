'use client';

import React from 'react';
import styles from './AccountTabs.module.css';

export default function Addresses() {
  const addresses = [
    {
      id: 'addr1',
      isDefault: true,
      name: 'John Doe',
      street: 'No 45, Temple Road',
      city: 'Mount Lavinia',
      province: 'Western',
      phone: '071 234 5678'
    }
  ];

  return (
    <div className={styles.tabContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-soft-beige)' }}>
        <h2 className={styles.title} style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>Saved Addresses</h2>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>+ Add New Address</button>
      </div>
      
      <p className={styles.subtitle}>Manage your shipping and billing addresses for faster checkout.</p>

      {addresses.length > 0 ? (
        <div className={styles.cardGrid}>
          {addresses.map(addr => (
            <div key={addr.id} className={styles.itemCard}>
              {addr.isDefault && <span className={styles.badge}>Default</span>}
              <h4 className={styles.itemTitle}>{addr.name}</h4>
              <div className={styles.itemText}>
                {addr.street}<br/>
                {addr.city}, {addr.province}<br/>
                {addr.phone}
              </div>
              <div className={styles.itemActions}>
                <button className={styles.actionBtn}>Edit</button>
                <button className={styles.actionBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>You haven't saved any addresses yet.</p>
          <button className="btn btn-primary">Add Address</button>
        </div>
      )}
    </div>
  );
}
