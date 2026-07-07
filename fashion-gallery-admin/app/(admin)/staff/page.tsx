'use client';

import { useEffect, useState } from 'react';
import { useStaffStore } from '@/store/staffStore';
import { StaffMember } from '@/types/staff';
import styles from './Staff.module.css';
import PermissionsModal from './PermissionsModal';
import AddStaffModal from './AddStaffModal';
import { Users, UserCheck, UserX, Shield, Search, MoreVertical, Plus } from 'lucide-react';
import { auth } from '@/lib/firebase/config';

export default function StaffPage() {
  const { staffList, loading, subscribeToStaff } = useStaffStore();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const currentUserUid = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = subscribeToStaff();
    return () => unsubscribe();
  }, [subscribeToStaff]);

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.isActive).length;
  const inactiveStaff = staffList.filter(s => !s.isActive).length;
  const adminCount = staffList.filter(s => {
    const r = s.role?.toLowerCase() || '';
    return r === 'admin' || r === 'super_admin' || r === 'super admin' || s.id === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1';
  }).length;

  const filteredStaff = staffList.filter(staff => {
    const r = staff.role?.toLowerCase() || '';
    const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase()) || 
                          staff.email.toLowerCase().includes(search.toLowerCase());
    
    let isSuperAdmin = r === 'super_admin' || r === 'super admin' || staff.id === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1';
    let isAdmin = r === 'admin';
    let isStaff = !isSuperAdmin && !isAdmin;

    let matchesRole = false;
    if (roleFilter === 'All Roles') matchesRole = true;
    else if (roleFilter === 'Super Admin' && isSuperAdmin) matchesRole = true;
    else if (roleFilter === 'Admin' && isAdmin) matchesRole = true;
    else if (roleFilter === 'Staff' && isStaff) matchesRole = true;

    return matchesSearch && matchesRole;
  });

  const getRoleDisplay = (staff: StaffMember) => {
    const r = staff.role?.toLowerCase() || '';
    if (staff.id === 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1' || r === 'super_admin' || r === 'super admin') {
      return <span className={`${styles.roleBadge} ${styles.roleSuperAdmin}`}>Super Admin</span>;
    }
    if (r === 'admin') {
      return <span className={`${styles.roleBadge} ${styles.roleAdmin}`}>Admin</span>;
    }
    return <span className={`${styles.roleBadge} ${styles.roleStaff}`}>Staff</span>;
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.iconWrapper} ${styles.iconPurple}`}><Users size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Total Staff</span>
              <span className={styles.statValue}>{totalStaff}</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.iconWrapper} ${styles.iconGreen}`}><UserCheck size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Active Staff</span>
              <span className={styles.statValue}>{activeStaff}</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.iconWrapper} ${styles.iconRed}`}><UserX size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Inactive Staff</span>
              <span className={styles.statValue}>{inactiveStaff}</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <div className={`${styles.iconWrapper} ${styles.iconOrange}`}><Shield size={20} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Admins</span>
              <span className={styles.statValue}>{adminCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.roleSelect} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Staff</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        {loading ? (
          <p className={styles.loading}>Loading staff members...</p>
        ) : filteredStaff.length === 0 ? (
          <p className={styles.empty}>No staff members found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STAFF MEMBER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>PHONE</th>
                  <th>JOINED ON</th>
                  <th>LAST ACTIVE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className={styles.nameCell}>
                      <div className={styles.avatar}>
                        {staff.avatar ? <img src={staff.avatar} alt="" /> : staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.nameInfo}>
                        <div className={styles.nameRow}>
                          {staff.name}
                          {currentUserUid === staff.id && <span className={styles.youBadge}>You</span>}
                        </div>
                        <span className={styles.emailText}>{staff.email}</span>
                      </div>
                    </td>
                    <td>{getRoleDisplay(staff)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${staff.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: '#4b5563' }}>{staff.phone || '-'}</td>
                    <td style={{ color: '#4b5563' }}>{staff.createdAt ? formatDate(staff.createdAt) : '-'}</td>
                    <td style={{ color: '#4b5563' }}>
                      {staff.lastLogin ? `Today, ${new Date(staff.lastLogin).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : '-'}
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <MoreVertical size={16} />
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
