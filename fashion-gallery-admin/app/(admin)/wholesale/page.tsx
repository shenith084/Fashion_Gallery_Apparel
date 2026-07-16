'use client';

import React, { useEffect, useState } from 'react';
import { useWholesaleStore, WholesaleApplication } from '@/store/wholesaleStore';
import { db } from '@/lib/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import styles from './Wholesale.module.css';

export default function WholesalePage() {
  const { applications, loading, subscribeToApplications, updateStatus } = useWholesaleStore();
  const [localApps, setLocalApps] = useState<WholesaleApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<WholesaleApplication | null>(null);

  useEffect(() => {
    setLocalApps(applications);
  }, [applications]);

  useEffect(() => {
    subscribeToApplications();
    

  }, [subscribeToApplications]);

  if (loading) {
    return <div className="loading">Loading wholesale applications...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="text-3xl font-bold">Wholesale Applications</h1>
          <p className="text-gray-500 mt-2">Manage wholesale partnership requests</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Business Name</th>
              <th>Contact Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localApps.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>No applications found</td>
              </tr>
            ) : (
              localApps.map(app => (
                <tr key={app.id} className={app.isNew ? styles.newRow : ''}>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className={styles.fontMedium}>
                    {app.businessName}
                    {app.isNew && <span className={styles.newBadge}>New</span>}
                  </td>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td className={styles.capitalize}>{app.businessType}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewBtn}
                      onClick={async () => {
                        setSelectedApp(app);
                        if (app.isNew !== false) {
                          setLocalApps(prev => prev.map(a => a.id === app.id ? { ...a, isNew: false } : a));
                          try {
                            const { auth } = await import('@/lib/firebase/config');
                            if (!auth.currentUser) return;
                            const token = await auth.currentUser.getIdToken();
                            await fetch(`/api/wholesale/${app.id}`, {
                              method: 'PATCH',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ isNew: false })
                            });
                          } catch (e) {
                            console.error('Failed to update isNew status', e);
                          }
                        }
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Application Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.grid2}>
                <div>
                  <strong>Business Name:</strong> {selectedApp.businessName}
                </div>
                <div>
                  <strong>Type:</strong> <span className={styles.capitalize}>{selectedApp.businessType}</span>
                </div>
                <div>
                  <strong>Applicant Name:</strong> {selectedApp.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedApp.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedApp.phone}
                </div>
                <div>
                  <strong>Est. Order Value:</strong> {
                    selectedApp.orderValue === 'under100k' ? 'Under 100k' :
                    selectedApp.orderValue === '100k500k' ? '100k - 500k' : 'Over 500k'
                  }
                </div>
              </div>
              
              <div className={styles.fullWidth}>
                <strong>Interested In:</strong> <span className={styles.capitalize}>{selectedApp.products}</span>
              </div>
              
              <div className={styles.fullWidth}>
                <strong>Address:</strong><br/>
                {selectedApp.address}, {selectedApp.city}, {selectedApp.country.toUpperCase()}
              </div>

              {selectedApp.additionalInfo && (
                <div className={styles.fullWidth}>
                  <strong>Additional Info:</strong><br/>
                  <div className={styles.infoBox}>{selectedApp.additionalInfo}</div>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              <div className={styles.statusGroup}>
                <span className={styles.statusLabel}>Change Status:</span>
                <select 
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value as any).then(() => setSelectedApp(null))}
                  className={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
