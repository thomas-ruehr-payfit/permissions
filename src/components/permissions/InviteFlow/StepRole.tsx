import type { RoleKey } from '../../../data/mock-users';
import { ASSIGNABLE_ROLES, ROLE_META } from '../../../data/role-access';

interface Props {
  value: RoleKey | null;
  onChange: (role: RoleKey) => void;
}

export function StepRole({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ASSIGNABLE_ROLES.map(role => {
        const meta = ROLE_META[role];
        const selected = value === role;
        return (
          <button
            key={role}
            onClick={() => onChange(role)}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: `1.5px solid ${selected ? meta.color + '66' : 'var(--border2)'}`,
              background: selected ? meta.bg : 'var(--surface)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.12s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: selected ? meta.color : 'var(--text)', marginBottom: 2 }}>
                  {meta.label}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: selected ? meta.color : 'var(--text3)', opacity: 0.8, marginBottom: 6 }}>
                  {meta.labelFr}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                  {meta.description}
                </div>
              </div>
              {selected && (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
