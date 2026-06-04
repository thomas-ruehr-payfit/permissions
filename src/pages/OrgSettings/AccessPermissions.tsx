import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext';
import { ROLE_META } from '../../data/role-access';
import { ENTITIES, GROUPS } from '../../data/mock-entities';

const ENTITY_FLAGS: Record<string, string> = {
  fr: '🇫🇷',
  es: '🇪🇸',
  uk: '🇬🇧',
};

export function AccessPermissions() {
  const { users } = useUsers();
  const navigate = useNavigate();

  const active = users.filter(u => u.status === 'active');
  const pending = users.filter(u => u.status === 'pending');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300,
            color: 'var(--text)', marginBottom: 4, lineHeight: 1.2,
          }}>
            Access & Permissions
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text2)', fontFamily: "'DM Mono', monospace" }}>
            {active.length} active · {pending.length} pending
          </p>
        </div>
        <button
          onClick={() => navigate('/org-settings/invite')}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 7, border: 'none',
            background: 'var(--text)', color: 'white',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'opacity 0.1s', marginTop: 4,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Invite admin
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)', borderRadius: 10,
        border: '0.5px solid var(--border2)', overflow: 'hidden',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 360px 96px 32px',
          padding: '10px 20px', borderBottom: '0.5px solid var(--border)',
          background: 'var(--bg)',
        }}>
          {['Person', 'Access', 'Status', ''].map(h => (
            <div key={h} style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10.5,
              color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em',
              paddingLeft: h === 'Person' ? 42 : 0,
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {users.map((user, idx) => {
          const isPending = user.status === 'pending';

          return (
            <div
              key={user.id}
              onClick={() => navigate(`/org-settings/access-permissions/${user.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 360px 96px 32px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: idx < users.length - 1 ? '0.5px solid var(--border)' : 'none',
                opacity: isPending ? 0.65 : 1,
                cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg)';
                const chevron = e.currentTarget.querySelector<SVGElement>('[data-chevron]');
                if (chevron) chevron.style.color = 'var(--text)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                const chevron = e.currentTarget.querySelector<SVGElement>('[data-chevron]');
                if (chevron) chevron.style.color = 'var(--text3)';
              }}
            >
              {/* Person */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(0,0,0,0.055)', border: '1px solid rgba(0,0,0,0.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 10.5, fontWeight: 600,
                  color: 'var(--text2)',
                }}>
                  {user.avatarInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Access — each pair as a 2-col sub-grid so perimeter always starts at a fixed x */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {user.access.map((pair, i) => {
                  const p = pair.perimeter;
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px' }}>
                      {/* Left: role name */}
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flexShrink: 0, lineHeight: '20px' }}>
                          {ROLE_META[pair.role].label}
                        </div>
                      </div>
                      {/* Right: perimeter items — consistent x position across all rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 12 }}>
                        {p.type === 'org' && (
                          <span style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>Org-wide</span>
                        )}
                        {p.type === 'entity' && (p.entityIds ?? []).map(id => {
                          const entity = ENTITIES.find(e => e.id === id);
                          return entity ? (
                            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>
                              <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{ENTITY_FLAGS[entity.id] ?? '🏳️'}</span>
                              {entity.name}
                            </div>
                          ) : null;
                        })}
                        {p.type === 'entity' && p.exclude && (
                          <span style={{ fontSize: 12, color: 'var(--text2)', fontStyle: 'italic', lineHeight: '20px' }}>All except</span>
                        )}
                        {p.type === 'group' && (() => {
                          const groups = GROUPS.filter(g => (p.groupIds ?? []).includes(g.id));
                          if (!groups.length) return null;
                          return (
                            <>
                              {p.exclude && <span style={{ fontSize: 12, color: 'var(--text2)', fontStyle: 'italic', lineHeight: '20px' }}>All except</span>}
                              {groups.map(group => (
                                <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>
                                  <svg width="13" height="13" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0, color: 'var(--text3)' }}>
                                    <circle cx="4" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/>
                                    <path d="M1 9c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                                    <circle cx="8" cy="3.5" r="1.4" stroke="currentColor" strokeWidth="1"/>
                                    <path d="M8 6.2c1.1.3 2 1.3 2 2.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                  </svg>
                                  {group.name}
                                </div>
                              ))}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 4,
                  background: isPending ? 'rgba(196,140,40,0.08)' : 'rgba(15,110,86,0.08)',
                  fontSize: 12, fontWeight: 500,
                  color: isPending ? '#9A6B00' : '#0A5C47',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: isPending ? '#9A6B00' : '#0A5C47' }} />
                  {isPending ? 'Pending' : 'Active'}
                </span>
              </div>

              {/* Chevron */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text3)' }}>
                <svg data-chevron width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
            No admins yet — invite someone to get started.
          </div>
        )}
      </div>
    </div>
  );
}
