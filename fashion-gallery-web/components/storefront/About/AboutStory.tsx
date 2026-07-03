import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutStory.module.css';

export default function AboutStory() {
  return (
    <section className={styles.storySection}>
      <div className="container">
        <div className={styles.splitLayout}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src="/wholesale-hero-bg.png"
                alt="Our Story"
                fill
                className={styles.storyImg}
              />
            </div>
          </div>
          
          <div className={styles.contentCol}>
            <div className={styles.titleWrap}>
              <p className={styles.eyebrow}>OUR STORY</p>
              <div className={styles.divider}></div>
              <h2 className={styles.title}>
                Designed for Confidence,<br/>
                Made for Women
              </h2>
            </div>
            
            <div className={styles.desc}>
              <p>
                <strong>Founded</strong> with a passion for empowering women through fashion,
                My Moon started as a vision to create stylish, comfortable, and
                affordable clothing for every occasion.
              </p>
              <p>
                From elegant dresses to chic office wear, we carefully curate each
                piece with attention to detail, premium fabrics, and the perfect fit—
                because you deserve nothing less than the best.
              </p>
            </div>
            
            <Link href="/dresses" className={`btn btn-primary ${styles.shopBtn}`}>
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
