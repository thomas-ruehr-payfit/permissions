import { useState } from 'react';
import { ASSIGNABLE_ROLES, ROLE_META } from '../../../data/role-access';
import { useUsers } from '../../../context/UsersContext';
import { seedModules } from '../../../data/permissions';
import type { InviteState, StartingPoint } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

export function StepStartingPoint({ invite, setInvite }: Props) {
  const { users } = useUsers();
  const [mode, setMode] = useState<'preset' | 'copy'>(
    invite.startingPoint?.type ?? 'preset'
  );

  const select = (sp: StartingPoint) => {
    const modules = sp.type === 'preset'
      ? seedModules(sp.roleKey)
      : users.find(u => u.id === sp.userId)?.customModules ?? seedModules('hr');
    setInvite(prev => ({ ...prev, startingPoint: sp, customModules: modules }));
  };

  const selectedPreset = invite.startingPoint?.type === 'preset' ? invite.startingPoint.roleKey : null;
  const selectedUser   = invite.startingPoint?.type === 'copy'   ? invite.startingPoint.userId  : null;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        Choose how to set up this person's permissions. You'll be able to adjust everything in the next step.
      </p>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['preset', 'copy'] as const).map(m => {
          const labels = { preset: 'Start from a role preset', copy: 'Copy from another person' };
          const isActive = mode === m;
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                border: `1.5px solid ${isActive ? 'var(--text)' : 'var(--border2)'}`,
                background: isActive ? 'var(--text)' : 'transparent',
                color: isActive ? 'white' : 'var(--text2)',
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                transition: 'all 0.12s',
              }}
            >
              {labels[m]}
            </button>
          );
        })}
      </div>

      {/* Preset: role list */}
      {mode === 'preset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ASSIGNABLE_ROLES.map(key => {
            const m = ROLE_META[key];
            const isSelected = selectedPreset === key;
            return (
              <button
                key={key}
                onClick={() => select({ type: 'preset', roleKey: key })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px', borderRadius: 9, textAlign: 'left', width: '100%',
                  border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`,
                  background: isSelected ? m.bg : 'transparent',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? m.color : 'var(--text)' }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{m.description}</div>
                </div>
                {isSelected && (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7.5" cy="7.5" r="6.5" stroke={m.color} strokeWidth="1.3"/>
                    <path d="M4.5 7.5l2.5 2.5 4-4" stroke={m.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Copy: person list */}
      {mode === 'copy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {users.filter(u => u.status === 'active').map(user => {
            const isSelected = selectedUser === user.id;
            return (
              <button
                key={user.id}
                onClick={() => select({ type: 'copy', userId: user.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 8, textAlign: 'left', width: '100%',
                  border: `1.5px solid ${isSelected ? 'var(--org)' : 'var(--border2)'}`,
                  background: isSelected ? 'var(--org-bg)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,0,0,0.055)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--text2)' }}>
                  {user.avatarInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isSelected ? 500 : 400, color: 'var(--text)' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
                    {user.access.map(p => ROLE_META[p.role]?.label).join(' · ')}
                  </div>
                </div>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'var(--org)' }}>
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
          {users.filter(u => u.status === 'active').length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No active users to copy from.</p>
          )}
        </div>
      )}
    </div>
  );
}
