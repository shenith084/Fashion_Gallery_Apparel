import Image from 'next/image';
import styles from './DressesHero.module.css';

export default function DressesHero() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>TIMELESS DRESSES FOR EVERY MOMENT</p>
          <h1 className={styles.heroTitle}>Find The Perfect<br/>Dress For You</h1>
          <p className={styles.heroDesc}>
            From casual days to special occasions,<br/>
            our dresses collection is made to fit your style.
          </p>
        </div>
      </div>
      <div className={styles.heroImageWrap}>
        <Image
          src="/dresses-hero-banner.png"
          alt="Dresses Collection"
          fill
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
