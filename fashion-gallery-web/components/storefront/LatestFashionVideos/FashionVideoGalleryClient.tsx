'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './LatestFashionVideos.module.css';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function FashionVideoGalleryClient({ videos }: { videos: any[] }) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlayingIndex(null);
      if (e.key === 'ArrowRight' && playingIndex !== null) handleNext();
      if (e.key === 'ArrowLeft' && playingIndex !== null) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingIndex]);

  const handleNext = () => {
    if (playingIndex !== null && playingIndex < videos.length - 1) {
      setPlayingIndex(playingIndex + 1);
    }
  };

  const handlePrev = () => {
    if (playingIndex !== null && playingIndex > 0) {
      setPlayingIndex(playingIndex - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (!videos || videos.length === 0) return null;

  return (
    <>
      <div className={styles.sliderContainer}>
        <button 
          className={`${styles.navBtn} ${styles.prevBtn}`} 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.grid} ref={scrollRef}>
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className={styles.card} 
            onClick={() => video.videoUrl && setPlayingIndex(index)} 
            style={{ cursor: video.videoUrl ? 'pointer' : 'default' }}
          >
            <div className={styles.imageWrap}>
              {video.videoUrl && (
                <video 
                  src={video.videoUrl}
                  preload="metadata"
                  className={styles.image}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              )}
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
              </div>
            </div>
          </div>
        ))}
        </div>

        <button 
          className={`${styles.navBtn} ${styles.nextBtn}`} 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {playingIndex !== null && videos[playingIndex]?.videoUrl && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setPlayingIndex(null)}
        >
          {/* Top Bar with Title and Close */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', zIndex: 20 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
              {videos[playingIndex].title}
            </h2>
            <button 
              onClick={() => setPlayingIndex(null)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
            
            {/* Prev Button */}
            {playingIndex > 0 && (
              <button 
                onClick={handlePrev}
                style={{ position: 'absolute', left: '-60px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', zIndex: 10 }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronLeft size={32} />
              </button>
            )}

            <video 
              key={videos[playingIndex].id} // force re-mount when video changes
              src={videos[playingIndex].videoUrl} 
              controls 
              autoPlay 
              style={{ width: '100%', maxHeight: '85vh', borderRadius: '8px', background: 'black', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
              onEnded={handleNext}
            />

            {/* Next Button */}
            {playingIndex < videos.length - 1 && (
              <button 
                onClick={handleNext}
                style={{ position: 'absolute', right: '-60px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', zIndex: 10 }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
