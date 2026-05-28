import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useRoleView } from '../../context/RoleViewContext';
import { NAV_SECTIONS } from '../../data/role-access';
import type { NavSection } from '../../data/role-access';
import type { RoleKey } from '../../data/mock-users';

function renderSection(section: NavSection, activeSectionId: string | undefined, viewAs: RoleKey) {
  const isActive = activeSectionId === section.id;
  const visibleSubItems = section.subItems.filter(item => item.visibleTo.includes(viewAs));
  return (
    <div key={section.id}>
      <NavLink
        to={visibleSubItems[0]?.path ?? section.defaultPath}
        style={() => ({
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 9px', borderRadius: 6, textDecoration: 'none',
          color: isActive ? 'var(--text)' : 'var(--text2)',
          background: isActive ? 'var(--bg)' : 'transparent',
          fontWeight: isActive ? 500 : 400, fontSize: 13,
          transition: 'all 0.12s',
        })}
      >
        <span style={{ flexShrink: 0, display: 'flex', opacity: isActive ? 0.8 : 0.5 }}>
          {ICONS[section.icon]}
        </span>
        {section.label}
      </NavLink>
      {isActive && visibleSubItems.length > 0 && (
        <div style={{
          marginTop: 2, marginBottom: 4,
          paddingLeft: 16, borderLeft: '1.5px solid var(--border2)', marginLeft: 16,
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          {visibleSubItems.map(sub => (
            <NavLink
              key={sub.id}
              to={sub.path}
              style={({ isActive: subActive }) => ({
                display: 'block', padding: '5px 10px', borderRadius: 5,
                textDecoration: 'none', fontSize: 12.5,
                color: subActive ? 'var(--text)' : 'var(--text2)',
                fontWeight: subActive ? 500 : 400,
                background: subActive ? 'var(--bg)' : 'transparent',
                transition: 'all 0.1s',
              })}
            >
              {sub.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  settings: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1.5v1M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1M3.4 3.4l.7.7M10.9 10.9l.7.7M3.4 11.6l.7-.7M10.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  integrations: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M11 8.5v1.5M11 10v1.5m0 0H9.5m1.5 0H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  employees: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 13c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  payroll: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M4.5 6.5h6M4.5 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  company: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1.5" y="5.5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 9v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  documents: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M9 1.5H3.5A1 1 0 002.5 2.5v10a1 1 0 001 1h8a1 1 0 001-1V6L9 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9 1.5V6h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5 9h5M5 11.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
};

const BOTTOM_ITEMS = [
  { id: 'integrations', label: 'Integrations', path: '/integrations', icon: 'integrations', visibleTo: ['org', 'entity'] as const },
  { id: 'org-settings', label: 'Organisation Settings', path: '/org-settings', icon: 'settings', visibleTo: ['org', 'entity'] as const },
] as const;

export function Sidebar() {
  const { viewAs } = useRoleView();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleSections = NAV_SECTIONS.filter(s => s.visibleTo.includes(viewAs));
  const visibleBottomItems = BOTTOM_ITEMS.filter(item => item.visibleTo.includes(viewAs as 'org' | 'entity'));

  const activeSection = NAV_SECTIONS.find(s =>
    location.pathname.startsWith('/' + s.id)
  );

  return (
    <aside style={{
      width: 216,
      flexShrink: 0,
      borderRight: '0.5px solid var(--border2)',
      background: 'var(--surface)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #5B4FD4, #6C2E9A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2L2 5v4l5 3 5-3V5L7 2z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text)', lineHeight: 1.2 }}>Acme Corp</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>3 entities</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {visibleSections.map(section => renderSection(section, activeSection?.id, viewAs))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom pinned items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visibleBottomItems.length > 0 && (
            <div style={{ height: '0.5px', background: 'var(--border)', margin: '4px 0 6px' }} />
          )}

          {visibleBottomItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 9px', borderRadius: 6,
                  border: 'none', background: isActive ? 'var(--bg)' : 'transparent',
                  color: isActive ? 'var(--text)' : 'var(--text2)',
                  fontWeight: isActive ? 500 : 400,
                  fontSize: 13, cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ flexShrink: 0, display: 'flex', opacity: isActive ? 0.8 : 0.5 }}>
                  {ICONS[item.icon]}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
