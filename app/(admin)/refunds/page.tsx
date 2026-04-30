'use client';
import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { MOCK_REFUNDS, formatCurrency, formatDate } from '@/lib/mock-data';
import { Refund } from '@/types';

const STATUS_BADGE: Record<Refund['status'], string> = {
  PENDING:   'badge-warning',
  APPROVED:  'badge-info',
  REJECTED:  'badge-danger',
  PROCESSED: 'badge-success',
  FAILED:    'badge-danger',
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const approve = (id: string) => setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r));
  const reject  = (id: string) => setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' as const } : r));

  const filtered = refunds.filter(r => {
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.merchantName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const pending = refunds.filter(r => r.status === 'PENDING').length;
  const totalPendingAmount = refunds.filter(r => r.status === 'PENDING').reduce((acc, r) => acc + r.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Refunds</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Manage and process refund requests</p>
        </div>
        <button className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Sync Status</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Pending Review', value: pending,                                                                         color: 'var(--warning)', bg: 'var(--warning-muted)', icon: Clock },
          { label: 'Approved',      value: refunds.filter(r => r.status === 'APPROVED').length,                              color: 'var(--info)',    bg: 'var(--info-muted)',    icon: CheckCircle },
          { label: 'Processed',     value: refunds.filter(r => r.status === 'PROCESSED').length,                             color: 'var(--success)', bg: 'var(--success-muted)', icon: CheckCircle },
          { label: 'Pending Amount',value: `₹${(totalPendingAmount/1000).toFixed(0)}K`,                                      color: 'var(--accent-primary)', bg: 'var(--accent-primary-muted)', icon: RefreshCw },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search refunds..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'PENDING', 'APPROVED', 'PROCESSED', 'REJECTED'].map(s => (
            <button key={s} className={`chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)} style={{ fontSize: 11 }}>
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th>Refund ID</th>
                <th>Transaction ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-primary-hover)' }}>{r.id}</span></td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{r.transactionId}</span></td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{r.merchantName}</td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(r.amount)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.reason}</td>
                  <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(r.requestedAt)}</td>
                  <td>
                    {r.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm" onClick={() => approve(r.id)}
                          style={{ background: 'var(--success-muted)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6 }}>
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => reject(r.id)} style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No refunds found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
