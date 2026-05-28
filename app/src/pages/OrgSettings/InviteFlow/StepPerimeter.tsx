import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import { PERIMETER_MODE } from '../../../data/role-access';
import type { InviteState } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

export function StepPerimeter({ invite, setInvite }: Props) {
  const set = (patch: Partial<InviteState>) =>
    setInvite(prev => ({ ...prev, ...patch }));

  const mode = PERIMETER_MODE[invite.selectedRole!];
  const showTabs = mode === 'entity-or-group';

  const toggleEntity = (id: string) => {
    const next = invite.entityIds.includes(id)
      ? invite.entityIds.filter(e => e !== id)
      : [...invite.entityIds, id];
    set({ entityIds: next });
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        {mode === 'entity-or-group'
          ? 'HR Managers can be scoped to specific entities or to a people group.'
          : 'Select which entities this person will have access to.'}
      </p>

      {/* Tabs for HR Manager */}
      {showTabs && (
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: 'var(--bg)', borderRadius: 7, padding: 3, width: 'fit-content', border: '0.5px solid var(--border2)' }}>
          {(['entity', 'group'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => set({ perimeterTab: tab, entityIds: [], groupId: null })}
              style={{
                padding: '6px 16px', borderRadius: 5, border: 'none',
                background: invite.perimeterTab === tab ? 'var(--surface)' : 'transparent',
                fontSize: 12.5, fontWeight: invite.perimeterTab === tab ? 500 : 400,
                color: invite.perimeterTab === tab ? 'var(--text)' : 'var(--text2)',
                cursor: 'pointer', transition: 'all 0.1s',
                boxShadow: invite.perimeterTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab === 'entity' ? 'By entity' : 'By group'}
            </button>
          ))}
        </div>
      )}

      {/* Entity selection */}
      {invite.perimeterTab === 'entity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          {ENTITIES.map(entity => {
            const isChecked = invite.entityIds.includes(entity.id);
            return (
              <label
                key={entity.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                  background: isChecked ? 'var(--bg)' : 'transparent',
                  transition: 'all 0.1s',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleEntity(entity.id)}
                  style={{ display: 'none' }}
                />
                {/* Custom checkbox */}
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                  background: isChecked ? 'var(--text)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.1s',
                }}>
                  {isChecked && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2.5 2.5 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{entity.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                    {entity.country} · {entity.code}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Group selection */}
      {invite.perimeterTab === 'group' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          {GROUPS.map(group => {
            const isSelected = invite.groupId === group.id;
            return (
              <label
                key={group.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border2)'}`,
                  background: isSelected ? 'var(--bg)' : 'transparent',
                  transition: 'all 0.1s',
                }}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => set({ groupId: group.id })}
                  style={{ display: 'none' }}
                />
                {/* Custom radio */}
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.1s',
                }}>
                  {isSelected && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text)' }} />
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                  {group.name}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
