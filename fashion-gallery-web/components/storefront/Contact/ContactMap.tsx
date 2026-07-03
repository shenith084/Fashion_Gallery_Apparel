import styles from './ContactMap.module.css';

export default function ContactMap() {
  return (
    <section className={styles.mapSection}>
      <div className="container">
        <div className={styles.mapWrap}>
          {/* Using a Google Maps embed for Sri Lanka / generic location */}
          <iframe
            src="https://maps.google.com/maps?q=Fashion+Gallery,+186+Main+St,+Colombo,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="My Moon Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
