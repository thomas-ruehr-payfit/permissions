import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useRoleView } from '../../context/RoleViewContext';
import type { RoleKey } from '../../data/mock-users';

interface SectionConfig {
  id: string;
  label: string;
  path: string;
  visibleTo: RoleKey[];
  icon: React.ReactNode;
}

const ALL_SECTIONS: SectionConfig[] = [
  {
    id: 'billing',
    label: 'Billing',
    path: '/org-settings/billing',
    visibleTo: ['org', 'entity'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="3.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 6.5h12" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4.5 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'entities',
    label: 'Entities',
    path: '/org-settings/entities',
    visibleTo: ['org'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="5.5" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8.5" y="2.5" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M3.5 5.5V4a1 1 0 011-1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'access-permissions',
    label: 'Access & Permissions',
    path: '/org-settings/access-permissions',
    visibleTo: ['org'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 13c0-2.485 2.015-4.5 4.5-4.5S10 10.515 10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M11 7l1.5 1.5L15 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function OrgSettingsShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { viewAs } = useRoleView();

  const visibleSections = ALL_SECTIONS.filter(s => s.visibleTo.includes(viewAs));
  const firstSection = visibleSections[0];

  if (!firstSection) return <Navigate to="/employees/list" replace />;

  if (location.pathname === '/org-settings' || location.pathname === '/org-settings/') {
    return <Navigate to={firstSection.path} replace />;
  }

  const currentSection = ALL_SECTIONS.find(s => location.pathname.startsWith(s.path));
  if (currentSection && !currentSection.visibleTo.includes(viewAs)) {
    return <Navigate to={firstSection.path} replace />;
  }

  return (
    <div style={{
      flex: 1,
      overflow: 'auto',
      background: 'var(--bg)',
      position: 'relative',
    }}>

      {/* Close × */}
      <button
        onClick={() => navigate('/employees/list')}
        title="Close settings"
        style={{
          position: 'fixed', top: 64, right: 28, zIndex: 30,
          width: 30, height: 30, borderRadius: 7,
          border: '0.5px solid var(--border2)',
          background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text3)',
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Centered layout: nav + content side by side */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '40px 32px',
        display: 'flex',
        gap: 48,
        alignItems: 'flex-start',
      }}>

        {/* Nav block */}
        <div style={{ width: 200, flexShrink: 0 }}>

          {/* Company */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 24 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7, flexShrink: 0,
              background: 'linear-gradient(135deg, #5B4FD4, #6C2E9A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M7 2L2 5v4l5 3 5-3V5L7 2z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
                Acme Corp
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: 'var(--text3)', marginTop: 1 }}>
                3 entities
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9.5,
              color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em',
              padding: '0 8px 8px',
            }}>
              Settings
            </div>
            {visibleSections.map(section => {
              const isActive = location.pathname.startsWith(section.path);
              return (
                <button
                  key={section.id}
                  onClick={() => navigate(section.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 8px', borderRadius: 6, width: '100%',
                    border: 'none', textAlign: 'left', cursor: 'pointer',
                    background: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                    color: isActive ? 'var(--text)' : 'var(--text2)',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: 13, transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ flexShrink: 0, display: 'flex', color: isActive ? 'var(--text)' : 'var(--text3)' }}>
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
