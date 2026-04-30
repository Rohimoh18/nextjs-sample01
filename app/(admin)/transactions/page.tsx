'use client';
import { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, X, ExternalLink, Copy } from 'lucide-react';
import { MOCK_TRANSACTIONS, formatCurrency, formatDate } from '@/lib/mock-data';
import { Transaction } from '@/types';

const STATUS_OPTIONS = ['ALL', 'SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'];
const METHOD_OPTIONS = ['ALL', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'EMI', 'BNPL'];
const GATEWAY_OPTIONS = ['ALL', 'Razorpay', 'PayU', 'Cashfree', 'Paytm', 'Stripe', 'CCAvenue'];

const statusStyle: Record<string, string> = {
  SUCCESS: 'badge-success', FAILED: 'badge-danger', PENDING: 'badge-warning',
  REFUNDED: 'badge-info', PARTIAL_REFUND: 'badge-info',
};

const PAGE_SIZE = 15;

function TransactionDrawer({ txn, onClose }: { txn: Transaction; onClose: () => void }) {
  const sc = statusStyle[txn.status];
  return (
    <>
      <div className="modal-overlay" style={{ justifyContent: 'flex-end', alignItems: 'stretch', background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
      <div className="drawer">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Transaction Details</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{txn.id}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 8 }}><X size={16} /></button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Amount hero */}
          <div className="card" style={{ padding: 20, marginBottom: 20, textAlign: 'center', background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatCurrency(txn.amount, txn.currency)}</div>
            <div style={{ marginTop: 8 }}><span className={`badge ${sc}`}>{txn.status}</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{formatDate(txn.createdAt)}</div>
          </div>

          {/* Details grid */}
          {[
            ['Order ID', txn.orderId],
            ['Merchant', txn.merchantName],
            ['Gateway', txn.gateway],
            ['Payment Method', txn.paymentMethod],
            ['Gateway Ref', txn.gatewayRefId ?? '—'],
            ['Customer Email', txn.customerEmail],
            ['Customer Phone', txn.customerPhone],
            ...(txn.upiId ? [['UPI ID', txn.upiId]] : []),
            ...(txn.cardLast4 ? [['Card', `•••• •••• •••• ${txn.cardLast4} (${txn.cardNetwork})`]] : []),
            ...(txn.errorCode ? [['Error Code', txn.errorCode], ['Error Message', txn.errorMessage ?? '']] : []),
            ['IP Address', txn.ipAddress ?? '—'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: txn.errorCode && label === 'Error Code' ? 'var(--danger)' : 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <Copy size={14} /> Copy ID
            </button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <ExternalLink size={14} /> View in Gateway
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [method, setMethod] = useState('ALL');
  const [gateway, setGateway] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      if (search && !t.id.toLowerCase().includes(search.toLowerCase()) &&
          !t.merchantName.toLowerCase().includes(search.toLowerCase()) &&
          !t.orderId.toLowerCase().includes(search.toLowerCase()) &&
          !t.customerEmail.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== 'ALL' && t.status !== status) return false;
      if (method !== 'ALL' && t.paymentMethod !== method) return false;
      if (gateway !== 'ALL' && t.gateway !== gateway) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [search, status, method, gateway]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Transactions</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            {filtered.length.toLocaleString()} transactions found
          </p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input"
              placeholder="Search by ID, merchant, email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: 32, fontSize: 13 }}
            />
          </div>
          <select className="input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ width: 140, fontSize: 13 }}>
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Status' : o}</option>)}
          </select>
          <select className="input" value={method} onChange={e => { setMethod(e.target.value); setPage(1); }} style={{ width: 150, fontSize: 13 }}>
            {METHOD_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Methods' : o}</option>)}
          </select>
          <select className="input" value={gateway} onChange={e => { setGateway(e.target.value); setPage(1); }} style={{ width: 150, fontSize: 13 }}>
            {GATEWAY_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Gateways' : o}</option>)}
          </select>
          {(search || status !== 'ALL' || method !== 'ALL' || gateway !== 'ALL') && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setStatus('ALL'); setMethod('ALL'); setGateway('ALL'); setPage(1); }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order ID</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Gateway</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(txn => (
                <tr key={txn.id} onClick={() => setSelected(txn)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-primary-hover)' }}>{txn.id}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{txn.orderId}</td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{txn.merchantName}</td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(txn.amount, txn.currency)}</td>
                  <td><span className="badge badge-muted">{txn.paymentMethod}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{txn.gateway}</td>
                  <td><span className={`badge ${statusStyle[txn.status]}`}>{txn.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(txn.createdAt)}</td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} className="btn btn-sm" onClick={() => setPage(p)}
                  style={{ background: p === page ? 'var(--accent-primary)' : 'var(--bg-surface)', color: p === page ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border-default)', minWidth: 34 }}>
                  {p}
                </button>
              );
            })}
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selected && <TransactionDrawer txn={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
