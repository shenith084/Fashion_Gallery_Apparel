import Image from 'next/image';
import styles from './WholesalePartner.module.css';

interface WholesalePartnerProps {
  openModal: () => void;
}

export default function WholesalePartner({ openModal }: WholesalePartnerProps) {
  return (
    <section className={styles.partnerSection}>
      <div className="container">
        <div className={styles.splitLayout}>
          <div className={styles.imageCol}>
            <Image
              src="/wholesale-partner.png"
              alt="Wholesale Partner"
              fill
              className={styles.partnerImg}
            />
          </div>
          
          <div className={styles.contentCol}>
            <div className={styles.titleWrap}>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>
                WHO CAN PARTNER WITH US?
              </h2>
              <div className={styles.divider}></div>
            </div>
            
            <p className={styles.desc}>
              Our wholesale program is designed for businesses<br/>
              and entrepreneurs who want to offer premium<br/>
              fashion to their customers.
            </p>
            
            <ul className={styles.checkList}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Boutiques & Retail Stores
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Online Store Owners
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Bulk Buyers & Distributors
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Fashion Entrepreneurs
              </li>
            </ul>
            
            <button className={`btn btn-primary ${styles.applyBtn}`} onClick={openModal}>
              APPLY NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
