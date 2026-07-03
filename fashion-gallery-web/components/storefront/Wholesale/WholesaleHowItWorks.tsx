import styles from './WholesaleHowItWorks.module.css';

export default function WholesaleHowItWorks() {
  return (
    <section className={styles.howSection}>
      <div className="container">
        <div className="section-title-line">
          <h2 className="section-title">HOW IT WORKS</h2>
        </div>
        
        <div className={styles.processWrap}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.circle}>1</div>
            <h3 className={styles.title}>Apply</h3>
            <p className={styles.desc}>Submit your wholesale<br/>application form.</p>
          </div>
          
          <div className={styles.arrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          
          {/* Step 2 */}
          <div className={styles.step}>
            <div className={styles.circle}>2</div>
            <h3 className={styles.title}>Approval</h3>
            <p className={styles.desc}>Our team will review<br/>and approve your<br/>application.</p>
          </div>
          
          <div className={styles.arrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          
          {/* Step 3 */}
          <div className={styles.step}>
            <div className={styles.circle}>3</div>
            <h3 className={styles.title}>Shop</h3>
            <p className={styles.desc}>Browse our collection<br/>and place your bulk<br/>orders.</p>
          </div>
          
          <div className={styles.arrow}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-rose-gold)" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          
          {/* Step 4 */}
          <div className={styles.step}>
            <div className={styles.circle}>4</div>
            <h3 className={styles.title}>Grow</h3>
            <p className={styles.desc}>Receive your products<br/>and grow your<br/>business.</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
