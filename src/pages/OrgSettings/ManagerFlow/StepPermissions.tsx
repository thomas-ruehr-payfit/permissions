import type { ManagerFlowState } from './types';
import type { ManagerPermissions } from '../../../data/mock-users';

interface Props {
  state: ManagerFlowState;
  setState: React.Dispatch<React.SetStateAction<ManagerFlowState>>;
}

export const PERMISSION_GROUPS: {
  key: 'validation' | 'visualisation';
  label: string;
  items: { key: keyof ManagerPermissions; label: string; description: string }[];
}[] = [
  {
    key: 'validation',
    label: 'Validation',
    items: [
      { key: 'validateAbsences',    label: 'Validate absences',       description: 'Approve employee absence requests' },
      { key: 'validateExpenses',    label: 'Validate expense reports', description: 'Approve employee expense claims'  },
      { key: 'validateTimeReports', label: 'Validate time tracking',  description: 'Approve time tracking entries'    },
    ],
  },
  {
    key: 'visualisation',
    label: 'Visualisation',
    items: [
      { key: 'viewAbsences', label: 'View absences', description: 'See employee absence records'   },
      { key: 'viewSalary',   label: 'View salary',   description: 'See employee compensation data' },
    ],
  },
];

export function StepPermissions({ state, setState }: Props) {
  const toggle = (key: keyof ManagerPermissions) => {
    setState(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Define what actions this manager can perform and what data they can see for their reports.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 540 }}>
        {PERMISSION_GROUPS.map(group => (
          <div key={group.key} style={{
            background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden',
          }}>
            {/* Section header */}
            <div style={{
              padding: '12px 20px', borderBottom: '0.5px solid var(--border)',
              fontSize: 13, fontWeight: 600, color: 'var(--text)',
            }}>
              {group.label}
            </div>

            {/* Items */}
            {group.items.map((item, i) => {
              const checked = state.permissions[item.key];
              return (
                <label
                  key={item.key}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: i < group.items.length - 1 ? '0.5px solid var(--border)' : 'none',
                    background: checked ? 'rgba(91,79,212,0.03)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(item.key)} style={{ display: 'none' }} />

                  {/* Custom checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${checked ? 'var(--org)' : 'var(--border2)'}`,
                    background: checked ? 'var(--org)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s',
                  }}>
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{item.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
