import styles from './WholesaleBenefits.module.css';

export default function WholesaleBenefits() {
  return (
    <section className={styles.benefitsSection}>
      <div className="container">
        <div className="section-title-line">
          <h2 className="section-title">BENEFITS OF PARTNERING WITH US</h2>
        </div>
        
        <div className={styles.grid}>
          {/* Competitive Pricing */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" strokeLinecap="round"/>
                <path d="M11 15l4-4M12 11h.01M14 15h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={styles.desc}>Competitive<br/>Wholesale Pricing</p>
          </div>
          
          {/* Flexible Order Quantities */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <p className={styles.desc}>Flexible Order<br/>Quantities</p>
          </div>
          
          {/* New Arrivals */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </div>
            <p className={styles.desc}>New Arrivals<br/>Every Season</p>
          </div>
          
          {/* Trusted Quality */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15l-2 5-3-1-1-3-5-2 1-3 3-1 2-5 5 2 3 1 1 3 5 2-1 3-3 1-2 5-5-2z" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <p className={styles.desc}>Trusted Quality<br/>You Can Rely On</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
