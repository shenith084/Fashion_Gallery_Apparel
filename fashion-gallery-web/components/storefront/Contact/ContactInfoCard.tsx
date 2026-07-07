import styles from './ContactInfoCard.module.css';

import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

export default async function ContactInfoCard() {
  let settings = {
    phone: '076 415 5008',
    email: 'mymoonclothing@gmail.com',
    address: 'Fashion Gallery,\n186 Main St,\nColombo, Western 01100,\nSri Lanka',
    businessHoursMain: 'Mon - Sat: 8:00 AM - 7:00 PM',
    businessHoursWeekend: 'Sunday: 9:00 AM - 2:00 PM'
  };

  try {
    const docRef = doc(db, 'settings', 'contact');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      settings = { ...settings, ...docSnap.data() } as any;
    }
  } catch (e) {
    console.error('Error fetching contact settings', e);
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>GET IN TOUCH</h2>
      
      <div className={styles.infoList}>
        {/* WhatsApp */}
        <div className={styles.infoItem}>
          <div className={`${styles.iconBox} ${styles.whatsappIcon}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.label}>WHATSAPP</h3>
            <p className={styles.value}>{settings.phone}</p>
          </div>
        </div>
        
        {/* Facebook */}
        <div className={styles.infoItem}>
          <div className={`${styles.iconBox} ${styles.facebookIcon}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.label}>FACEBOOK</h3>
            <p className={styles.value}>My Moon Clothing</p>
          </div>
        </div>
        
        {/* Email */}
        <div className={styles.infoItem}>
          <div className={styles.iconBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.label}>EMAIL</h3>
            <p className={styles.value}>{settings.email}</p>
          </div>
        </div>
        
        {/* Address */}
        <div className={styles.infoItem}>
          <div className={styles.iconBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.label}>ADDRESS</h3>
            <p className={styles.value} style={{ whiteSpace: 'pre-line' }}>
              {settings.address}
            </p>
          </div>
        </div>
        
        {/* Business Hours */}
        <div className={styles.infoItem}>
          <div className={styles.iconBox}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.label}>BUSINESS HOURS</h3>
            <p className={styles.value}>{settings.businessHoursMain}</p>
            <p className={styles.value}>{settings.businessHoursWeekend}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
