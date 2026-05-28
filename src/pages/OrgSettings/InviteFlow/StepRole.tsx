import { ASSIGNABLE_ROLES, ROLE_META } from '../../../data/role-access';
import type { InviteState } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

export function StepRole({ invite, setInvite }: Props) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        Each role defines what areas of PayFit this person can access and what they can do.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ASSIGNABLE_ROLES.map(role => {
          const meta = ROLE_META[role];
          const isSelected = invite.selectedRole === role;

          return (
            <button
              key={role}
              onClick={() => setInvite(prev => ({
                ...prev,
                selectedRole: role,
                entityIds: [],
                groupId: null,
                perimeterTab: 'entity',
              }))}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', borderRadius: 8, textAlign: 'left', width: '100%',
                border: `1.5px solid ${isSelected ? meta.color : 'var(--border2)'}`,
                background: isSelected ? meta.bg : 'transparent',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {/* Color dot */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: meta.color, flexShrink: 0,
              }} />

              {/* Role labels */}
              <div style={{ minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? meta.color : 'var(--text)' }}>
                  {meta.label}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  {meta.labelFr}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>
                {meta.description}
              </div>

              {/* Selected check */}
              {isSelected && (
                <div style={{ flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke={meta.color} strokeWidth="1.3"/>
                    <path d="M5 8l2.5 2.5L11 5.5" stroke={meta.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
