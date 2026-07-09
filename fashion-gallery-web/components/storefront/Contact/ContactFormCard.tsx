'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { submitInquiryAction } from '@/app/actions/inquiry';
import styles from './ContactFormCard.module.css';

export default function ContactFormCard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
    
    try {
      const result = await submitInquiryAction(data);
      
      if (result.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMsg(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>SEND US A MESSAGE</h2>
      
      {!mounted ? null : !user ? (
        <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-gray-200)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-charcoal)' }}>Login Required</h3>
          <p style={{ color: 'var(--color-charcoal-light)', marginBottom: '1.5rem' }}>You must be logged in to send us a message.</p>
          <Link href="/login?returnUrl=/contact" className="btn btn-primary">
            Login Now
          </Link>
        </div>
      ) : success ? (
        <div style={{ background: 'var(--color-success)', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Message Sent!</h3>
          <p>Thank you for reaching out. We will get back to you shortly.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="btn" 
            style={{ marginTop: '1rem', background: 'white', color: 'var(--color-success)' }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}
          
          <div className={styles.formGroup}>
            <input type="text" name="name" placeholder="Your Name" required />
          </div>
          
          <div className={styles.formGroup}>
            <input type="tel" name="phone" placeholder="Phone Number" />
          </div>
          
          <div className={styles.formGroup}>
            <input type="email" name="email" placeholder="Email Address" required />
          </div>
          
          <div className={styles.formGroup}>
            <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
          </div>
          
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      )}
    </div>
  );
}
