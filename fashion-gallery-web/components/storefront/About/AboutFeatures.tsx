import styles from './AboutFeatures.module.css';

export default function AboutFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className="section-title-line">
          <h2 className="section-title">WHY SHOP WITH US?</h2>
        </div>
        
        <div className={styles.grid}>
          {/* Fast Delivery */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 2.83A2 2 0 0 0 6.26 19H20"/>
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <h3 className={styles.title}>FAST DELIVERY</h3>
            <p className={styles.desc}>Island-wide delivery<br/>within 1-3 working days</p>
          </div>
          
          {/* Easy Returns */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </div>
            <h3 className={styles.title}>EASY RETURNS</h3>
            <p className={styles.desc}>Hassle-free returns<br/>within 7 days</p>
          </div>
          
          {/* Secure Payments */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <h3 className={styles.title}>SECURE PAYMENTS</h3>
            <p className={styles.desc}>100% safe & secure<br/>payments</p>
          </div>
          
          {/* Quality Assured */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15l-2 5-3-1-1-3-5-2 1-3 3-1 2-5 5 2 3 1 1 3 5 2-1 3-3 1-2 5-5-2z" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className={styles.title}>QUALITY ASSURED</h3>
            <p className={styles.desc}>Carefully selected<br/>premium fabrics</p>
          </div>
          
          {/* Customer Support */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <h3 className={styles.title}>CUSTOMER SUPPORT</h3>
            <p className={styles.desc}>We're here to help<br/>you anytime</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
