import styles from './AboutStats.module.css';

export default function AboutStats() {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.grid}>
          {/* Happy Customers */}
          <div className={styles.statItem}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <div className={styles.statText}>
              <h4 className={styles.number}>5,000+</h4>
              <p className={styles.label}>Happy Customers</p>
            </div>
          </div>
          
          {/* Styles Available */}
          <div className={styles.statItem}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M8 22h8M8 2h8M5 10c0-2.5 1-4.5 3-6h8c2 1.5 3 3.5 3 6 0 4-3 7-7 7s-7-3-7-7z"/>
            </svg>
            <div className={styles.statText}>
              <h4 className={styles.number}>500+</h4>
              <p className={styles.label}>Styles Available</p>
            </div>
          </div>
          
          {/* Wholesale Partners */}
          <div className={styles.statItem}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <div className={styles.statText}>
              <h4 className={styles.number}>50+</h4>
              <p className={styles.label}>Wholesale Partners</p>
            </div>
          </div>
          
          {/* Customer Support */}
          <div className={styles.statItem}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
            </svg>
            <div className={styles.statText}>
              <h4 className={styles.number}>Dedicated</h4>
              <p className={styles.label}>Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
