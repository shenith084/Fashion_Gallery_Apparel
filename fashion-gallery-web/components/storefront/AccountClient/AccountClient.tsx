'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import AccountSidebar from './AccountSidebar';
import ProfileOverview from './ProfileOverview';
import MyOrders from './MyOrders';
import Wishlist from './Wishlist';
import Addresses from './Addresses';
import PaymentMethods from './PaymentMethods';
import ChangePassword from './ChangePassword';
import styles from './AccountClient.module.css';

const TAB_LABELS: Record<string, string> = {
  overview: 'My Profile',
  orders: 'My Orders',
  wishlist: 'Wishlist',
  addresses: 'Addresses',
  payment: 'Payment Methods',
  password: 'Change Password',
};

export default function AccountClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileView, setMobileView] = useState<'sidebar' | 'content'>('sidebar');
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login?returnUrl=/account');
    }
  }, [user, router]);

  if (!mounted || !user) return (
    <div style={{ padding: '100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#6b2335' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileView('content'); // On mobile: switch to content view
  };

  const handleBack = () => {
    setMobileView('sidebar'); // On mobile: go back to sidebar menu
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar — hidden on mobile when content is shown */}
      <div className={`${styles.sidebar} ${mobileView === 'content' ? styles.sidebarHidden : ''}`}>
        <AccountSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Content — hidden on mobile when sidebar is shown */}
      <div className={`${styles.content} ${mobileView === 'sidebar' ? styles.contentHidden : ''}`}>
        {/* Mobile back button */}
        <button className={styles.backBtn} onClick={handleBack} aria-label="Back to menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          <span>Back</span>
        </button>

        <h2 className={styles.mobileContentTitle}>{TAB_LABELS[activeTab]}</h2>

        {activeTab === 'overview' && <ProfileOverview />}
        {activeTab === 'orders' && <MyOrders />}
        {activeTab === 'wishlist' && <Wishlist />}
        {activeTab === 'addresses' && <Addresses />}
        {activeTab === 'payment' && <PaymentMethods />}
        {activeTab === 'password' && <ChangePassword />}
      </div>
    </div>
  );
}
