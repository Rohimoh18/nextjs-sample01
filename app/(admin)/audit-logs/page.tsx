'use client';
import { useState } from 'react';
import { Search, Info, AlertTriangle, AlertCircle, Filter } from 'lucide-react';
import { MOCK_AUDIT_LOGS, formatDate, timeAgo } from '@/lib/mock-data';
import { AuditLog } from '@/types';

const SEV_CONFIG: Record<AuditLog['severity'], { badge: string; icon: React.ReactNode; color: string }> = {
  INFO:     { badge: 'badge-info',    icon: <Info size={13} />,          color: 'var(--info)' },
  WARNING:  { badge: 'badge-warning', icon: <AlertTriangle size={13} />, color: 'var(--warning)' },
  CRITICAL: { badge: 'badge-danger',  icon: <AlertCircle size={13} />,   color: 'var(--danger)' },
};

const ACTION_COLORS: Record<string, string> = {
  REFUND_APPROVED: 'var(--success)', REFUND_REJECTED: 'var(--danger)',
  GATEWAY_DISABLED: 'var(--warning)', MERCHANT_SUSPENDED: 'var(--danger)',
  API_KEY_REGENERATED: 'var(--warning)', USER_INVITED: 'var(--info)',
  DISPUTE_STATUS_CHANGED: 'var(--info)', ROUTING_RULE_UPDATED: 'var(--warning)',
  MERCHANT_KYC_APPROVED: 'var(--success)', LOGIN_SUCCESS: 'var(--success)',
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('ALL');
  const [resource, setResource] = useState('ALL');

  const resources = ['ALL', ...Array.from(new Set(MOCK_AUDIT_LOGS.map(l => l.resource)))];

  const filtered = MOCK_AUDIT_LOGS.filter(log => {
    if (search && !log.action.toLowerCase().includes(search.toLowerCase()) &&
        !log.userName.toLowerCase().includes(search.toLowerCase()) &&
        !log.details.toLowerCase().includes(search.toLowerCase())) return false;
    if (severity !== 'ALL' && log.severity !== severity) return false;
    if (resource !== 'ALL' && log.resource !== resource) return false;
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Audit Logs</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Complete trail of admin actions · {filtered.length} entries
          </p>
        </div>
        <button className="btn btn-secondary btn-sm"><Filter size={14} /> Export Logs</button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', value: MOCK_AUDIT_LOGS.length, color: 'var(--text-primary)' },
          { label: 'Critical', value: MOCK_AUDIT_LOGS.filter(l => l.severity === 'CRITICAL').length, color: 'var(--danger)' },
          { label: 'Warnings', value: MOCK_AUDIT_LOGS.filter(l => l.severity === 'WARNING').length, color: 'var(--warning)' },
          { label: 'Info', value: MOCK_AUDIT_LOGS.filter(l => l.severity === 'INFO').length, color: 'var(--info)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '10px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color }}>{value}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search actions, users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <select className="input" value={severity} onChange={e => setSeverity(e.target.value)} style={{ width: 140, fontSize: 13 }}>
          {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Severity' : s}</option>)}
        </select>
        <select className="input" value={resource} onChange={e => setResource(e.target.value)} style={{ width: 150, fontSize: 13 }}>
          {resources.map(r => <option key={r} value={r}>{r === 'ALL' ? 'All Resources' : r}</option>)}
        </select>
      </div>

      {/* Log Timeline */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.map((log, idx) => {
          const sc = SEV_CONFIG[log.severity];
          const actionColor = ACTION_COLORS[log.action] ?? 'var(--text-secondary)';
          return (
            <div key={log.id} style={{
              display: 'flex', gap: 16, padding: '14px 20px',
              borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
            >
              {/* Severity icon */}
              <div style={{ flexShrink: 0, marginTop: 2, color: sc.color }}>
                {sc.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: actionColor, fontFamily: 'monospace' }}>
                    {log.action}
                  </span>
                  <span className={`badge ${sc.badge}`} style={{ fontSize: 10, padding: '1px 6px' }}>{log.severity}</span>
                  <span className="badge badge-muted" style={{ fontSize: 10, padding: '1px 6px' }}>{log.resource}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{log.details}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>👤 {log.userName}</span>
                  <span>🌐 {log.ipAddress}</span>
                  <span style={{ fontFamily: 'monospace' }}>#{log.resourceId}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{timeAgo(log.timestamp)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 2 }}>{formatDate(log.timestamp)}</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found</div>
        )}
      </div>
    </div>
  );
}
