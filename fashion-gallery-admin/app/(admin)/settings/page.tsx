'use client';

import React, { useState } from 'react';
import { Phone, Truck, CreditCard, Share2, Video } from 'lucide-react';

import ContactSettingsManager from '@/components/admin/ContactSettingsManager';
import DeliverySettingsManager from '@/components/admin/DeliverySettingsManager';
import PaymentSettingsManager from '@/components/admin/PaymentSettingsManager';
import SocialLinksManager from '@/components/admin/SocialLinksManager';
import FashionVideosManager from '@/components/admin/FashionVideosManager';

type Tab = 'contact' | 'delivery' | 'payment' | 'social' | 'video';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contact');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'contact', label: 'Contact Info', icon: <Phone size={18} /> },
    { id: 'delivery', label: 'Delivery', icon: <Truck size={18} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'social', label: 'Social Links', icon: <Share2 size={18} /> },
    { id: 'video', label: 'Video Gallery', icon: <Video size={18} /> },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold mb-2">System Settings</h1>
      <p className="text-gray-500 mb-8">Manage all aspects of your store's configuration.</p>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Sidebar Nav */}
        <div style={{ 
          width: '240px', 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === tab.id ? '#fdf2f4' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-burgundy)' : '#4b5563',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                className={activeTab !== tab.id ? 'hover:bg-gray-50' : ''}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'contact' && <ContactSettingsManager />}
          {activeTab === 'delivery' && <DeliverySettingsManager />}
          {activeTab === 'payment' && <PaymentSettingsManager />}
          {activeTab === 'social' && <SocialLinksManager />}
          {activeTab === 'video' && <FashionVideosManager />}
        </div>

      </div>
    </div>
  );
}
