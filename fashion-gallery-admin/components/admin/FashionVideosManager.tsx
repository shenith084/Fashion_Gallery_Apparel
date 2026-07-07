'use client';

import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '@/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react';

export type FashionVideo = {
  id: string;
  title: string;
  views: string;
  image: string;
  videoUrl?: string;
};

export default function FashionVideosManager() {
  const [videos, setVideos] = useState<FashionVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New video form state
  const [newTitle, setNewTitle] = useState('');
  const [newViews, setNewViews] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImage, setNewImage] = useState('');
  
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/settings?docId=fashion_videos', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      if (res.ok && data.data?.videos) {
        setVideos(data.data.videos);
      }
    } catch (error) {
      console.error('Error fetching fashion videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVideosList = async (newVideosList: FashionVideo[]) => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ docId: 'fashion_videos', videos: newVideosList })
      });
      if (res.ok) {
        setVideos(newVideosList);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save videos list');
      }
    } catch (error) {
      console.error('Error saving videos list:', error);
      alert('Error saving videos list');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file for the thumbnail');
      return;
    }

    setUploadingImage(true);
    const storageRef = ref(storage, `fashion_videos/thumb_${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Upload failed', error);
        alert('Upload failed.');
        setUploadingImage(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setNewImage(url);
        setUploadingImage(false);
      }
    );
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be under 50MB');
      return;
    }

    setUploadingVideo(true);
    const storageRef = ref(storage, `fashion_videos/vid_${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Upload failed', error);
        alert('Upload failed.');
        setUploadingVideo(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setNewVideoUrl(url);
        setUploadingVideo(false);
      }
    );
  };

  const handleAddVideo = async () => {
    if (!newTitle || !newViews || !newImage) {
      alert('Please provide title, views, and thumbnail image.');
      return;
    }

    const newVideo: FashionVideo = {
      id: `v_${Date.now()}`,
      title: newTitle,
      views: newViews,
      image: newImage,
      videoUrl: newVideoUrl
    };

    const updatedList = [...videos, newVideo];
    await saveVideosList(updatedList);

    // Reset form
    setNewTitle('');
    setNewViews('');
    setNewImage('');
    setNewVideoUrl('');
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to remove this video item?')) return;
    const updatedList = videos.filter(v => v.id !== id);
    await saveVideosList(updatedList);
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const updated = [...videos];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    await saveVideosList(updated);
  };

  const moveDown = async (index: number) => {
    if (index === videos.length - 1) return;
    const updated = [...videos];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    await saveVideosList(updated);
  };

  if (loading) return <div className="p-4">Loading fashion videos...</div>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', maxWidth: '800px', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="text-xl font-bold">Latest Fashion Videos</h2>
        {saveSuccess && <span style={{ color: 'var(--color-success)', fontWeight: 500, fontSize: '0.875rem' }}>✓ Saved Automatically</span>}
      </div>
      
      <p style={{ color: 'var(--color-charcoal-light)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Manage the thumbnails and titles for the "Latest Fashion Videos" section on the storefront. Add items below.
      </p>

      {/* List of current videos */}
      {videos.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {videos.map((video, index) => (
            <div key={video.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', background: '#fafafa', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button onClick={() => moveUp(index)} disabled={index === 0} style={{ opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                <button onClick={() => moveDown(index)} disabled={index === videos.length - 1} style={{ opacity: index === videos.length - 1 ? 0.3 : 1 }}>▼</button>
              </div>

              <div style={{ width: '80px', height: '120px', background: '#eee', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={video.image} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{video.title}</h4>
                <div style={{ color: 'var(--color-charcoal-light)', fontSize: '0.875rem' }}>
                  Views: {video.views}
                  {video.videoUrl && <span style={{ marginLeft: '1rem', color: 'var(--color-success)' }}>✓ Video Attached</span>}
                </div>
              </div>

              <button 
                onClick={() => handleDeleteVideo(video.id)}
                style={{ color: 'var(--color-error)', padding: '0.5rem', borderRadius: '4px', background: 'rgba(162, 59, 59, 0.1)' }}
                title="Remove Item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', border: '1px dashed rgba(0,0,0,0.1)', borderRadius: '8px', marginBottom: '2.5rem', color: 'var(--color-charcoal-light)' }}>
          No fashion videos added yet.
        </div>
      )}

      {/* Add New Form */}
      <div style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', background: 'white' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.125rem' }}>Add New Item</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Title</label>
            <input 
              type="text" 
              placeholder="e.g. Summer Collection"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>View Count (Text)</label>
            <input 
              type="text" 
              placeholder="e.g. 12.5K"
              value={newViews}
              onChange={(e) => setNewViews(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Thumbnail Image</label>
          
          {newImage ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '80px', height: '120px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                <img src={newImage} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button 
                onClick={() => setNewImage('')}
                style={{ padding: '0.5rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ padding: '0.75rem 1.5rem', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={16} />
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Video File (Optional)</label>
          
          {newVideoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'var(--color-success)', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                Video Uploaded Successfully
              </div>
              <button 
                onClick={() => setNewVideoUrl('')}
                style={{ padding: '0.5rem 1rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
              >
                Remove Video
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ padding: '0.75rem 1.5rem', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={16} />
                {uploadingVideo ? 'Uploading...' : 'Upload MP4 Video'}
                <input type="file" accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }} onChange={handleVideoUpload} disabled={uploadingVideo} />
              </label>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-light)' }}>(Max 50MB)</span>
            </div>
          )}
        </div>

        <button 
          onClick={handleAddVideo}
          disabled={saving || uploadingImage || uploadingVideo}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 2rem', background: 'var(--color-burgundy)', color: 'white', 
            border: 'none', borderRadius: '6px', fontWeight: 500, cursor: (saving || uploadingImage || uploadingVideo) ? 'not-allowed' : 'pointer',
            opacity: (saving || uploadingImage || uploadingVideo) ? 0.7 : 1
          }}
        >
          <Plus size={18} />
          {saving ? 'Adding...' : 'Add Item'}
        </button>
      </div>

    </div>
  );
}
