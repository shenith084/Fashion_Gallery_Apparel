import Image from 'next/image';
import styles from './AboutPromise.module.css';

export default function AboutPromise() {
  return (
    <section className={styles.promiseSection}>
      <div className="container">
        <div className={styles.splitLayout}>
          <div className={styles.contentCol}>
            <div className={styles.titleWrap}>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
                OUR PROMISE
              </h2>
              <div className={styles.divider}></div>
            </div>
            
            <p className={styles.desc}>
              We are dedicated to delivering more than just beautiful clothing.
              We promise to provide a smooth shopping experience, honest
              service, and fashion that makes you feel confident and unique.
              Thank you for being a part of the My Moon family.
            </p>
          </div>
          
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <Image
                src="/about-promise.png"
                alt="Our Promise"
                fill
                className={styles.promiseImg}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
