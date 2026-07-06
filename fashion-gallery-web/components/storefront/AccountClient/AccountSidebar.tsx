'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './AccountSidebar.module.css';

const MENU_ITEMS = [
  { id: 'overview', label: 'Profile Overview', icon: <UserIcon /> },
  { id: 'orders', label: 'My Orders', icon: <PackageIcon /> },
  { id: 'wishlist', label: 'Wishlist', icon: <HeartIcon /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPinIcon /> },
  { id: 'payment', label: 'Payment Methods', icon: <CreditCardIcon /> },
  { id: 'password', label: 'Change Password', icon: <LockIcon /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { id: 'logout', label: 'Logout', icon: <LogOutIcon /> },
];

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const logout = useAuthStore(state => state.logout);

  const handleMenuClick = (id: string) => {
    if (id === 'logout') {
      logout();
    } else {
      onTabChange(id);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.navCard}>
        <h3 className={styles.navTitle}>MY ACCOUNT</h3>
        <nav className={styles.nav}>
          {MENU_ITEMS.map((item) => (
            <button 
              key={item.id} 
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className={styles.iconWrap}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.helpCard}>
        <div className={styles.helpIcon}>
          <HeadphonesIcon />
        </div>
        <h4 className={styles.helpTitle}>NEED HELP?</h4>
        <p className={styles.helpDesc}>We&apos;re here to help you anytime you need.</p>
        <button className={`btn btn-primary ${styles.supportBtn}`}>CONTACT SUPPORT</button>
      </div>
    </aside>
  );
}

// Icons
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
function HeadphonesIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  );
}
