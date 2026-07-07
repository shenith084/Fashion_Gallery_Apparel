'use client';

import React, { useState } from 'react';
import styles from './AccountTabs.module.css';

export default function Notifications() {
  const [prefs, setPrefs] = useState({
    orderUpdatesEmail: true,
    orderUpdatesSms: false,
    promotions: true,
    newsletter: true
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.tabContainer} style={{ maxWidth: '700px' }}>
      <h2 className={styles.title}>Notification Preferences</h2>
      <p className={styles.subtitle}>Choose what updates you want to receive from us.</p>

      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-charcoal)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>Order Updates</h3>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>Email Notifications</h4>
            <p>Receive order confirmations and shipping updates via email.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={prefs.orderUpdatesEmail} onChange={() => togglePref('orderUpdatesEmail')} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>SMS Notifications</h4>
            <p>Receive text messages when your order is out for delivery.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={prefs.orderUpdatesSms} onChange={() => togglePref('orderUpdatesSms')} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-charcoal)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>Marketing & Promos</h3>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>Promotions & Offers</h4>
            <p>Get notified about exclusive sales and special discounts.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={prefs.promotions} onChange={() => togglePref('promotions')} />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>Weekly Newsletter</h4>
            <p>Stay up to date with our newest arrivals and fashion tips.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={prefs.newsletter} onChange={() => togglePref('newsletter')} />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.submitRow}>
        <button className="btn btn-primary">Save Preferences</button>
      </div>
    </div>
  );
}
