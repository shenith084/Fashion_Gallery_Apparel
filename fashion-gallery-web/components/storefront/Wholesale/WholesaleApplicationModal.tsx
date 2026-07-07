import { useState, useEffect } from 'react';
import styles from './WholesaleApplicationModal.module.css';
import { db } from '@/lib/firebase/config';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesaleApplicationModal({ isOpen, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    orderValue: '',
    products: '',
    additionalInfo: ''
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSuccess(false);
      setFormData({
        fullName: '', businessName: '', businessType: '', address: '',
        city: '', country: '', phone: '', email: '', orderValue: '', products: '', additionalInfo: ''
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/wholesale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>WHOLESALE APPLICATION</h2>
          <div className={styles.divider}></div>
          <p className={styles.modalSubtitle}>
            Fill out the form below to apply for our wholesale program.<br/>
            Our team will review your application and get back to you soon.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '24px' }}>Application Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>Thank you for applying. Our team will review your details and get back to you shortly.</p>
            <button className={`btn btn-primary`} onClick={onClose}>Close Window</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.sectionTitle}>BUSINESS INFORMATION</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Business Name *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter your business name" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Business Type *</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} required>
                  <option value="" disabled>Select business type</option>
                  <option value="retail">Retail Store</option>
                  <option value="online">Online Boutique</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Business Address *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your complete business address" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>City *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter your city" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Country *</label>
                <select name="country" value={formData.country} onChange={handleChange} required>
                  <option value="" disabled>Select your country</option>
                  <option value="lk">Sri Lanka</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <div className={styles.inputWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                </div>
              </div>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: 'var(--space-6)' }}>BUSINESS DETAILS</h3>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Estimated Monthly Order Value *</label>
                <select name="orderValue" value={formData.orderValue} onChange={handleChange} required>
                  <option value="" disabled>Select range</option>
                  <option value="under100k">Under LKR 100,000</option>
                  <option value="100k500k">LKR 100,000 - LKR 500,000</option>
                  <option value="over500k">Over LKR 500,000</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Products Interested In *</label>
                <select name="products" value={formData.products} onChange={handleChange} required>
                  <option value="" disabled>Select products</option>
                  <option value="dresses">Dresses</option>
                  <option value="office">Office Wear</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroupFull}>
              <label>Additional Information</label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} placeholder="Tell us more about your business..."></textarea>
              <div className={styles.charCount}>{formData.additionalInfo.length}/500</div>
            </div>

            <label className={styles.checkboxLabel}>
              <input type="checkbox" required />
              <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a> *</span>
            </label>

            <div className={styles.formActions}>
              <button type="button" className={`btn btn-secondary ${styles.cancelBtn}`} onClick={onClose} disabled={loading}>
                CANCEL
              </button>
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
