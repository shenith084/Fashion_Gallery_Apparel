import Image from 'next/image';
import styles from './LatestFashionVideos.module.css';

import { getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

import FashionVideoCard from './FashionVideoCard';

const FALLBACK_VIDEOS = [
  { id: 'v1', title: 'Summer Collection', views: '12.5K', image: '/prod-floral-maxi.png' },
  { id: 'v2', title: 'Office Wear Looks', views: '9.0K', image: '/prod-wrap-midi.png' },
  { id: 'v3', title: 'New Arrivals', views: '15.3K', image: '/prod-printed-long.png' },
  { id: 'v4', title: 'Customer Try-On', views: '8.2K', image: '/prod-vneck.png' },
  { id: 'v5', title: 'Styling Ideas', views: '11.6K', image: '/prod-shirt.png' },
  { id: 'v6', title: 'Weekend Outfits', views: '7.6K', image: '/prod-office.png' },
];

export default async function LatestFashionVideos() {
  let videos = FALLBACK_VIDEOS;
  
  try {
    const docRef = doc(db, 'settings', 'fashion_videos');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().videos) {
      videos = docSnap.data().videos;
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
          <a
            href="https://facebook.com/mymoonclothing"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.facebookBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
            </svg>
            FOLLOW US ON FACEBOOK
          </a>
        </div>

        <div className={styles.grid}>
          {videos.map((video: any) => (
            <FashionVideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
