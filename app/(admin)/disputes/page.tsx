'use client';
import { useState } from 'react';
import { AlertTriangle, Search, Upload, Calendar } from 'lucide-react';
import { MOCK_DISPUTES, formatCurrency, formatDate } from '@/lib/mock-data';
import { Dispute } from '@/types';

const STATUS_BADGE: Record<Dispute['status'], string> = {
  OPEN:         'badge-danger',
  UNDER_REVIEW: 'badge-warning',
  WON:          'badge-success',
  LOST:         'badge-muted',
  WITHDRAWN:    'badge-muted',
};
const TYPE_BADGE: Record<Dispute['disputeType'], string> = {
  CHARGEBACK:        'badge-danger',
  FRAUD:             'badge-danger',
  ITEM_NOT_RECEIVED: 'badge-warning',
  UNAUTHORIZED:      'badge-warning',
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = disputes.filter(d => {
    if (search && !d.id.toLowerCase().includes(search.toLowerCase()) && !d.merchantName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());

  const openCount = disputes.filter(d => d.status === 'OPEN').length;
  const reviewCount = disputes.filter(d => d.status === 'UNDER_REVIEW').length;
  const wonCount = disputes.filter(d => d.status === 'WON').length;
  const totalAtRisk = disputes.filter(d => ['OPEN', 'UNDER_REVIEW'].includes(d.status)).reduce((acc, d) => acc + d.amount, 0);

  const getDaysUntilDue = (due: string) => {
    const diff = new Date(due).getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Disputes & Chargebacks</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Track and respond to payment disputes</p>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Open Disputes',   value: openCount,   color: 'var(--danger)',  bg: 'var(--danger-muted)' },
          { label: 'Under Review',    value: reviewCount, color: 'var(--warning)', bg: 'var(--warning-muted)' },
          { label: 'Won',             value: wonCount,    color: 'var(--success)', bg: 'var(--success-muted)' },
          { label: 'Amount at Risk',  value: `₹${(totalAtRisk/1000).toFixed(0)}K`, color: 'var(--danger)', bg: 'var(--danger-muted)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search disputes..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'OPEN', 'UNDER_REVIEW', 'WON', 'LOST'].map(s => (
            <button key={s} className={`chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ fontSize: 11 }}>
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(d => {
          const daysLeft = getDaysUntilDue(d.dueDate);
          const isUrgent = daysLeft <= 3 && ['OPEN', 'UNDER_REVIEW'].includes(d.status);
          return (
            <div key={d.id} className="card" style={{ padding: 20, borderLeft: `3px solid ${isUrgent ? 'var(--danger)' : d.status === 'WON' ? 'var(--success)' : 'var(--border-subtle)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'var(--danger-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--accent-primary-hover)', fontWeight: 600 }}>{d.id}</span>
                      <span className={`badge ${STATUS_BADGE[d.status]}`}>{d.status.replace('_', ' ')}</span>
                      <span className={`badge ${TYPE_BADGE[d.disputeType]}`}>{d.disputeType.replace('_', ' ')}</span>
                      {isUrgent && <span className="badge badge-danger" style={{ animation: 'pulse-glow 1.5s infinite' }}>URGENT</span>}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {d.merchantName} · {d.reason}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{formatCurrency(d.amount)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.currency}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: isUrgent ? 'var(--danger)' : 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      Due in {daysLeft}d
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-disabled)' }}>Opened {formatDate(d.openedAt)}</div>
                  </div>
                  {['OPEN', 'UNDER_REVIEW'].includes(d.status) && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Upload size={12} /> Evidence
                      </button>
                      <button className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>Respond</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>No disputes found</div>
        )}
      </div>
    </div>
  );
}
