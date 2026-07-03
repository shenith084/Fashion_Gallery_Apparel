import styles from './WholesaleFeatures.module.css';

export default function WholesaleFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className="section-title-line">
          <h2 className="section-title">WHY WHOLESALE WITH MY MOON?</h2>
        </div>
        
        <div className={styles.grid}>
          {/* Premium Quality */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15l-2 5-3-1-1-3-5-2 1-3 3-1 2-5 5 2 3 1 1 3 5 2-1 3-3 1-2 5-5-2z" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className={styles.title}>Premium Quality</h3>
            <p className={styles.desc}>Carefully selected<br/>fabrics & fine<br/>craftsmanship</p>
          </div>
          
          {/* Exclusive Pricing */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" strokeLinecap="round"/>
                <path d="M11 15l4-4M12 11h.01M14 15h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.title}>Exclusive Pricing</h3>
            <p className={styles.desc}>Special wholesale<br/>prices for our<br/>business partners</p>
          </div>
          
          {/* Wide Range */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 className={styles.title}>Wide Range</h3>
            <p className={styles.desc}>Dresses, office wear<br/>& new arrivals in<br/>various styles</p>
          </div>
          
          {/* Reliable Delivery */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 2.83A2 2 0 0 0 6.26 19H20"/>
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <h3 className={styles.title}>Reliable Delivery</h3>
            <p className={styles.desc}>On-time delivery<br/>with secure<br/>packaging</p>
          </div>
          
          {/* Dedicated Support */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <h3 className={styles.title}>Dedicated Support</h3>
            <p className={styles.desc}>Personalized support<br/>for your business<br/>growth</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
