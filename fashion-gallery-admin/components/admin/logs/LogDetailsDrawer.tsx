'use client';

import React from 'react';
import { X, Clock, Monitor, Globe, User, Activity, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export type ActivityLog = {
  id: string;
  timestamp: number;
  userId: string;
  userName: string;
  userAvatar: string;
  module: string;
  action: string;
  description: string;
  device: string;
  browser: string;
  status: 'success' | 'failed' | 'critical';
};

type DrawerProps = {
  log: ActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function LogDetailsDrawer({ log, isOpen, onClose }: DrawerProps) {
  if (!isOpen || !log) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={24} className="text-green-600" />;
      case 'failed': return <XCircle size={24} className="text-red-600" />;
      case 'critical': return <ShieldAlert size={24} className="text-orange-600" />;
      default: return <Activity size={24} className="text-gray-600" />;
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-400px',
          width: '400px',
          height: '100vh',
          background: 'white',
          zIndex: 50,
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Activity Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
            {getStatusIcon(log.status)}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>{log.action}</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Module: {log.module}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* User Section */}
            <div style={{ background: 'var(--bg-muted)', padding: '1rem', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Performed By</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={log.userAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{log.userName}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {log.userId}</p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Event Details</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Clock size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Timestamp</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{formatDate(log.timestamp)}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Activity size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Description</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{log.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Session Info</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Monitor size={16} className="text-gray-400" />
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{log.device}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Globe size={16} className="text-gray-400" />
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{log.browser}</p>
                </div>
              </div>
            </div>

            {/* Raw JSON */}
            <div>
               <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Raw Payload</h4>
               <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', overflowX: 'auto' }}>
                 {JSON.stringify(log, null, 2)}
               </pre>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
