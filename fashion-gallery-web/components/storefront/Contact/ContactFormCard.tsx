'use client';

import styles from './ContactFormCard.module.css';

export default function ContactFormCard() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>SEND US A MESSAGE</h2>
      
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGroup}>
          <input type="text" placeholder="Your Name" required />
        </div>
        
        <div className={styles.formGroup}>
          <input type="tel" placeholder="Phone Number" />
        </div>
        
        <div className={styles.formGroup}>
          <input type="email" placeholder="Email Address" required />
        </div>
        
        <div className={styles.formGroup}>
          <textarea placeholder="Your Message" rows={5} required></textarea>
        </div>
        
        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
}
