import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';

interface Tab {
  label: string;
  path: string;
  flag?: string;
}

interface Props {
  tabs: Tab[];
}

export function SubPageTabs({ tabs }: Props) {
  const location = useLocation();

  // If we're at the exact parent path, redirect to the first tab
  const isExactParent = !tabs.some(t => location.pathname.startsWith(t.path));
  if (isExactParent && tabs.length > 0) {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '0 36px',
        borderBottom: '0.5px solid var(--border2)',
        background: 'var(--surface)',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={({ isActive }) => ({
              padding: '11px 14px',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--text)' : 'var(--text2)',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid var(--text)' : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.12s',
              flexShrink: 0,
            })}
          >
            {tab.flag && <span style={{ fontSize: 12 }}>{tab.flag}</span>}
            {tab.label}
          </NavLink>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
