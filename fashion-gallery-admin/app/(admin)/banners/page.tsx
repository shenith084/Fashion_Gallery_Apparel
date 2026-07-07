'use client';

import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '@/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

import { useSettingsStore, ContactSettings } from '@/store/settingsStore';
import FashionVideosManager from '@/components/admin/FashionVideosManager';

export default function StorefrontSettingsPage() {
  // Settings state
  const { contactSettings, loading: settingsLoading, fetchContactSettings, updateContactSettings } = useSettingsStore();
  const [formData, setFormData] = useState<ContactSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  useEffect(() => {
    if (contactSettings) {
      setFormData(contactSettings);
    }
  }, [contactSettings]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateContactSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (settingsLoading || !formData) return <div className="p-8">Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-2">Storefront Settings</h1>
      <p className="text-gray-500 mb-8">Manage the short promotional video and public store contact details.</p>

      <FashionVideosManager />

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px', marginTop: '2rem' }}>
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Store Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Business Hours (Weekdays)</label>
            <input 
              type="text" 
              name="businessHoursMain"
              value={formData.businessHoursMain}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Business Hours (Weekends)</label>
            <input 
              type="text" 
              name="businessHoursWeekend"
              value={formData.businessHoursWeekend}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '1rem' }}
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
              {isSaving ? 'Saving...' : 'Save Contact Info'}
            </button>
            {saveSuccess && (
              <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>✓ Saved Successfully</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
