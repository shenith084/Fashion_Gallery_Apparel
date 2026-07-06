'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { 
  LayoutDashboard, ShoppingBag, RotateCcw, Box, 
  Layers, Users, Shield, Activity, Image as ImageIcon, 
  Link as LinkIcon, Settings, Search, MessageSquare,
  Moon
} from 'lucide-react';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
};

type MenuSection = {
  title: string | null;
  items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    title: null,
    items: [
      { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    ]
  },
  {
    title: 'SALES & ORDERS',
    items: [
      { name: 'Orders', path: '/orders', icon: <ShoppingBag size={18} />, badge: 12 },
      { name: 'Returns', path: '/returns', icon: <RotateCcw size={18} /> },
    ]
  },
  {
    title: 'CATALOG',
    items: [
      { name: 'Products', path: '/products', icon: <Box size={18} /> },
      { name: 'Stock', path: '/stock', icon: <Layers size={18} /> },
    ]
  },
  {
    title: 'STAFF & PERMISSIONS',
    items: [
      { name: 'Staff Management', path: '/staff', icon: <Users size={18} /> },
      { name: 'Roles & Permissions', path: '/roles', icon: <Shield size={18} /> },
      { name: 'Activity Logs', path: '/logs', icon: <Activity size={18} /> },
    ]
  },
  {
    title: 'MARKETING',
    items: [
      { name: 'Banners', path: '/banners', icon: <ImageIcon size={18} /> },
      { name: 'Social Links', path: '/social', icon: <LinkIcon size={18} /> },
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <Moon className={styles.logoIcon} fill="currentColor" stroke="none" size={28} />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>MY MOON</span>
              <span className={styles.logoSub}>CLOTHING</span>
            </div>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          {MENU_SECTIONS.map((section, idx) => (
            <div key={idx} className={styles.navSection}>
              {section.title && <h4 className={styles.sectionTitle}>{section.title}</h4>}
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.navName}>{item.name}</span>
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>☰</button>
          
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input type="text" placeholder="Search anything..." />
            <span className={styles.shortcut}>⌘K</span>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.messagesBtn}>
              <div className={styles.msgIconWrap}>
                <MessageSquare size={20} />
                <span className={styles.msgBadge}>5</span>
              </div>
              <span className={styles.msgText}>Messages</span>
            </button>

            <div className={styles.profileDropdown}>
              <div className={styles.avatarWrap}>
                <img width={36} height={36} src="https://api.dicebear.com/7.x/initials/svg?seed=Senith+Chanidu&backgroundColor=222222&textColor=ffffff" alt="Senith" className={styles.avatar} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Senith Chanidu</span>
                <span className={styles.userRole}>Admin</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
