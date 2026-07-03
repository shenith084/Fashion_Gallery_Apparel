import Image from 'next/image';
import styles from './WholesaleHero.module.css';

interface WholesaleHeroProps {
  openModal: () => void;
}

export default function WholesaleHero({ openModal }: WholesaleHeroProps) {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>PARTNER WITH US</p>
          <h1 className={styles.heroTitle}>
            Wholesale
            <span className={styles.scriptText}>Opportunities</span>
          </h1>
          <p className={styles.heroDesc}>
            Join hands with My Moon and grow your business
            <br />
            with our premium quality fashion at exclusive
            <br />
            wholesale prices.
          </p>
          
          <div className={styles.heroActions}>
            <button className={`btn btn-primary ${styles.applyBtn}`} onClick={openModal}>
              APPLY FOR WHOLESALE
            </button>
          </div>
        </div>
      </div>
      <div className={styles.heroImageWrap}>
        <Image
          src="/wholesale-hero-bg.png"
          alt="Wholesale Opportunities"
          fill
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
