'use client';

import AccountSidebar from './AccountSidebar';
import ProfileOverview from './ProfileOverview';
import styles from './AccountClient.module.css';

export default function AccountClient() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <AccountSidebar />
      </div>
      <div className={styles.content}>
        <ProfileOverview />
      </div>
    </div>
  );
}
