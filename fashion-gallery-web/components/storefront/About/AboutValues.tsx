import styles from './AboutValues.module.css';

export default function AboutValues() {
  return (
    <section className={styles.valuesSection}>
      <div className="container">
        <div className="section-title-line">
          <h2 className="section-title">WHAT WE STAND FOR</h2>
        </div>
        
        <div className={styles.grid}>
          {/* Quality First */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 15l-2 5-3-1-1-3-5-2 1-3 3-1 2-5 5 2 3 1 1 3 5 2-1 3-3 1-2 5-5-2z" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 className={styles.title}>QUALITY FIRST</h3>
            <p className={styles.desc}>We use premium fabrics<br/>and ensure top-notch<br/>quality in every piece.</p>
          </div>
          
          {/* Customer Focused */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className={styles.title}>CUSTOMER FOCUSED</h3>
            <p className={styles.desc}>Our customers are at the<br/>heart of everything we do.</p>
          </div>
          
          {/* Timeless Style */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3 className={styles.title}>TIMELESS STYLE</h3>
            <p className={styles.desc}>Elegant designs that stay<br/>in style, season after<br/>season.</p>
          </div>
          
          {/* Ethical Fashion */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <h3 className={styles.title}>ETHICAL FASHION</h3>
            <p className={styles.desc}>We are committed to<br/>ethical practices and<br/>responsible sourcing.</p>
          </div>
          
          {/* Trust & Reliability */}
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <h3 className={styles.title}>TRUST & RELIABILITY</h3>
            <p className={styles.desc}>Building lasting relationships<br/>through trust, transparency,<br/>and exceptional service.</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
