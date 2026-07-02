'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Orders', path: '/orders', icon: '📦' },
  { name: 'Products', path: '/products', icon: '👗' },
  { name: 'Staff & Permissions', path: '/staff', icon: '👥' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
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
            Fashion Gallery<br/><span>Admin Panel</span>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button 
            className={styles.menuBtn}
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <div className={styles.headerRight}>
            <span className={styles.userName}>Admin User</span>
            <button 
              className={styles.logoutBtn}
              onClick={() => {
                import('firebase/auth').then(({ signOut }) => {
                  import('@/lib/firebase/config').then(({ auth }) => {
                    signOut(auth);
                  });
                });
              }}
            >
              Logout
            </button>
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
