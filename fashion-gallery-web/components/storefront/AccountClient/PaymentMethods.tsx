'use client';

import React from 'react';
import styles from './AccountTabs.module.css';

export default function PaymentMethods() {
  return (
    <div className={styles.tabContainer}>
      <h2 className={styles.title}>Payment Methods</h2>
      <p className={styles.subtitle}>Manage your saved payment details.</p>

      <div className={styles.emptyState}>
        <p>No payment methods saved.</p>
        <button className="btn btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
          Add Card (Coming Soon)
        </button>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-charcoal)' }}>Secure Payments</h4>
        <p style={{ margin: 0, color: 'var(--color-charcoal-light)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          We process all card payments through secure, encrypted gateways. Your full card details are never stored directly on our servers.
        </p>
      </div>
    </div>
  );
}
