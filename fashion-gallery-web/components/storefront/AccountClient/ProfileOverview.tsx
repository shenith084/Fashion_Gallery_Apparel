'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import styles from './ProfileOverview.module.css';

export default function ProfileOverview() {
  const user = useAuthStore(state => state.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`/api/orders?email=${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email]);

  // Compute real stats
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => {
      const amount = typeof o.total === 'number'
        ? o.total
        : parseFloat(String(o.total || '0').replace(/[^0-9.]/g, '')) || 0;
      return sum + amount;
    }, 0);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-LK', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  const recentOrders = orders.slice(0, 3);

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return styles.delivered;
      case 'shipped': return styles.shipped;
      case 'processing': return styles.processing;
      case 'pending': return styles.processing;
      case 'cancelled': return styles.cancelled;
      default: return styles.processing;
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try {
      const d = ts?.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-LK', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return '—'; }
  };

  const formatTotal = (total: any) => {
    if (!total && total !== 0) return '—';
    const num = typeof total === 'number'
      ? total
      : parseFloat(String(total).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return String(total);
    return `LKR ${num.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileMain}>
          <div className={styles.avatarWrap}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || 'Profile'} className={styles.avatarImg} referrerPolicy="no-referrer" />
            ) : (
              <div className={styles.avatarInitial}>
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.profileDetails}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{user?.name || 'My Account'}</h2>
            </div>
            <p className={styles.email}>{user?.email}</p>
            <span className={styles.badge}>
              <CheckCircleIcon /> Verified Customer
            </span>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}><OrderIcon /></div>
            <div>
              <p className={styles.statLabel}>Total Orders</p>
              <p className={styles.statValue}>{loading ? '—' : totalOrders}</p>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><WalletIcon /></div>
            <div>
              <p className={styles.statLabel}>Total Spent</p>
              <p className={styles.statValue}>
                {loading ? '—' : `LKR ${totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
              </p>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><UserBadgeIcon /></div>
            <div>
              <p className={styles.statLabel}>Member Since</p>
              <p className={styles.statValue}>{memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinksRow}>
        <div className={styles.quickLinkItem}>
          <div className={styles.quickIcon}><TruckIcon /></div>
          <div>
            <p className={styles.quickLabel}>Track Orders</p>
            <p className={styles.quickDesc}>View your order status</p>
          </div>
        </div>
        <div className={styles.quickLinkItem}>
          <div className={styles.quickIcon}><HeartIcon /></div>
          <div>
            <p className={styles.quickLabel}>Wishlist</p>
            <p className={styles.quickDesc}>See your favorite items</p>
          </div>
        </div>
        <div className={styles.quickLinkItem}>
          <div className={styles.quickIcon}><MapPinIcon /></div>
          <div>
            <p className={styles.quickLabel}>Addresses</p>
            <p className={styles.quickDesc}>Manage your addresses</p>
          </div>
        </div>
        <div className={styles.quickLinkItem}>
          <div className={styles.quickIcon}><CreditCardIcon /></div>
          <div>
            <p className={styles.quickLabel}>Payment Methods</p>
            <p className={styles.quickDesc}>View saved cards</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={styles.ordersCard}>
        <div className={styles.ordersHeader}>
          <h3 className={styles.ordersTitle}>RECENT ORDERS</h3>
        </div>

        <div className={styles.ordersList}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontSize: 14 }}>
              Loading orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999', fontSize: 14 }}>
              You have no orders yet. Start shopping!
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderProduct}>
                  <div className={styles.orderImageWrap}>
                    {order.items?.[0]?.image || order.items?.[0]?.product?.image ? (
                      <img
                        src={order.items?.[0]?.image || order.items?.[0]?.product?.image}
                        alt="Order item"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#f5ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                        <img src="/logo.svg" style={{ width: '60%', opacity: 0.4 }} alt="" />
                      </div>
                    )}
                  </div>
                  <div className={styles.orderMeta}>
                    <p className={styles.orderId}>
                      Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
                    </p>
                    <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className={styles.orderSummary}>
                  <p className={styles.orderItemsCount}>
                    {order.items?.length || 0} Item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  <p className={styles.orderTotal}>{formatTotal(order.total)}</p>
                </div>
                <div className={styles.orderStatus}>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
function CheckCircleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>; }
function OrderIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function WalletIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>; }
function UserBadgeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function TruckIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function HeartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function MapPinIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CreditCardIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>; }
