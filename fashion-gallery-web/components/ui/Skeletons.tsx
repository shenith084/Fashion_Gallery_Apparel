import styles from './Skeletons.module.css';

export function HeroSkeleton() {
  return (
    <section className={styles.heroSkeleton}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <div className={styles.skeletonTextRow} style={{ width: '60%', height: '16px', marginBottom: '24px' }}></div>
          <div className={styles.skeletonTextRow} style={{ width: '90%', height: '48px', marginBottom: '16px' }}></div>
          <div className={styles.skeletonTextRow} style={{ width: '70%', height: '48px', marginBottom: '32px' }}></div>
          <div className={styles.skeletonTextRow} style={{ width: '80%', height: '24px', marginBottom: '16px' }}></div>
          <div className={styles.skeletonTextRow} style={{ width: '60%', height: '24px', marginBottom: '48px' }}></div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <div className={styles.skeletonImage}></div>
        </div>
      </div>
    </section>
  );
}

export function ProductGridSkeleton({ count = 4, columns = 4 }: { count?: number, columns?: 3 | 4 }) {
  return (
    <div className={styles.productGrid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.productCard}>
          <div className={styles.productImage}></div>
          <div className={styles.productInfo}>
            <div className={styles.skeletonTextRow} style={{ width: '80%', height: '20px', margin: '0 auto 8px' }}></div>
            <div className={styles.skeletonTextRow} style={{ width: '40%', height: '16px', margin: '0 auto' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VideoGallerySkeleton() {
  return (
    <div className={styles.productGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.videoCard}>
          <div className={styles.skeletonImage} style={{ paddingBottom: '177%' }}></div>
        </div>
      ))}
    </div>
  );
}
