'use client';

import React, { useState } from 'react';
import { Phone, Truck, CreditCard, Share2, Video } from 'lucide-react';

import ContactSettingsManager from '@/components/admin/ContactSettingsManager';
import DeliverySettingsManager from '@/components/admin/DeliverySettingsManager';
import PaymentSettingsManager from '@/components/admin/PaymentSettingsManager';
import SocialLinksManager from '@/components/admin/SocialLinksManager';
import FashionVideosManager from '@/components/admin/FashionVideosManager';
import styles from './settings.module.css';

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
    <div className={styles.container}>
      <h1 className={styles.title}>System Settings</h1>
      <p className={styles.subtitle}>Manage all aspects of your store's configuration.</p>

      <div className={styles.contentWrapper}>
        
        {/* Sidebar Nav */}
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className={styles.mainArea}>
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
