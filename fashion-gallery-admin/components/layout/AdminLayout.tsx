'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { 
  LayoutDashboard, ShoppingBag, RotateCcw, Box, 
  Layers, Users, Shield, Activity,
  Settings, MessageSquare, Briefcase, X, Menu
} from 'lucide-react';
import { db, auth } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { PermissionsMap } from '@/types/staff';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  permissionKey?: keyof PermissionsMap;
};

type MenuSection = {
  title: string | null;
  items: MenuItem[];
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [newWholesaleCount, setNewWholesaleCount] = useState(0);
  const [newReturnCount, setNewReturnCount] = useState(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [userPermissions, setUserPermissions] = useState<PermissionsMap | null>(null);
  const [userRole, setUserRole] = useState<string>('staff');
  const [userName, setUserName] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) { toast.error('Current password is required'); return; }
    if (!newPassword || newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    const user = auth.currentUser;
    if (!user || !user.email) { toast.error('You must be logged in'); return; }
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('Incorrect current password');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in before changing your password');
      } else {
        toast.error(error.message || 'Failed to update password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fetchUserData = async () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await user.getIdToken(true);
          const userDoc = await getDoc(doc(db, 'staff', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role || 'staff');
            setUserName(data.name || user.displayName || 'Staff');
            setUserPermissions(data.permissions || null);
          } else {
            setUserPermissions(null);
          }
        } catch {
          setUserPermissions(null);
        }
      } else {
        setUserPermissions(null);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    fetchUserData().then(fn => { unsub = fn; });
    return () => { if (unsub) unsub(); };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchCounts = async () => {
      if (!auth.currentUser) return;
      try {
        const isAdmin = userRole === 'admin' || userRole === 'super_admin';
        if (isAdmin || (userPermissions && userPermissions['order.view'])) {
          const ordersSnap = await getDocs(collection(db, 'orders'));
          let oCount = 0; ordersSnap.forEach(d => { if (d.data().isNew) oCount++; });
          setNewOrderCount(oCount);
          const retSnap = await getDocs(collection(db, 'returns'));
          let rCount = 0; retSnap.forEach(d => { if (d.data().isNew) rCount++; });
          setNewReturnCount(rCount);
        }
        if (isAdmin || (userPermissions && userPermissions['wholesale.view'])) {
          const wsSnap = await getDocs(collection(db, 'wholesale_applications'));
          let wCount = 0; wsSnap.forEach(d => { if (d.data().isNew) wCount++; });
          setNewWholesaleCount(wCount);
          const inqSnap = await getDocs(collection(db, 'inquiries'));
          let mCount = 0; inqSnap.forEach(d => { if (d.data().status === 'Unread') mCount++; });
          setUnreadMsgCount(mCount);
        }
      } catch (error: any) {
        if (error.code !== 'permission-denied') console.error('Badge fetch error', error);
      }
    };
    if (userRole && userPermissions !== undefined) {
      fetchCounts();
      interval = setInterval(fetchCounts, 5000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [userRole, userPermissions]);

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
        { name: 'Orders', path: '/orders', icon: <ShoppingBag size={18} />, badge: newOrderCount > 0 ? newOrderCount : undefined, permissionKey: 'order.view' },
        { name: 'Returns', path: '/returns', icon: <RotateCcw size={18} />, badge: newReturnCount > 0 ? newReturnCount : undefined, permissionKey: 'order.view' },
        { name: 'Wholesale', path: '/wholesale', icon: <Briefcase size={18} />, badge: newWholesaleCount > 0 ? newWholesaleCount : undefined, permissionKey: 'wholesale.view' },
      ]
    },
    {
      title: 'CATALOG',
      items: [
        { name: 'Products', path: '/products', icon: <Box size={18} />, permissionKey: 'product.view' },
        { name: 'Stock', path: '/stock', icon: <Layers size={18} />, permissionKey: 'product.view' },
      ]
    },
    {
      title: 'STAFF & PERMISSIONS',
      items: [
        { name: 'Staff Management', path: '/staff', icon: <Users size={18} />, permissionKey: 'staff.manage' },
        { name: 'Roles & Permissions', path: '/roles', icon: <Shield size={18} />, permissionKey: 'staff.manage' },
        { name: 'Activity Logs', path: '/logs', icon: <Activity size={18} />, permissionKey: 'audit_log.view' },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/settings', icon: <Settings size={18} />, permissionKey: 'settings.manage' },
      ]
    }
  ];

  const canSee = (item: MenuItem) => {
    if (userRole === 'super_admin' || userRole === 'admin') return true;
    if (!item.permissionKey) return true;
    if (!userPermissions) return false;
    return !!userPermissions[item.permissionKey];
  };

  return (
    <div className={styles.layout}>

      {/* ── Mobile Overlay ── */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.svg" alt="Fashion Gallery Admin" style={{ height: '44px', width: 'auto' }} />
          </Link>
          <button className={styles.sidebarCloseBtn} onClick={() => setIsSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {MENU_SECTIONS.map((section, idx) => (
            <div key={idx} className={styles.navSection}>
              {section.title && <h4 className={styles.sectionTitle}>{section.title}</h4>}
              {section.items.map((item) => {
                if (!canSee(item)) return null;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    title={item.name}
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

      {/* ── Main Content ── */}
      <div className={styles.main}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <button className={styles.mobileLogoBtn} onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <img src="/logo.svg" alt="Menu" style={{ height: '32px', width: 'auto', display: 'block' }} />
          </button>

          <div className={styles.headerRight}>
            <Link href="/inquiries" className={styles.messagesBtn} style={{ textDecoration: 'none' }}>
              <div className={styles.msgIconWrap}>
                <MessageSquare size={20} />
                {unreadMsgCount > 0 && <span className={styles.msgBadge} />}
              </div>
              <span className={styles.msgText}>Messages</span>
            </Link>

            <div
              className={styles.profileDropdown}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className={styles.avatarWrap}>
                <img
                  width={34}
                  height={34}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName || 'User'}&backgroundColor=6b2335&textColor=ffffff`}
                  alt={userName}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName || 'Loading...'}</span>
                <span className={styles.userRole}>{userRole.replace('_', ' ')}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                  background: 'white', border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: '160px', zIndex: 200, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setShowProfileMenu(false); setShowPasswordModal(true); }}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    🔑 Change Password
                  </button>
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.05)', margin: '0 12px' }} />
                  <button
                    onClick={() => auth.signOut()}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className={styles.bottomNav}>
        <div className={styles.bottomNavInner}>
          <Link href="/" className={`${styles.bottomNavItem} ${pathname === '/' ? styles.active : ''}`}>
            <LayoutDashboard size={22} />
            <span className={styles.bottomNavLabel}>Dashboard</span>
          </Link>
          <Link href="/orders" className={`${styles.bottomNavItem} ${pathname === '/orders' ? styles.active : ''}`}>
            <ShoppingBag size={22} />
            {newOrderCount > 0 && <span className={styles.bottomNavBadge}>{newOrderCount}</span>}
            <span className={styles.bottomNavLabel}>Orders</span>
          </Link>
          <Link href="/products" className={`${styles.bottomNavItem} ${pathname === '/products' ? styles.active : ''}`}>
            <Box size={22} />
            <span className={styles.bottomNavLabel}>Products</span>
          </Link>

          <button
            className={`${styles.bottomNavItem} ${isSidebarOpen ? styles.active : ''}`}
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={22} />
            <span className={styles.bottomNavLabel}>Menu</span>
          </button>
        </div>
      </nav>

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '14px' }} required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', fontSize: '14px' }} minLength={6} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  style={{ flex: 1, padding: '11px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isChangingPassword}
                  style={{ flex: 1, padding: '11px', background: 'var(--color-burgundy, #6b2335)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  {isChangingPassword ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
