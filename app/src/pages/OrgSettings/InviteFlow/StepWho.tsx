import { ORG_EMPLOYEES } from '../../../data/mock-users';
import type { InviteState } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

const AVATAR_COLORS = ['#5B4FD4', '#0F6E56', '#C04A1E', '#1458A8'];

export function StepWho({ invite, setInvite }: Props) {
  const set = (patch: Partial<InviteState>) =>
    setInvite(prev => ({ ...prev, ...patch }));

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        Choose whether you're inviting someone who's already part of your organisation, or a new external person.
      </p>

      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {(['existing', 'new'] as const).map((type) => {
          const isSelected = invite.whoType === type;
          return (
            <button
              key={type}
              onClick={() => set({ whoType: type, selectedEmployeeId: null })}
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
                {type === 'existing'
                  ? 'Select an existing employee'
                  : 'Invite someone outside the org'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Existing employee list */}
      {invite.whoType === 'existing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Employees
          </div>
          {ORG_EMPLOYEES.map((emp, i) => {
            const isSelected = invite.selectedEmployeeId === emp.id;
            const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <button
                key={emp.id}
                onClick={() => set({ selectedEmployeeId: emp.id })}
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
                  background: `${color}18`, border: `1.5px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 1 }}>
                    {emp.title} · {emp.email}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ marginLeft: 'auto' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="var(--text)" strokeWidth="1.3"/>
                      <path d="M5 8l2.5 2.5L11 5.5" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* New person form */}
      {invite.whoType === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
          <Field
            label="Full name"
            value={invite.newName}
            onChange={v => set({ newName: v })}
            placeholder="e.g. Marie Dupont"
          />
          <Field
            label="Email address"
            value={invite.newEmail}
            onChange={v => set({ newEmail: v })}
            placeholder="e.g. marie.dupont@company.com"
            type="email"
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 6,
          border: '0.5px solid var(--border2)', background: 'var(--surface)',
          fontSize: 13, color: 'var(--text)', outline: 'none',
          fontFamily: 'inherit', boxSizing: 'border-box',
          transition: 'border-color 0.1s',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
      />
    </div>
  );
}
