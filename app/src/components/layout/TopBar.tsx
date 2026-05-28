import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoleView } from '../../context/RoleViewContext';
import { ROLE_META } from '../../data/role-access';
import type { RoleKey } from '../../data/mock-users';

const ALL_ROLES: RoleKey[] = ['org', 'entity', 'payroll', 'hr', 'acct', 'mgr'];

const PERSONAL_SETTINGS_ITEMS = [
  { label: 'Switch Company',         icon: 'switch'   },
  { label: 'Personal Info',          icon: 'person'   },
  { label: 'Authentication Methods', icon: 'lock'     },
  { label: 'Notification Settings',  icon: 'bell'     },
  { label: 'Refer a Friend',         icon: 'gift'     },
  { divider: true },
  { label: 'Sign Out',               icon: 'signout', danger: true },
];

function IconBtn({ icon, label, badge, active, onClick }: { icon: React.ReactNode; label: string; badge?: boolean; active?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: 32, height: 32, borderRadius: 7,
        border: `0.5px solid ${active ? 'var(--border2)' : 'transparent'}`,
        background: active ? 'var(--bg)' : hovered ? 'var(--bg)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: active ? 'var(--text)' : 'var(--text2)',
        transition: 'all 0.1s',
      }}
    >
      {icon}
      {badge && (
        <div style={{
          position: 'absolute', top: 5, right: 5,
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--payroll)', border: '1.5px solid var(--surface)',
        }} />
      )}
    </button>
  );
}

