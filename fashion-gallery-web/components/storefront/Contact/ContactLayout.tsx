import Image from 'next/image';
import styles from './ContactLayout.module.css';
import ContactInfoCard from './ContactInfoCard';
import ContactFormCard from './ContactFormCard';

export default function ContactLayout() {
  return (
    <div className={styles.layout}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>WE'D LOVE TO HEAR FROM YOU</p>
            <h1 className={styles.heroTitle}>
              Get in
              <span className={styles.scriptText}>Touch</span>
            </h1>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <Image
            src="/wholesale-hero-bg.png"
            alt="Contact My Moon"
            fill
            className={styles.heroImage}
            priority
          />
        </div>
      </section>
      
      {/* Main Content Grid */}
      <div className="container">
        <div className={styles.grid}>
          <ContactInfoCard />
          <ContactFormCard />
        </div>
      </div>
    </div>
  );
}
