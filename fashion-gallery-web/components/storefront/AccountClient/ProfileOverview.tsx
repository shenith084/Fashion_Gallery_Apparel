'use client';

import Image from 'next/image';
import styles from './ProfileOverview.module.css';

export default function ProfileOverview() {
  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileMain}>
          <div className={styles.avatarWrap}>
            <Image 
              src="/prod-floral-maxi.png" 
              alt="Nethmi Perera" 
              fill 
              className={styles.avatar} 
            />
          </div>
          <div className={styles.profileDetails}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>Nethmi Perera</h2>
              <button className={styles.editBtn}>
                <EditIcon /> EDIT PROFILE
              </button>
            </div>
            <p className={styles.email}>nethmiperera@gmail.com</p>
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
              <p className={styles.statValue}>12</p>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><WalletIcon /></div>
            <div>
              <p className={styles.statLabel}>Total Spent</p>
              <p className={styles.statValue}>LKR 48,750.00</p>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><UserBadgeIcon /></div>
            <div>
              <p className={styles.statLabel}>Member Since</p>
              <p className={styles.statValue}>May 15, 2024</p>
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
          <button className={styles.viewAllBtn}>View All Orders</button>
        </div>
        
        <div className={styles.ordersList}>
          {/* Order 1 */}
          <div className={styles.orderItem}>
            <div className={styles.orderProduct}>
              <div className={styles.orderImageWrap}>
                <Image src="/prod-floral-maxi.png" alt="Order Image" fill sizes="60px" className={styles.orderImage} />
              </div>
              <div className={styles.orderMeta}>
                <p className={styles.orderId}>Order #MM1256</p>
                <p className={styles.orderDate}>May 30, 2024</p>
              </div>
            </div>
            <div className={styles.orderSummary}>
              <p className={styles.orderItemsCount}>3 Items</p>
              <p className={styles.orderTotal}>LKR 12,450.00</p>
            </div>
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${styles.delivered}`}>Delivered</span>
            </div>
            <div className={styles.orderAction}>
              <button className={styles.detailsBtn}>VIEW DETAILS</button>
            </div>
          </div>

          {/* Order 2 */}
          <div className={styles.orderItem}>
            <div className={styles.orderProduct}>
              <div className={styles.orderImageWrap}>
                <Image src="/prod-wrap-midi.png" alt="Order Image" fill sizes="60px" className={styles.orderImage} />
              </div>
              <div className={styles.orderMeta}>
                <p className={styles.orderId}>Order #MM1255</p>
                <p className={styles.orderDate}>May 25, 2024</p>
              </div>
            </div>
            <div className={styles.orderSummary}>
              <p className={styles.orderItemsCount}>2 Items</p>
              <p className={styles.orderTotal}>LKR 7,980.00</p>
            </div>
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${styles.delivered}`}>Delivered</span>
            </div>
            <div className={styles.orderAction}>
              <button className={styles.detailsBtn}>VIEW DETAILS</button>
            </div>
          </div>

          {/* Order 3 */}
          <div className={styles.orderItem}>
            <div className={styles.orderProduct}>
              <div className={styles.orderImageWrap}>
                <Image src="/prod-printed-long.png" alt="Order Image" fill sizes="60px" className={styles.orderImage} />
              </div>
              <div className={styles.orderMeta}>
                <p className={styles.orderId}>Order #MM1254</p>
                <p className={styles.orderDate}>May 18, 2024</p>
              </div>
            </div>
            <div className={styles.orderSummary}>
              <p className={styles.orderItemsCount}>1 Item</p>
              <p className={styles.orderTotal}>LKR 4,790.00</p>
            </div>
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${styles.shipped}`}>Shipped</span>
            </div>
            <div className={styles.orderAction}>
              <button className={styles.detailsBtn}>VIEW DETAILS</button>
            </div>
          </div>

          {/* Order 4 */}
          <div className={styles.orderItem}>
            <div className={styles.orderProduct}>
              <div className={styles.orderImageWrap}>
                <Image src="/prod-floral-maxi.png" alt="Order Image" fill sizes="60px" className={styles.orderImage} />
              </div>
              <div className={styles.orderMeta}>
                <p className={styles.orderId}>Order #MM1253</p>
                <p className={styles.orderDate}>May 10, 2024</p>
              </div>
            </div>
            <div className={styles.orderSummary}>
              <p className={styles.orderItemsCount}>2 Items</p>
              <p className={styles.orderTotal}>LKR 6,350.00</p>
            </div>
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${styles.processing}`}>Processing</span>
            </div>
            <div className={styles.orderAction}>
              <button className={styles.detailsBtn}>VIEW DETAILS</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// Icons
function EditIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function CheckCircleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>; }
function OrderIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function WalletIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>; }
function UserBadgeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function TruckIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>; }
function HeartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function MapPinIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function CreditCardIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>; }
