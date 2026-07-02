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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Stay in Style</h2>
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
