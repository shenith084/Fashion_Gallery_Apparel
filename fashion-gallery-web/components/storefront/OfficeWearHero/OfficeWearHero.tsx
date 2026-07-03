import Image from 'next/image';
import styles from './OfficeWearHero.module.css';

export default function OfficeWearHero() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>LOOK PROFESSIONAL. FEEL CONFIDENT.</p>
          <h1 className={styles.heroTitle}>
            Office Wear
            <span className={styles.scriptText}>Collection</span>
          </h1>
          <p className={styles.heroDesc}>
            Smart styles for every working woman.<br/>
            Comfort, elegance and confidence in one.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
              </div>
              <span>Premium Fabrics</span>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 6H17V10L14 14V22H10V14L7 10V6Z"/>
                  <path d="M10 2H14"/>
                  <path d="M12 2V6"/>
                </svg>
              </div>
              <span>Tailored Fit</span>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
              </div>
              <span>All Day Comfort</span>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.iconCircle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span>Work Ready Styles</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroImageWrap}>
        <Image
          src="/office-hero-banner.png"
          alt="Office Wear Collection"
          fill
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
