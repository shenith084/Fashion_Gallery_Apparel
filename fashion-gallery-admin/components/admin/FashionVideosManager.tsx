'use client';

import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '@/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export type FashionVideo = {
  id: string;
  title: string;
  videoUrl: string;
};

export default function FashionVideosManager() {
  const [videos, setVideos] = useState<FashionVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

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
        toast.error('Failed to save videos list');
      }
    } catch (error) {
      console.error('Error saving videos list:', error);
      toast.error('Error saving videos list');
    } finally {
      setSaving(false);
    }
  };



  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file (MP4)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be under 50MB');
      return;
    }

    setUploadingVideo(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('files', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          if (data.urls && data.urls[0]) {
            setNewVideoUrl(data.urls[0]);
          } else {
            console.error('No URL returned');
            toast.error('Upload failed: No URL returned');
          }
        } else {
          console.error('Upload failed', xhr.responseText);
          toast.error('Upload failed. Server returned ' + xhr.status);
        }
        setUploadingVideo(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        console.error('Upload failed');
        toast.error('Upload failed. Please try again.');
        setUploadingVideo(false);
        setUploadProgress(0);
      };

      xhr.send(formData);

    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Upload failed. Note: Node.js max body size limits might apply if the file is too large.');
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleAddVideo = async () => {
    if (!newTitle || !newVideoUrl) {
      toast.error('Please provide title and upload a video file.');
      return;
    }

    const newVideo: FashionVideo = {
      id: `v_${Date.now()}`,
      title: newTitle,
      videoUrl: newVideoUrl
    };

    const updatedList = [...videos, newVideo];
    await saveVideosList(updatedList);

    // Reset form
    setNewTitle('');
    setNewVideoUrl('');
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    const updatedList = videos.filter(v => v.id !== videoToDelete);
    await saveVideosList(updatedList);
    setVideoToDelete(null);
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

              <div style={{ width: '120px', height: '80px', background: '#eee', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                <video src={video.videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} preload="metadata" />
              </div>

              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{video.title}</h4>
                <div style={{ color: 'var(--color-charcoal-light)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-success)' }}>✓ Video Uploaded</span>
                </div>
              </div>

              <button 
                onClick={() => setVideoToDelete(video.id)}
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
        </div>



        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Video File (Optional)</label>
          
          {newVideoUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f5f5f5', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}>
              <span style={{ color: 'var(--color-success)', fontWeight: 500, fontSize: '0.875rem' }}>✓ Video ready</span>
              <button 
                onClick={() => setNewVideoUrl('')}
                style={{ padding: '0.25rem 0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', fontSize: '0.75rem', background: 'white' }}
              >
                Remove
              </button>
            </div>
          ) : (
            <label style={{ padding: '0.75rem 1.5rem', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
              <Plus size={16} />
              {uploadingVideo ? `Uploading... ${uploadProgress}%` : 'Upload Video'}
              <input type="file" accept="video/mp4,video/quicktime" style={{ display: 'none' }} onChange={handleVideoUpload} disabled={uploadingVideo} />
            </label>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-light)' }}>(Max 50MB)</span>
        </div>

        <button 
          onClick={handleAddVideo}
          disabled={saving || uploadingVideo}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 2rem', background: 'var(--color-burgundy)', color: 'white', 
            border: 'none', borderRadius: '6px', fontWeight: 500, cursor: (saving || uploadingVideo) ? 'not-allowed' : 'pointer',
            opacity: (saving || uploadingVideo) ? 0.7 : 1
          }}
        >
          <Plus size={18} />
          {saving ? 'Adding...' : 'Add Item'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
              Confirm Deletion
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-charcoal-light)' }}>
              Are you sure you want to remove this video item? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setVideoToDelete(null)}
                style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteVideo}
                style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: 'var(--color-error)', color: 'white', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
