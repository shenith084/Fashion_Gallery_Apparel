'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './LatestFashionVideos.module.css';

export default function FashionVideoCard({ video }: { video: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className={styles.card} onClick={() => video.videoUrl && setIsPlaying(true)} style={{ cursor: video.videoUrl ? 'pointer' : 'default' }}>
        <div className={styles.imageWrap}>
          <Image
            src={video.image}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 50vw, 16vw"
            className={styles.image}
          />
          <div className={styles.overlay} />
          
          {/* Play Button */}
          {video.videoUrl ? (
            <div className={styles.playIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          ) : (
            <div className={styles.playIcon} style={{ background: 'rgba(0,0,0,0.5)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          <div className={styles.content}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            <div className={styles.views}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {video.views} views
            </div>
          </div>
        </div>
      </div>

      {isPlaying && video.videoUrl && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setIsPlaying(false)}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsPlaying(false)}
              style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <video 
              src={video.videoUrl} 
              controls 
              autoPlay 
              style={{ width: '100%', maxHeight: '80vh', borderRadius: '8px', background: 'black', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
