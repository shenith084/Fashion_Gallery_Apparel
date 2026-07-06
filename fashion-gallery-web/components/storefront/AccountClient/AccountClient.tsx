'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import AccountSidebar from './AccountSidebar';
import ProfileOverview from './ProfileOverview';
import MyOrders from './MyOrders';
import styles from './AccountClient.module.css';

export default function AccountClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login?returnUrl=/account');
    }
  }, [user, router]);

  if (!mounted || !user) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className={styles.content}>
        {activeTab === 'overview' && <ProfileOverview />}
        {activeTab === 'orders' && <MyOrders />}
      </div>
    </div>
  );
}
