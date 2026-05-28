import { Outlet, useNavigate, NavLink } from 'react-router-dom';

interface OverlaySection {
  id: string;
  label: string;
  path: string;
}

interface Props {
  title: string;
  icon: React.ReactNode;
  sections?: OverlaySection[];
}

export function OverlayShell({ title, icon, sections }: Props) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/employees/list');
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Sub-header */}
      <div style={{
        height: 48,
        background: 'var(--surface)',
        borderBottom: '0.5px solid var(--border2)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        flexShrink: 0,
      }}>
        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text2)' }}>
          {icon}
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{title}</span>
        </div>

        {/* Section tabs */}
        {sections && sections.length > 1 && (
          <>
            <div style={{ width: '0.5px', height: 16, background: 'var(--border2)' }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {sections.map(s => (
                <NavLink
                  key={s.id}
                  to={s.path}
                  style={({ isActive }) => ({
                    padding: '5px 11px',
                    borderRadius: 5,
                    textDecoration: 'none',
                    fontSize: 12.5,
                    color: isActive ? 'var(--text)' : 'var(--text2)',
                    fontWeight: isActive ? 500 : 400,
                    background: isActive ? 'var(--bg)' : 'transparent',
                    transition: 'all 0.1s',
                  })}
                >
                  {s.label}
                </NavLink>
              ))}
            </div>
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Close */}
        <button
          onClick={handleClose}
          title="Close"
          style={{
            width: 30, height: 30, borderRadius: 6,
            border: '0.5px solid var(--border2)',
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text2)',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
