'use client';

import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // TODO: integrate with Resend/email service
    setStatus('success');
    setEmail('');
  };

  return (
    <section className={styles.section} id="newsletter-section">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.textContent}>
            <div className={styles.mailIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
                <polyline points="3 7 12 13 21 7"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.title} style={{ textTransform: 'uppercase' }}>Stay in Style</h2>
              <p className={styles.desc}>
                Subscribe to get special offers, new arrivals and exclusive discounts.
              </p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} id="newsletter-form">
            <div className={styles.inputRow}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="Enter your email address"
                className={styles.input}
                id="newsletter-email"
                aria-label="Email address for newsletter"
              />
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} id="newsletter-submit">
                Subscribe
              </button>
            </div>
            {status === 'success' && (
              <p className={styles.successMsg}>
                ✓ Thank you! You&apos;re subscribed to our style updates.
              </p>
            )}
            {status === 'error' && (
              <p className={styles.errorMsg}>
                Please enter a valid email address.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
