'use client';

import { useEffect, useState } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { StaffMember } from '@/types/staff';
import styles from './Staff.module.css';
import PermissionsModal from './PermissionsModal';
import AddStaffModal from './AddStaffModal';

export default function StaffPage() {
  const { staffList, loading, subscribeToStaff, toggleStaffStatus } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToStaff();
    return () => unsubscribe();
  }, [subscribeToStaff]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Staff & Permissions</h1>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add Staff
        </button>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p className={styles.loading}>Loading staff members...</p>
        ) : staffList.length === 0 ? (
          <p className={styles.empty}>No staff members found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id}>
                    <td className={styles.nameCell}>
                      <div className={styles.avatar}>{staff.name.charAt(0).toUpperCase()}</div>
                      {staff.name}
                    </td>
                    <td>{staff.email}</td>
                    <td>
                      <span className={`${styles.badge} ${staff.role === 'admin' ? styles.badgeAdmin : styles.badgeStaff}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${staff.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {staff.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setSelectedStaff(staff)}
                      >
                        Permissions
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${staff.isActive ? styles.textError : styles.textSuccess}`}
                        onClick={() => toggleStaffStatus(staff.id, !staff.isActive)}
                        disabled={staff.role === 'admin'} // Cannot deactivate other admins from here easily, or yourself
                      >
                        {staff.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddStaffModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedStaff && (
        <PermissionsModal 
          staff={selectedStaff} 
          onClose={() => setSelectedStaff(null)} 
        />
      )}
    </div>
  );
}
