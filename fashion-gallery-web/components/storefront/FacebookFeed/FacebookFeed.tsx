import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from './FacebookFeed.module.css';
import { getAdminDb } from '@/lib/firebase/admin';

const FB_POSTS = [
  { id: 'post-1', image: '/prod-floral-maxi.png', views: '12.5K', isVideo: true },
  { id: 'post-2', image: '/prod-wrap-midi.png', views: '9.8K', isVideo: true },
  { id: 'post-3', image: '/prod-printed-long.png', views: '15.3K', isVideo: true },
  { id: 'post-4', image: '/prod-vneck.png', views: '8.2K', isVideo: true },
  { id: 'post-5', image: '/prod-shirt.png', views: '11.6K', isVideo: true },
  { id: 'post-6', image: '/prod-office.png', views: '7.9K', isVideo: false },
];

export default async function FacebookFeed() {
  let social = { facebookUrl: 'https://www.facebook.com/FashionGalleryApparel' };
  
  try {
    const adminDb = getAdminDb();
    const docSnap = await adminDb.collection('settings').doc('social').get();
    if (docSnap.exists) {
      social = { ...social, ...docSnap.data() } as any;
    }
  } catch (error) {
    console.error('Failed to fetch social links:', error);
  }

  return (
    <section className={styles.section} id="facebook-feed">
      <div className="container">
        <div className={styles.inner}>
          {/* Left Panel */}
          <div className={styles.leftPanel}>
            <div className={styles.fbIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h2 className={styles.leftTitle}>Follow Us On Facebook</h2>
            <p className={styles.leftDesc}>
              Watch our latest styles, behind the scenes and happy moments with our customers.
            </p>
            <a
              href={social.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary ${styles.fbBtn}`}
              id="btn-follow-facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow Our Page
            </a>
          </div>

          {/* Right Grid */}
          <div className={styles.feedGrid}>
            {FB_POSTS.map((post) => (
              <a
                key={post.id}
                href={social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.feedItem}
                id={`fb-post-${post.id}`}
              >
                <Image
                  src={post.image}
                  alt="Fashion Gallery Apparel Facebook Post"
                  fill
                  sizes="(max-width: 768px) 33vw, 12vw"
                  className={styles.feedImage}
                />
                <div className={styles.feedOverlay}>
                  {post.isVideo && (
                    <svg className={styles.playIcon} width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M5 3l14 9-14 9V3z"/>
                    </svg>
                  )}
                </div>
              </a>
            ))}

            {/* Arrow navigation decorative */}
            <div className={styles.navArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
