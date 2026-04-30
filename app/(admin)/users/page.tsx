'use client';
import { useState } from 'react';
import { Search, UserPlus, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_USERS, formatDate, timeAgo } from '@/lib/mock-data';
import { AdminUser } from '@/types';

const ROLE_BADGE: Record<AdminUser['role'], string> = {
  SUPER_ADMIN: 'badge-danger',
  OPERATIONS:  'badge-primary',
  FINANCE:     'badge-success',
  DEVELOPER:   'badge-warning',
  SUPPORT:     'badge-muted',
};
const ROLE_COLORS: Record<AdminUser['role'], string> = {
  SUPER_ADMIN: '#EF4444', OPERATIONS: '#6366F1', FINANCE: '#10B981', DEVELOPER: '#F59E0B', SUPPORT: '#9CA3AF',
};

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('OPERATIONS');

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Users & Roles</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{users.length} admin users across all roles</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowInvite(true)}>
          <UserPlus size={14} /> Invite User
        </button>
      </div>

      {/* Role summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        {(['SUPER_ADMIN', 'OPERATIONS', 'FINANCE', 'DEVELOPER', 'SUPPORT'] as AdminUser['role'][]).map(role => {
          const count = users.filter(u => u.role === role).length;
          const color = ROLE_COLORS[role];
          return (
            <div key={role} className="card" style={{ padding: 14, textAlign: 'center', borderTop: `2px solid ${color}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{role.replace('_', ' ')}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, fontSize: 13 }} />
        </div>
      </div>

      {/* User cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {filtered.map(user => (
          <div key={user.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${ROLE_COLORS[user.role]}40, ${ROLE_COLORS[user.role]}20)`,
                  border: `2px solid ${ROLE_COLORS[user.role]}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: ROLE_COLORS[user.role],
                }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <span className={`badge ${ROLE_BADGE[user.role]}`} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                  <Shield size={10} /> {user.role.replace('_', ' ')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: user.status === 'ACTIVE' ? 'var(--success)' : 'var(--text-muted)' }}>
                  {user.status === 'ACTIVE' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  {user.status}
                </span>
              </div>
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Last Login</div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{timeAgo(user.lastLogin)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Member Since</div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{formatDate(user.createdAt).split(',')[0]}</div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>Edit Role</button>
              <button className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-secondary'}`} style={{ fontSize: 12, padding: '6px 12px' }}>
                {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-box" style={{ padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Invite Team Member</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Send an invitation to a new admin user</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email Address</label>
                <input className="input" placeholder="colleague@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Role</label>
                <select className="input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  {['OPERATIONS', 'FINANCE', 'DEVELOPER', 'SUPPORT'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowInvite(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                  setShowInvite(false);
                  setInviteEmail('');
                }}>Send Invitation</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
