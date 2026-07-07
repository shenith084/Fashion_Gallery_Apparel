'use client';

import React, { useState } from 'react';
import { ActivityLog } from './LogDetailsDrawer';
import { ChevronLeft, ChevronRight, Monitor, Globe } from 'lucide-react';

type LogsTableProps = {
  logs: ActivityLog[];
  onRowClick: (log: ActivityLog) => void;
};

export default function LogsTable({ logs, onRowClick }: LogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Success</span>;
      case 'failed':
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Failed</span>;
      case 'critical':
        return <span style={{ background: '#ffedd5', color: '#9a3412', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>Critical</span>;
      default:
        return <span style={{ background: '#f3f4f6', color: '#374151', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500 }}>{status}</span>;
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>User</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Module</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Session</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                  No logs found matching your criteria.
                </td>
              </tr>
            ) : (
              currentLogs.map(log => (
                <tr 
                  key={log.id} 
                  onClick={() => onRowClick(log)}
                  style={{ borderBottom: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                    {formatDate(log.timestamp)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={log.userAvatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap' }}>{log.userName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
                    {log.module}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4b5563', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.description}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', color: '#9ca3af' }}>
                      <Monitor size={16} title={log.device} />
                      <Globe size={16} title={log.browser} />
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Showing <span style={{ fontWeight: 500, color: '#111827' }}>{startIndex + 1}</span> to <span style={{ fontWeight: 500, color: '#111827' }}>{Math.min(startIndex + itemsPerPage, logs.length)}</span> of <span style={{ fontWeight: 500, color: '#111827' }}>{logs.length}</span> results
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
