'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

type DeliverySettings = {
  standardDeliveryCharge: number;
  freeDeliveryThreshold: number;
  deliveryAreas: string;
};

const DEFAULT_DELIVERY: DeliverySettings = {
  standardDeliveryCharge: 400,
  freeDeliveryThreshold: 10000,
  deliveryAreas: 'Island-wide delivery available'
};

export default function DeliverySettingsManager() {
  const [formData, setFormData] = useState<DeliverySettings>(DEFAULT_DELIVERY);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);

  const fetchDeliverySettings = async (token: string) => {
    try {
      const res = await fetch('/api/settings?docId=delivery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setFormData({ ...DEFAULT_DELIVERY, ...data.data });
        }
      }
    } catch (error) {
      console.error('Failed to fetch delivery settings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        fetchDeliverySettings(token);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'deliveryAreas' ? value : Number(value) 
    }));
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
          docId: 'delivery',
          ...formData
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save error', error);
      toast.error('Failed to save delivery settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
      <h2 className="text-xl font-bold mb-4">Delivery Settings</h2>
      <p className="text-gray-500 mb-6">Manage shipping rates and delivery areas.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Standard Delivery Charge (LKR)</label>
          <input 
            type="number" 
            name="standardDeliveryCharge"
            value={formData.standardDeliveryCharge}
            onChange={handleChange}
            required
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Delivery Areas / Notes</label>
          <textarea 
            name="deliveryAreas"
            value={formData.deliveryAreas}
            onChange={handleChange}
            rows={4}
            required
            style={{ padding: '0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical' }}
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
            {isSaving ? 'Saving...' : 'Save Delivery Settings'}
          </button>
          {saveSuccess && (
            <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>✓ Saved Successfully</span>
          )}
        </div>
      </form>
    </div>
  );
}
