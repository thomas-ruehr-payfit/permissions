import { useState } from 'react';
import type { AdminUser } from '../../data/mock-users';
import { ROLE_META } from '../../data/role-access';
import { ENTITIES, GROUPS } from '../../data/mock-entities';
import { Avatar } from '../ui/Avatar';
import { RoleBadge } from '../ui/RoleBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { InviteModal } from './InviteFlow/InviteModal';

interface Props {
  users: AdminUser[];
  onAdd: (user: AdminUser) => void;
  onRevoke: (userId: string) => void;
  onResend: (userId: string) => void;
}

function perimeterLabel(user: AdminUser): string {
  const pairs = user.access;
  return pairs.map(pair => {
    const p = pair.perimeter;
    if (p.type === 'org') return 'Org-wide';
    if (p.type === 'entity') {
      const names = (p.entityIds ?? []).map(id => ENTITIES.find(e => e.id === id)?.code ?? id);
      return names.join(', ');
    }
    if (p.type === 'entity-group') {
      const groupName = p.groupIds?.[0] ? GROUPS.find(g => g.id === p.groupIds[0])?.name ?? p.groupIds[0] : null;
      return groupName ?? '—';
    }
    return '—';
  }).join(' · ');
}

export function PeopleTable({ users, onAdd, onRevoke, onResend }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const active = users.filter(u => u.status === 'active');
  const pending = users.filter(u => u.status === 'pending');

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300, color: 'var(--text)', marginBottom: 4 }}>
            Access & Permissions
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            {active.length} active · {pending.length} pending
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 7,
            border: 'none', background: 'var(--text)',
            color: 'var(--bg)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Invite admin
        </button>
      </div>

      <div style={{
        background: 'var(--surface)',
        borderRadius: 10,
        border: '0.5px solid var(--border2)',
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 180px 180px 120px 44px',
          padding: '10px 20px',
          borderBottom: '0.5px solid var(--border)',
          background: 'var(--bg)',
        }}>
          {['Person', 'Role', 'Perimeter', 'Status', ''].map(h => (
            <div key={h} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {users.map((user, idx) => {
          const isPending = user.status === 'pending';
          const isMenuOpen = menuOpen === user.id;
          const meta = ROLE_META[user.access[0].role];

          return (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 180px 120px 44px',
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: idx < users.length - 1 ? '0.5px solid var(--border)' : 'none',
                opacity: isPending ? 0.75 : 1,
                background: isPending ? 'rgba(0,0,0,0.01)' : 'transparent',
                position: 'relative',
              }}
            >
              {/* Person */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar
                  initials={user.avatarInitials}
                  color={meta.color}
                  size={32}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{user.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Role */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {user.access.map((pair, i) => (
                  <RoleBadge key={i} role={pair.role} size="sm" />
                ))}
              </div>

              {/* Perimeter */}
              <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: "'DM Mono', monospace" }}>
                {perimeterLabel(user)}
              </div>

              {/* Status */}
              <StatusBadge status={user.status} />

              {/* Actions menu */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setMenuOpen(isMenuOpen ? null : user.id)}
                  style={{
                    width: 28, height: 28, borderRadius: 5,
                    border: '0.5px solid transparent',
                    background: isMenuOpen ? 'var(--bg)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text3)',
                    transition: 'all 0.1s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="3" r="1" fill="currentColor"/>
                    <circle cx="7" cy="7" r="1" fill="currentColor"/>
                    <circle cx="7" cy="11" r="1" fill="currentColor"/>
                  </svg>
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                      onClick={() => setMenuOpen(null)}
                    />
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                      background: 'var(--surface)',
                      border: '0.5px solid var(--border2)',
                      borderRadius: 8,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      minWidth: 160, zIndex: 100,
                      overflow: 'hidden',
                    }}>
                      {isPending && (
                        <button
                          onClick={() => { onResend(user.id); setMenuOpen(null); }}
                          style={menuBtnStyle}
                        >
                          Resend invitation
                        </button>
                      )}
                      <button
                        onClick={() => { onRevoke(user.id); setMenuOpen(null); }}
                        style={{ ...menuBtnStyle, color: '#C04A1E' }}
                      >
                        Revoke access
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
            No admins yet — invite someone to get started.
          </div>
        )}
      </div>

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onAdd={user => { onAdd(user); setShowInvite(false); }}
        />
      )}
    </div>
  );
}

const menuBtnStyle: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '9px 14px', border: 'none',
  background: 'transparent', textAlign: 'left',
  fontSize: 13, color: 'var(--text)',
  cursor: 'pointer', borderBottom: '0.5px solid var(--border)',
};
