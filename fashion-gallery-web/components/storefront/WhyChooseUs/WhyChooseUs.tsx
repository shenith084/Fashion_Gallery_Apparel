import styles from './WhyChooseUs.module.css';

const FEATURES = [
  {
    id: 'premium-quality',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Premium Quality',
    description: 'Carefully selected fabrics for your comfort',
  },
  {
    id: 'easy-returns',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
      </svg>
    ),
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days',
  },
  {
    id: 'excellent-support',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Excellent Support',
    description: 'We are here to help you anytime',
  },
  {
    id: 'secure-payment',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure Payment',
    description: 'Your payment information is safe with us',
  },
];

export default function WhyChooseUs() {
  return (
    <section className={styles.section} id="why-choose-us">
      <div className="container">
        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <div key={feature.id} className={styles.item} id={`feature-${feature.id}`}>
              <span className={styles.icon}>{feature.icon}</span>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
