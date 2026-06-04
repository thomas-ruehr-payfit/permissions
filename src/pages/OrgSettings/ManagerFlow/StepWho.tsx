import { TEAM_MEMBERS } from '../../../data/mock-users';
import type { ManagerFlowState } from './types';

interface Props {
  state: ManagerFlowState;
  setState: React.Dispatch<React.SetStateAction<ManagerFlowState>>;
}

const set = (setState: Props['setState'], patch: Partial<ManagerFlowState>) =>
  setState(prev => ({ ...prev, ...patch }));

export function StepWho({ state, setState }: Props) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        Choose whether the manager is already part of your organisation, or a new external person.
      </p>

      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {(['existing', 'new'] as const).map(type => {
          const isSelected = state.whoType === type;
          return (
            <button
              key={type}
              onClick={() => set(setState, { whoType: type, selectedEmployeeId: null })}
              style={{
                flex: 1, padding: '14px 16px', borderRadius: 8, textAlign: 'left',
                border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border2)'}`,
                background: isSelected ? 'var(--bg)' : 'var(--surface)',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>
                {type === 'existing' ? 'From this organisation' : 'New person'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                {type === 'existing' ? 'Select an existing employee' : 'Invite someone outside the org'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Existing employee list */}
      {state.whoType === 'existing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={labelStyle}>Employees</div>
          {TEAM_MEMBERS.map(emp => {
            const isSelected = state.selectedEmployeeId === emp.id;
            const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
            return (
              <button
                key={emp.id}
                onClick={() => set(setState, { selectedEmployeeId: emp.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 7, textAlign: 'left', width: '100%',
                  border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--bg)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.1s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(0,0,0,0.055)', border: '1px solid rgba(0,0,0,0.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
                  color: 'var(--text2)',
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 1 }}>
                    {emp.title} · {emp.email}
                  </div>
                </div>
                {isSelected && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="7" stroke="var(--text)" strokeWidth="1.3"/>
                    <path d="M5 8l2.5 2.5L11 5.5" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* New person form */}
      {state.whoType === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
          <Field label="Full name" value={state.newName} onChange={v => set(setState, { newName: v })} placeholder="e.g. Marie Dupont" />
          <Field label="Email address" value={state.newEmail} onChange={v => set(setState, { newEmail: v })} placeholder="e.g. marie@company.com" type="email" />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 6,
          border: '0.5px solid var(--border2)', background: 'var(--surface)',
          fontSize: 13, color: 'var(--text)', outline: 'none',
          fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.1s',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
};
