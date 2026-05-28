import { NavLink, Outlet } from 'react-router-dom';

const SUB_NAV = [
  { label: 'Access & Permissions', path: '/organisation/access' },
];

export function Organisation() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: '0 36px',
        borderBottom: '0.5px solid var(--border2)',
        background: 'var(--surface)',
        display: 'flex',
        gap: 4,
      }}>
        {SUB_NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              padding: '12px 14px',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--text)' : 'var(--text2)',
              textDecoration: 'none',
              borderBottom: isActive ? '2px solid var(--text)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'all 0.12s',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
