import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import { ASSIGNABLE_ROLES, ROLE_META, PERIMETER_MODE } from '../../../data/role-access';
import type { InviteState, InvitePair } from './types';
import { EMPTY_PAIR } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

function updatePair(
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>,
  index: number,
  patch: Partial<InvitePair>,
) {
  setInvite(prev => ({
    ...prev,
    pairs: prev.pairs.map((p, i) => i === index ? { ...p, ...patch } : p),
  }));
}

function removePair(
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>,
  index: number,
) {
  setInvite(prev => ({
    ...prev,
    pairs: prev.pairs.filter((_, i) => i !== index),
  }));
}

export function StepAccess({ invite, setInvite }: Props) {
  const addPair = () =>
    setInvite(prev => ({ ...prev, pairs: [...prev.pairs, { ...EMPTY_PAIR }] }));

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Assign one or more role + perimeter combinations to this person.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {invite.pairs.map((pair, pairIndex) => (
          <div key={pairIndex}>
            {pairIndex > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                <button
                  onClick={() => removePair(setInvite, pairIndex)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'DM Mono', monospace", fontSize: 10,
                    color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em',
                    padding: 0, transition: 'color 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#C04A1E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
                >
                  Remove
                </button>
                <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
              </div>
            )}

            <PairEditor
              pair={pair}
              onChange={patch => updatePair(setInvite, pairIndex, patch)}
            />
          </div>
        ))}

        <button
          onClick={addPair}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '24px 0 4px',
            fontSize: 12, color: 'var(--text3)',
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Add another role
        </button>
      </div>
    </div>
  );
}

function PairEditor({ pair, onChange }: { pair: InvitePair; onChange: (patch: Partial<InvitePair>) => void }) {
  const mode = pair.role ? PERIMETER_MODE[pair.role] : null;
  const isOrgRole = pair.role === 'org';
  const showTabs = mode === 'entity-or-group';

  const toggleEntity = (id: string) => {
    const next = pair.entityIds.includes(id)
      ? pair.entityIds.filter(e => e !== id)
      : [...pair.entityIds, id];
    onChange({ entityIds: next });
  };

  const toggleGroup = (id: string) => {
    const next = pair.groupIds.includes(id)
      ? pair.groupIds.filter(g => g !== id)
      : [...pair.groupIds, id];
    onChange({ groupIds: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Role */}
      <div>
        <div style={{ ...labelStyle, marginBottom: 10 }}>Role</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ASSIGNABLE_ROLES.map(role => {
            const m = ROLE_META[role];
            const isSelected = pair.role === role;
            return (
              <button
                key={role}
                onClick={() => onChange({ role, entityIds: [], groupIds: [], perimeterTab: 'entity' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 14px', borderRadius: 8, textAlign: 'left', width: '100%',
                  border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`,
                  background: isSelected ? m.bg : 'transparent',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? m.color : 'var(--text)' }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                    {m.labelFr}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>
                  {m.description}
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
      </div>

      {/* Perimeter — only shown once a role is selected */}
      {pair.role && !isOrgRole && (
        <div>
          <div style={{ ...labelStyle, marginBottom: 10 }}>Perimeter</div>

          {/* Entity / Group tabs (HR only) */}
          {showTabs && (
            <div style={{ display: 'flex', gap: 2, marginBottom: 14, background: 'var(--bg)', borderRadius: 6, padding: 3, width: 'fit-content', border: '0.5px solid var(--border2)' }}>
              {(['entity', 'group'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => onChange({ perimeterTab: tab, entityIds: [], groupIds: [] })}
                  style={{
                    padding: '5px 14px', borderRadius: 4, border: 'none',
                    background: pair.perimeterTab === tab ? 'var(--surface)' : 'transparent',
                    fontSize: 12, fontWeight: pair.perimeterTab === tab ? 500 : 400,
                    color: pair.perimeterTab === tab ? 'var(--text)' : 'var(--text2)',
                    cursor: 'pointer', transition: 'all 0.1s',
                    boxShadow: pair.perimeterTab === tab ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
                  }}
                >
                  {tab === 'entity' ? 'By entity' : 'By group'}
                </button>
              ))}
            </div>
          )}

          {/* Entity selection */}
          {pair.perimeterTab === 'entity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
              {ENTITIES.map(entity => {
                const isChecked = pair.entityIds.includes(entity.id);
                return (
                  <label
                    key={entity.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                      background: isChecked ? 'var(--bg)' : 'transparent',
                      transition: 'all 0.1s',
                    }}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => toggleEntity(entity.id)} style={{ display: 'none' }} />
                    <div style={{
                      width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                      border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                      background: isChecked ? 'var(--text)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}>
                      {isChecked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
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
          {pair.perimeterTab === 'group' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
              {GROUPS.map(group => {
                const isChecked = pair.groupIds.includes(group.id);
                return (
                  <label
                    key={group.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                      background: isChecked ? 'var(--bg)' : 'transparent',
                      transition: 'all 0.1s',
                    }}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => toggleGroup(group.id)} style={{ display: 'none' }} />
                    <div style={{
                      width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                      border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                      background: isChecked ? 'var(--text)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}>
                      {isChecked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{group.name}</div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isOrgRole && (
        <div style={{
          padding: '12px 16px', borderRadius: 7,
          background: 'var(--bg)', border: '0.5px solid var(--border2)',
        }}>
          <div style={{ ...labelStyle, marginBottom: 4 }}>Perimeter</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>
            Org-wide — Organisation Admins have access to all entities.
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace",
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
};
