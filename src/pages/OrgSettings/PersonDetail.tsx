import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext';
import { ROLE_META, ASSIGNABLE_ROLES, PERIMETER_MODE } from '../../data/role-access';
import { ENTITIES, GROUPS } from '../../data/mock-entities';
import type { RoleKey } from '../../data/mock-users';
import type { AccessPair } from '../../data/mock-users';

interface PairEditState {
  role: RoleKey;
  entityIds: string[];
  exclude: boolean;
  groupIds: string[];
  perimeterTab: 'entity' | 'group';
}

function initEdit(access: AccessPair[]): PairEditState[] {
  return access.map(pair => {
    const p = pair.perimeter;
    return {
      role: pair.role,
      entityIds: p.type === 'entity' ? (p.entityIds ?? []) : [],
      exclude: p.exclude ?? false,
      groupIds: p.type === 'group' ? (p.groupIds ?? []) : [],
      perimeterTab: p.type === 'group' ? 'group' : 'entity',
    };
  });
}

export function PersonDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, updateUser, removeUser } = useUsers();

  const user = users.find(u => u.id === userId);

  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState<PairEditState[] | null>(null);

  if (!user) {
    navigate('/org-settings/access-permissions');
    return null;
  }

  const isPending = user.status === 'pending';

  const startEdit = () => {
    setEdit(initEdit(user.access));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEdit(null);
  };

  const saveEdit = () => {
    if (!edit) return;
    const access: AccessPair[] = edit.map(p => {
      let perimeter: AccessPair['perimeter'];
      if (p.role === 'org') {
        perimeter = { type: 'org' };
      } else if (p.perimeterTab === 'group') {
        perimeter = { type: 'group', groupIds: p.groupIds, ...(p.exclude ? { exclude: true } : {}) };
      } else {
        perimeter = { type: 'entity', entityIds: p.entityIds, ...(p.exclude ? { exclude: true } : {}) };
      }
      return { role: p.role, perimeter };
    });
    updateUser(user.id, { access });
    setIsEditing(false);
    setEdit(null);
  };

  const canSave = edit
    ? edit.length > 0 && edit.every(p => {
        if (p.role === 'org') return true;
        if (p.perimeterTab === 'entity') return p.entityIds.length > 0;
        return p.groupIds.length > 0;
      })
    : false;

  const updatePair = (i: number, patch: Partial<PairEditState>) =>
    setEdit(prev => prev ? prev.map((p, idx) => idx === i ? { ...p, ...patch } : p) : prev);

  const addPair = () =>
    setEdit(prev => prev ? [...prev, { role: 'payroll' as RoleKey, entityIds: [], exclude: false, groupIds: [], perimeterTab: 'entity' as const }] : prev);

  const removePair = (i: number) =>
    setEdit(prev => prev && prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const toggleEntity = (pairIndex: number, entityId: string) =>
    setEdit(prev => prev ? prev.map((p, i) => i !== pairIndex ? p : {
      ...p,
      entityIds: p.entityIds.includes(entityId)
        ? p.entityIds.filter(e => e !== entityId)
        : [...p.entityIds, entityId],
    }) : prev);


  return (
    <div>

      {/* Back */}
      <button
        onClick={() => navigate('/org-settings/access-permissions')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12.5, color: 'var(--text2)', padding: '4px 0',
          marginBottom: 24, transition: 'color 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M8.5 2L3.5 6.5l5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Access & Permissions
      </button>

      {/* Person header */}
      <div style={{
        background: 'var(--surface)', border: '0.5px solid var(--border2)',
        borderRadius: 10, padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 16,
      }}>
        {/* Avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(0,0,0,0.055)', border: '1.5px solid rgba(0,0,0,0.09)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600,
          color: 'var(--text2)',
        }}>
          {user.avatarInitials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300,
            color: 'var(--text)', lineHeight: 1.2,
          }}>
            {user.name}
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: 'var(--text3)', marginTop: 3,
          }}>
            {user.email}
          </div>
        </div>

        {/* Status + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: 5,
            background: isPending ? 'rgba(196,140,40,0.08)' : 'rgba(15,110,86,0.08)',
            fontSize: 11.5, fontWeight: 500,
            color: isPending ? '#B8860B' : '#0F6E56',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: isPending ? '#B8860B' : '#0F6E56',
            }} />
            {isPending ? 'Pending' : 'Active'}
          </span>

          {isPending && (
            <button
              onClick={() => {}}
              style={secondaryBtnStyle}
            >
              Resend invite
            </button>
          )}

          <button
            onClick={() => {
              removeUser(user.id);
              navigate('/org-settings/access-permissions');
            }}
            style={{
              ...secondaryBtnStyle,
              color: '#C04A1E',
              borderColor: '#C04A1E33',
            }}
          >
            Revoke access
          </button>
        </div>
      </div>

      {/* Permissions card */}
      <div style={{
        background: 'var(--surface)', border: '0.5px solid var(--border2)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '0.5px solid var(--border)',
        }}>
          <span style={{
            fontSize: 12, fontFamily: "'DM Mono', monospace",
            color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Permissions
          </span>

          {!isEditing ? (
            <button onClick={startEdit} style={editBtnStyle}>
              Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={cancelEdit} style={secondaryBtnStyle}>Cancel</button>
              <button
                onClick={saveEdit}
                disabled={!canSave}
                style={{
                  ...editBtnStyle,
                  background: canSave ? 'var(--text)' : 'var(--border2)',
                  color: canSave ? 'white' : 'var(--text3)',
                  borderColor: 'transparent',
                  cursor: canSave ? 'pointer' : 'default',
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px' }}>
          {!isEditing ? (
            /* Read view */
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {user.access.map((pair, i) => {
                const m = ROLE_META[pair.role];
                const p = pair.perimeter;
                const entityChips = p.type === 'entity'
                  ? (p.entityIds ?? []).map(id => ENTITIES.find(e => e.id === id)).filter(Boolean)
                  : [];
                const groupChips = p.type === 'group'
                  ? GROUPS.filter(g => (p.groupIds ?? []).includes(g.id))
                  : [];

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 20,
                    padding: i === 0 ? '0 0 16px' : '16px 0',
                    borderTop: i > 0 ? '0.5px solid var(--border)' : 'none',
                  }}>
                    {/* Role name */}
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--text)',
                      minWidth: 130, flexShrink: 0, paddingTop: 3,
                    }}>
                      {m.label}
                    </div>

                    {/* Perimeter chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.type === 'org' && (
                        <span style={perimChipStyle}>Org-wide</span>
                      )}
                      {p.type === 'entity' && p.exclude && (
                        <span style={{ ...perimChipStyle, color: 'var(--text2)', fontStyle: 'italic' }}>All except</span>
                      )}
                      {entityChips.map(entity => (
                        <span key={entity!.id} style={perimChipStyle}>
                          <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
                            {ENTITY_FLAGS[entity!.id] ?? '🏳️'}
                          </span>
                          {entity!.name}
                        </span>
                      ))}
                      {p.type === 'group' && p.exclude && (
                        <span style={{ ...perimChipStyle, color: 'var(--text2)', fontStyle: 'italic' }}>All except</span>
                      )}
                      {groupChips.map(group => (
                        <span key={group.id} style={perimChipStyle}>
                          <span style={{
                            width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                            background: 'var(--border2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <circle cx="4" cy="3.5" r="1.8" stroke="var(--text2)" strokeWidth="1.1"/>
                              <path d="M1 9c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="var(--text2)" strokeWidth="1.1" strokeLinecap="round"/>
                              <circle cx="8" cy="3.5" r="1.4" stroke="var(--text2)" strokeWidth="1"/>
                              <path d="M8 6.2c1.1.3 2 1.3 2 2.8" stroke="var(--text2)" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </span>
                          {group.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Edit view */
            <div style={{ display: 'flex', flexDirection: 'column' }}>

              {edit && edit.map((pair, pairIndex) => {
                const pSkipPerimeter = pair.role === 'org';
                const pShowTabs = PERIMETER_MODE[pair.role] === 'entity-or-group';

                return (
                  <div key={pairIndex}>
                    {/* Divider between pairs */}
                    {pairIndex > 0 && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        margin: '20px 0',
                      }}>
                        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                        <button
                          onClick={() => removePair(pairIndex)}
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: pairIndex === 0 ? 0 : 0 }}>
                      {/* Role */}
                      <div>
                        <div style={{ ...fieldLabelStyle, marginBottom: 10 }}>Role</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {ASSIGNABLE_ROLES.map(role => {
                            const m = ROLE_META[role];
                            const isSelected = pair.role === role;
                            return (
                              <button
                                key={role}
                                onClick={() => updatePair(pairIndex, { role, entityIds: [], groupId: null, perimeterTab: 'entity' })}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 12,
                                  padding: '11px 14px', borderRadius: 7, textAlign: 'left', width: '100%',
                                  border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`,
                                  background: isSelected ? m.bg : 'transparent',
                                  cursor: 'pointer', transition: 'all 0.1s',
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

                      {/* Perimeter */}
                      {!pSkipPerimeter && (
                        <div>
                          <div style={{ ...fieldLabelStyle, marginBottom: 10 }}>Perimeter</div>

                          {pShowTabs && (
                            <div style={{ display: 'flex', gap: 2, marginBottom: 14, background: 'var(--bg)', borderRadius: 6, padding: 3, width: 'fit-content', border: '0.5px solid var(--border2)' }}>
                              {(['entity', 'group'] as const).map(tab => (
                                <button
                                  key={tab}
                                  onClick={() => updatePair(pairIndex, { perimeterTab: tab, entityIds: [], groupIds: [], exclude: false })}
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

                          {/* Include / Exclude toggle */}
                          <div style={{ display: 'flex', gap: 2, marginBottom: 14, background: 'var(--bg)', borderRadius: 6, padding: 3, width: 'fit-content', border: '0.5px solid var(--border2)' }}>
                            {([false, true] as const).map(excl => (
                              <button
                                key={String(excl)}
                                onClick={() => updatePair(pairIndex, { exclude: excl, entityIds: [], groupIds: [] })}
                                style={{
                                  padding: '5px 14px', borderRadius: 4, border: 'none',
                                  background: pair.exclude === excl ? 'var(--surface)' : 'transparent',
                                  fontSize: 12, fontWeight: pair.exclude === excl ? 500 : 400,
                                  color: pair.exclude === excl ? 'var(--text)' : 'var(--text2)',
                                  cursor: 'pointer', transition: 'all 0.1s',
                                  boxShadow: pair.exclude === excl ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
                                }}
                              >
                                {excl ? 'All except…' : 'Include'}
                              </button>
                            ))}
                          </div>

                          {pair.perimeterTab === 'entity' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {ENTITIES.map(entity => {
                                const isChecked = pair.entityIds.includes(entity.id);
                                return (
                                  <label key={entity.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 14px', borderRadius: 7, cursor: 'pointer',
                                    border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                                    background: isChecked ? 'var(--bg)' : 'transparent',
                                    transition: 'all 0.1s',
                                  }}>
                                    <input type="checkbox" checked={isChecked} onChange={() => toggleEntity(pairIndex, entity.id)} style={{ display: 'none' }} />
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
                                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{entity.country} · {entity.code}</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {pair.perimeterTab === 'group' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {GROUPS.map(group => {
                                const isChecked = pair.groupIds.includes(group.id);
                                const toggle = () => updatePair(pairIndex, {
                                  groupIds: isChecked
                                    ? pair.groupIds.filter(g => g !== group.id)
                                    : [...pair.groupIds, group.id],
                                });
                                return (
                                  <label key={group.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '10px 14px', borderRadius: 7, cursor: 'pointer',
                                    border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
                                    background: isChecked ? 'var(--bg)' : 'transparent',
                                    transition: 'all 0.1s',
                                  }}>
                                    <input type="checkbox" checked={isChecked} onChange={toggle} style={{ display: 'none' }} />
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

                      {pSkipPerimeter && (
                        <div style={{
                          padding: '12px 16px', borderRadius: 7,
                          background: 'var(--bg)', border: '0.5px solid var(--border2)',
                        }}>
                          <div style={{ ...fieldLabelStyle, marginBottom: 4 }}>Perimeter</div>
                          <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                            Org-wide — Organisation Admins have access to all entities.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add another role — de-emphasised */}
              <button
                onClick={addPair}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '20px 0 4px',
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
          )}
        </div>
      </div>
    </div>
  );
}

const ENTITY_FLAGS: Record<string, string> = {
  fr: '🇫🇷',
  es: '🇪🇸',
  uk: '🇬🇧',
};

const perimChipStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '4px 10px 4px 5px', borderRadius: 6,
  background: 'var(--bg)', border: '0.5px solid var(--border2)',
  fontSize: 12.5, color: 'var(--text)',
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace",
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text2)', transition: 'all 0.1s',
};

const editBtnStyle: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text)', fontWeight: 500,
  transition: 'all 0.1s',
};
