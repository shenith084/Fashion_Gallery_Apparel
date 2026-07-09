'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { 
  LayoutDashboard, ShoppingBag, RotateCcw, Box, 
  Layers, Users, Shield, Activity, Image as ImageIcon, 
  Link as LinkIcon, Settings, Search, MessageSquare,
  Moon, Briefcase
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (!auth.currentUser || !auth.currentUser.email) {
      toast.error('You must be logged in');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Password update error', error);
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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await user.getIdToken(true);
          const userDoc = await getDoc(doc(db, 'staff', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role || 'staff');
            setUserName(data.name || user.displayName || 'Staff');
            if (data.permissions) {
              setUserPermissions(data.permissions);
            } else {
              setUserPermissions(null);
            }
          } else {
            setUserPermissions(null); // fallback for users without doc
          }
        } catch (error) {
          console.error('Failed to fetch user permissions', error);
          setUserPermissions(null);
        }
      } else {
        setUserPermissions(null);
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchNewOrderCount = async () => {
      if (!auth.currentUser) return; 
      try {
        const role = userRole;
        const perms = userPermissions;
        const isAdmin = role === 'admin' || role === 'super_admin';

        if (isAdmin || (perms && perms['order.view'])) {
          const querySnapshot = await getDocs(collection(db, 'orders'));
          let orderCount = 0;
          querySnapshot.forEach((doc) => {
            if (doc.data().isNew) orderCount++;
          });
          setNewOrderCount(orderCount);

          const returnSnapshot = await getDocs(collection(db, 'returns'));
          let returnCount = 0;
          returnSnapshot.forEach((doc) => {
            if (doc.data().isNew) returnCount++;
          });
          setNewReturnCount(returnCount);
        }

        if (isAdmin || (perms && perms['wholesale.view'])) {
          const wholesaleSnapshot = await getDocs(collection(db, 'wholesale_applications'));
          let wholesaleCount = 0;
          wholesaleSnapshot.forEach((doc) => {
            if (doc.data().isNew) wholesaleCount++;
          });
          setNewWholesaleCount(wholesaleCount);

          const inquiriesSnapshot = await getDocs(collection(db, 'inquiries'));
          let msgCount = 0;
          inquiriesSnapshot.forEach((doc) => {
            if (doc.data().status === 'Unread') msgCount++;
          });
          setUnreadMsgCount(msgCount);
        }
      } catch (error: any) {
        if (error.code !== 'permission-denied') {
          console.error('Failed to fetch counts for badges', error);
        }
      }
    };
    
    if (userRole && userPermissions !== undefined) {
      fetchNewOrderCount();
      interval = setInterval(fetchNewOrderCount, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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
            <img src="/logo.svg" alt="My Moon Clothing" style={{ height: '48px', width: 'auto', borderRadius: '4px' }} />
          </Link>
        </div>
        
        <nav className={styles.nav}>
          {MENU_SECTIONS.map((section, idx) => (
            <div key={idx} className={styles.navSection}>
              {section.title && <h4 className={styles.sectionTitle}>{section.title}</h4>}
              {section.items.map((item) => {
                // Check if user has permission
                if (userRole !== 'super_admin' && item.permissionKey && userPermissions && !userPermissions[item.permissionKey]) {
                  return null;
                }
                
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
          
          <div style={{ flex: 1 }}></div>

          <div className={styles.headerRight}>
            <Link href="/inquiries" className={styles.messagesBtn} style={{ textDecoration: 'none' }}>
              <div className={styles.msgIconWrap}>
                <MessageSquare size={20} />
                {unreadMsgCount > 0 && <span className={styles.msgBadge}></span>}
              </div>
              <span className={styles.msgText}>Messages</span>
            </Link>

            <div 
              className={styles.profileDropdown} 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <div className={styles.avatarWrap}>
                <img width={36} height={36} src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName || 'User'}&backgroundColor=222222&textColor=ffffff`} alt={userName} className={styles.avatar} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName || 'Loading...'}</span>
                <span className={styles.userRole}>{userRole.replace('_', ' ')}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  minWidth: '150px',
                  zIndex: 50
                }}>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => auth.signOut()}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      fontSize: '0.875rem'
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {showPasswordModal && (
        <div className={styles.overlay} style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                  minLength={6}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)} 
                  style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isChangingPassword}
                  style={{ padding: '8px 16px', background: 'var(--color-burgundy)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
