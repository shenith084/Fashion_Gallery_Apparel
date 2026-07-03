import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutHero.module.css';

export default function AboutHero() {
  return (
    <section className={styles.heroSection}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>GET TO KNOW US</p>
          <h1 className={styles.heroTitle}>
            About
            <span className={styles.scriptText}>My Moon</span>
          </h1>
          <div className={styles.divider}></div>
          <p className={styles.heroDesc}>
            At My Moon, we believe fashion is more than what you wear—
            it's how you express yourself. We bring together timeless
            elegance, modern style, and premium quality to <strong>help women
            look and feel their best, every day.</strong>
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/dresses" className={`btn btn-primary ${styles.collectionBtn}`}>
              OUR COLLECTION
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroImageWrap}>
        <Image
          src="/wholesale-hero-bg.png"
          alt="About My Moon"
          fill
          className={styles.heroImage}
          priority
        />
      </div>
    </section>
  );
}
