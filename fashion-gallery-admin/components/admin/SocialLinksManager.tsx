'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

type SocialLinks = {
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  youtubeUrl: string;
};

const DEFAULT_LINKS: SocialLinks = {
  facebookUrl: 'https://www.facebook.com/FashionGalleryApparel',
  instagramUrl: 'https://www.instagram.com/fashiongalleryapparel',
  tiktokUrl: 'https://www.tiktok.com/@fashiongalleryapparel',
  whatsappUrl: '',
  youtubeUrl: '',
};

export default function SocialLinksManager() {
  const [formData, setFormData] = useState<SocialLinks>(DEFAULT_LINKS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        fetchSocialLinks(token);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSocialLinks = async (token: string) => {
    try {
      const res = await fetch('/api/settings?docId=social', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...DEFAULT_LINKS, ...data });
      }
    } catch (error) {
      console.error('Failed to fetch social links', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          docId: 'social',
          data: formData
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error', error);
      toast.error('Failed to save social links.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px', marginTop: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Social Media URLs</h2>
      <p className="text-gray-500 mb-6">Manage the social media URLs used across the storefront.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Facebook URL</label>
          <input 
            type="url" 
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Instagram URL</label>
          <input 
            type="url" 
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>TikTok URL</label>
          <input 
            type="url" 
            name="tiktokUrl"
            value={formData.tiktokUrl}
            onChange={handleChange}
            placeholder="https://tiktok.com/@..."
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>YouTube URL</label>
          <input 
            type="url" 
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={isSaving}
            style={{ 
              padding: '0.75rem 2rem', 
              background: 'var(--color-burgundy)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 500,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Social Links'}
          </button>
          {saveSuccess && (
            <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>✓ Saved Successfully</span>
          )}
        </div>
      </form>
    </div>
  );
}
