'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Search, Activity, AlertTriangle, Users, FileWarning } from 'lucide-react';
import LogsTable from '@/components/admin/logs/LogsTable';
import LogDetailsDrawer, { ActivityLog } from '@/components/admin/logs/LogDetailsDrawer';

export default function ActivityLogsPage() {
  const [rawLogs, setRawLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const fetchLogs = async (token: string) => {
    try {
      const res = await fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setRawLogs(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchLogs(token);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return rawLogs;
    return rawLogs.filter(log => {
      return log.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
             log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
             log.action.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [rawLogs, searchQuery]);

  // KPI calculations
  const todayLogsCount = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    return rawLogs.filter(l => new Date(l.timestamp).setHours(0,0,0,0) === today).length;
  }, [rawLogs]);

  const criticalCount = useMemo(() => rawLogs.filter(l => l.status === 'critical').length, [rawLogs]);
  const failedLogins = useMemo(() => rawLogs.filter(l => l.action === 'LOGIN_FAILED').length, [rawLogs]);
  const activeStaffToday = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    const todayStaff = rawLogs.filter(l => new Date(l.timestamp).setHours(0,0,0,0) === today).map(l => l.userId);
    return new Set(todayStaff).size;
  }, [rawLogs]);

  if (loading) return <div className="p-8">Loading audit logs...</div>;

  return (
    <div style={{ padding: '0', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
          <p className="text-gray-500">Monitor system events, staff actions, and security alerts.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px', color: '#3b82f6' }}><Activity size={24} /></div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Today's Activities</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{todayLogsCount}</h3>
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '12px', color: '#ef4444' }}><AlertTriangle size={24} /></div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Failed Logins</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{failedLogins}</h3>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px', color: '#22c55e' }}><Users size={24} /></div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Active Staff Today</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeStaffToday}</h3>
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#fff7ed', padding: '1rem', borderRadius: '12px', color: '#f97316' }}><FileWarning size={24} /></div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Critical Actions</p>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{criticalCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        
        <div style={{ position: 'relative', flex: '1 1 auto' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search logs by user, action, module, or description..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}
          />
        </div>

      </div>

      {/* Table */}
      <LogsTable logs={filteredLogs} onRowClick={log => setSelectedLog(log)} />

      {/* Drawer */}
      <LogDetailsDrawer 
        log={selectedLog} 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />
      
    </div>
  );
}