export function TopBar() {
  const { viewAs, setViewAs } = useRoleView();
  const [roleOpen, setRoleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const meta = ROLE_META[viewAs];
  const isDefaultView = viewAs === 'org';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{
      height: 48,
      borderBottom: '0.5px solid var(--border2)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      gap: 12,
    }}>
      {/* Left — preview banner */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!isDefaultView && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', background: meta.bg,
            borderRadius: 5, border: `0.5px solid ${meta.color}33`,
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ color: meta.color, flexShrink: 0 }}>
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5.5 3.5v3M5.5 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: meta.color }}>
              Previewing as {meta.label} — some areas are hidden
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        {/* Integrations */}
        <IconBtn
          label="Integrations"
          active={location.pathname.startsWith('/integrations')}
          onClick={() => navigate('/integrations')}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M11 8.5v1.5M11 10v1.5m0 0H9.5m1.5 0H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          }
        />

        {/* Help */}
        <IconBtn
          label="Help"
          active={location.pathname.startsWith('/help')}
          onClick={() => navigate('/help')}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M5.5 5.5a2 2 0 013.5 1.333C9 8 7.5 8.5 7.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="7.5" cy="11.5" r=".5" fill="currentColor"/>
            </svg>
          }
        />

        {/* Notifications */}
        <IconBtn label="Notifications" badge icon={
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 2a4 4 0 00-4 4v2.5L2 10h11l-1.5-1.5V6a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M6 10.5c0 .828.672 1.5 1.5 1.5S9 11.328 9 10.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        }/>

        {/* Organisation Settings (cog) */}
        <IconBtn
          label="Organisation Settings"
          active={location.pathname.startsWith('/org-settings')}
          onClick={() => navigate('/org-settings')}
          icon={
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7.5 1.5v1M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1M3.4 3.4l.7.7M10.9 10.9l.7.7M3.4 11.6l.7-.7M10.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          }
        />

        <div style={{ width: 1, height: 20, background: 'var(--border2)', margin: '0 2px' }} />

        {/* Personal Settings */}
        <div ref={settingsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setSettingsOpen(o => !o); setRoleOpen(false); }}
            style={{
              width: 32, height: 32, borderRadius: 7,
              border: `0.5px solid ${settingsOpen ? 'var(--border2)' : 'transparent'}`,
              background: settingsOpen ? 'var(--bg)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text2)',
              transition: 'all 0.1s',
            }}
            title="Personal Settings"
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--org-bg)',
              border: '1.5px solid var(--org)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Mono', monospace", fontSize: 8.5, fontWeight: 500, color: 'var(--org)',
            }}>
              SM
            </div>
          </button>

          {settingsOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'var(--surface)', border: '0.5px solid var(--border2)',
              borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 220, overflow: 'hidden', zIndex: 100,
            }}>
              {/* Header */}
              <div style={{ padding: '12px 14px 10px', borderBottom: '0.5px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--org-bg)', border: '1.5px solid rgba(91,79,212,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: 'var(--org)',
                    flexShrink: 0,
                  }}>
                    SM
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Sophie Marchand</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>sophie.marchand@acme.com</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              {PERSONAL_SETTINGS_ITEMS.map((item, i) => {
                if ('divider' in item) {
                  return <div key={i} style={{ height: '0.5px', background: 'var(--border)', margin: '4px 0' }} />;
                }
                return (
                  <button
                    key={item.label}
                    onClick={() => setSettingsOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 14px',
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      fontSize: 13,
                      color: item.danger ? 'var(--payroll)' : 'var(--text)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <MenuIcon name={item.icon} danger={item.danger} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border2)', margin: '0 2px' }} />

        {/* Role switcher */}
        <div ref={roleRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setRoleOpen(o => !o); setSettingsOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 10px 5px 8px',
              background: roleOpen ? meta.bg : 'var(--bg)',
              border: `0.5px solid ${roleOpen ? meta.color + '44' : 'var(--border2)'}`,
              borderRadius: 6, cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, textAlign: 'left' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                View as
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: meta.color, lineHeight: 1.3 }}>
                {meta.label}
              </span>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
              color: 'var(--text3)', flexShrink: 0,
              transform: roleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s',
            }}>
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {roleOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'var(--surface)', border: '0.5px solid var(--border2)',
              borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 230, overflow: 'hidden', zIndex: 100,
            }}>
              <div style={{
                padding: '8px 12px 6px',
                fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--text3)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                borderBottom: '0.5px solid var(--border)',
              }}>
                Role perspective
              </div>
              {ALL_ROLES.map(role => {
                const m = ROLE_META[role];
                const isSelected = viewAs === role;
                const isDerived = role === 'mgr';
                return (
                  <button
                    key={role}
                    onClick={() => { setViewAs(role); setRoleOpen(false); }}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 1,
                      width: '100%', padding: '9px 12px',
                      background: isSelected ? m.bg : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      borderBottom: '0.5px solid var(--border)', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: isSelected ? 500 : 400, color: isSelected ? m.color : 'var(--text)' }}>
                        {m.label}
                      </span>
                      {isDerived && (
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--text3)', padding: '1px 5px', background: 'var(--bg)', borderRadius: 3 }}>
                          derived
                        </span>
                      )}
                      {isSelected && !isDerived && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke={m.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{m.labelFr}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ name, danger }: { name?: string; danger?: boolean }) {
  const color = danger ? 'var(--payroll)' : 'var(--text3)';
  const icons: Record<string, React.ReactNode> = {
    switch: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h10M8.5 3.5l3 3-3 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    person: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4" r="2" stroke={color} strokeWidth="1.2"/><path d="M1.5 11.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>,
    lock: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="6" width="9" height="6" rx="1" stroke={color} strokeWidth="1.2"/><path d="M4 6V4a2.5 2.5 0 015 0v2" stroke={color} strokeWidth="1.2"/></svg>,
    bell: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5a3.5 3.5 0 00-3.5 3.5v2L1.5 9h9L9 7V5a3.5 3.5 0 00-3.5-3.5z" stroke={color} strokeWidth="1.2"/><path d="M5 9c0 .828.448 1.5 1 1.5s1-.672 1-1.5" stroke={color} strokeWidth="1.2"/></svg>,
    gift: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="5" width="10" height="7" rx="1" stroke={color} strokeWidth="1.2"/><path d="M1.5 5h10v2h-10zM6.5 5V12" stroke={color} strokeWidth="1.2"/><path d="M4.5 5c-1 0-2-1.5 0-2s2 2 2 2M8.5 5c1 0 2-1.5 0-2s-2 2-2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>,
    signout: <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 4.5l3 2-3 2M11.5 6.5H5M5 1.5H2.5a1 1 0 00-1 1v8a1 1 0 001 1H5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return <span style={{ flexShrink: 0, display: 'flex' }}>{icons[name ?? ''] ?? null}</span>;
}
