'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Megaphone, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export type PromoBannerData = {
  enabled: boolean;
  tag: string;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
};

const DEFAULT: PromoBannerData = {
  enabled: true,
  tag: 'Limited Time Offer',
  title: 'Summer Sale',
  subtitle: "Up to 40% Off on selected dresses — shop our finest collection before it sells out.",
  primaryBtnText: 'Shop Now',
  primaryBtnLink: '/dresses',
  secondaryBtnText: 'New Arrivals',
  secondaryBtnLink: '/new-arrivals',
};

export default function PromoBannerManager() {
  const [data, setData] = useState<PromoBannerData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'promo_banner'));
        if (snap.exists()) {
          setData({ ...DEFAULT, ...snap.data() as PromoBannerData });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) { toast.error('Not authenticated'); return; }
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'promo_banner'), data);
      toast.success('Promo banner saved!');
    } catch (e) {
      toast.error('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: '#888' }}>Loading banner settings...</div>;

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '2rem',
    maxWidth: 800,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    color: '#2b2b2b',
    outline: 'none',
    marginBottom: 20,
    fontFamily: 'inherit',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Megaphone size={22} color="#6b2335" />
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2b2b2b', margin: 0 }}>Promo Banner</h2>
            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Edit the homepage promotional banner content</p>
          </div>
        </div>

        {/* Toggle Enabled */}
        <button
          onClick={() => setData(prev => ({ ...prev, enabled: !prev.enabled }))}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
            fontSize: 13, border: 'none',
            background: data.enabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: data.enabled ? '#16a34a' : '#dc2626',
          }}
        >
          {data.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
          {data.enabled ? 'Banner Visible' : 'Banner Hidden'}
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: 24 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Tag Label</label>
          <input style={inputStyle} name="tag" value={data.tag} onChange={handleChange} placeholder="e.g. Limited Time Offer" />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Main Title</label>
          <input style={inputStyle} name="title" value={data.title} onChange={handleChange} placeholder="e.g. Summer Sale" />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Subtitle / Description</label>
          <textarea
            name="subtitle"
            value={data.subtitle}
            onChange={handleChange}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            placeholder="e.g. Up to 40% Off on selected dresses..."
          />
        </div>

        <div>
          <label style={labelStyle}>Primary Button Text</label>
          <input style={inputStyle} name="primaryBtnText" value={data.primaryBtnText} onChange={handleChange} placeholder="Shop Now" />
        </div>

        <div>
          <label style={labelStyle}>Primary Button Link</label>
          <input style={inputStyle} name="primaryBtnLink" value={data.primaryBtnLink} onChange={handleChange} placeholder="/dresses" />
        </div>

        <div>
          <label style={labelStyle}>Secondary Button Text</label>
          <input style={inputStyle} name="secondaryBtnText" value={data.secondaryBtnText} onChange={handleChange} placeholder="New Arrivals" />
        </div>

        <div>
          <label style={labelStyle}>Secondary Button Link</label>
          <input style={inputStyle} name="secondaryBtnLink" value={data.secondaryBtnLink} onChange={handleChange} placeholder="/new-arrivals" />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', background: '#6b2335', color: 'white',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontWeight: 700, fontSize: 14, letterSpacing: '0.04em',
          opacity: saving ? 0.7 : 1, marginTop: 8,
        }}
      >
        <Save size={16} />
        {saving ? 'Saving...' : 'Save Banner'}
      </button>
    </div>
  );
}
