import Image from 'next/image';
import styles from './LatestFashionVideos.module.css';

import { getAdminDb } from '@/lib/firebase/admin';

import FashionVideoGalleryClient from './FashionVideoGalleryClient';

const FALLBACK_VIDEOS: any[] = [];

export default async function LatestFashionVideos() {
  let videos = FALLBACK_VIDEOS;
  let social = { facebookUrl: 'https://www.facebook.com/share/1DQucw4RmB/?mibextid=wwXIfr' };
  
  try {
    const adminDb = getAdminDb();
    const [videosSnap, socialSnap] = await Promise.all([
      adminDb.collection('settings').doc('fashion_videos').get(),
      adminDb.collection('settings').doc('social').get()
    ]);
    
    if (videosSnap.exists && videosSnap.data()?.videos) {
      videos = videosSnap.data()?.videos;
    }
    if (socialSnap.exists) {
      social = { ...social, ...socialSnap.data() } as any;
    }
  } catch (error) {
    console.error('Failed to fetch fashion videos (using fallback):', error);
  }

  return (
    <section className={styles.section} id="latest-videos">
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>LATEST FASHION VIDEOS</h2>
            <p className={styles.subtitle}>Watch our latest styles, behind the scenes and happy moments with our customers.</p>
          </div>
          {social.facebookUrl && (
            <a 
              href={social.facebookUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.facebookBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
              </svg>
              FOLLOW US ON FACEBOOK
            </a>
          )}
        </div>

        <FashionVideoGalleryClient videos={videos} />
      </div>
    </section>
  );
}
