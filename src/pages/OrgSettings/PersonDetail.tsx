import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext';
import { ROLE_META, ASSIGNABLE_ROLES, PERIMETER_MODE, BLOCKED_BY_ORG } from '../../data/role-access';
import { ENTITIES, GROUPS } from '../../data/mock-entities';
import { TEAM_MEMBERS } from '../../data/mock-users';
import type { RoleKey, AccessPair, ManagerPermissions, ManagerReport } from '../../data/mock-users';

const ENTITY_FLAGS_D: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

// ── Permission defs ───────────────────────────────────────────────────────────

const PERM_GROUPS: { label: string; items: { key: keyof ManagerPermissions; label: string; description: string }[] }[] = [
  {
    label: 'Validation',
    items: [
      { key: 'validateAbsences',    label: 'Validate absences',       description: 'Approve employee absence requests' },
      { key: 'validateExpenses',    label: 'Validate expense reports', description: 'Approve employee expense claims'   },
      { key: 'validateTimeReports', label: 'Validate time tracking',  description: 'Approve time tracking entries'     },
    ],
  },
  {
    label: 'Visualisation',
    items: [
      { key: 'viewAbsences', label: 'View absences', description: 'See employee absence records'   },
      { key: 'viewSalary',   label: 'View salary',   description: 'See employee compensation data' },
    ],
  },
];

// Flat list for read view
const PERM_DEFS = PERM_GROUPS.flatMap(g => g.items);

const EMPTY_PERMS: ManagerPermissions = { validateAbsences: false, validateExpenses: false, validateTimeReports: false, viewAbsences: false, viewSalary: false };
const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

// ── Edit state ────────────────────────────────────────────────────────────────

interface PairEditState {
  role: RoleKey;
  entityIds: string[];
  groupIds: string[];
  reports: ManagerReport[];
}

function initEdit(access: AccessPair[]): PairEditState[] {
  return access.map(pair => {
    const p = pair.perimeter;
    return {
      role: pair.role,
      entityIds: (p.type === 'entity' || p.type === 'entity-group') ? p.entityIds : [],
      groupIds: p.type === 'entity-group' ? p.groupIds : [],
      reports: p.type === 'manager' ? p.reports : [],
    };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PersonDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, updateUser, removeUser } = useUsers();

  const user = users.find(u => u.id === userId);
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState<PairEditState[] | null>(null);
  const [mgrSearch, setMgrSearch]           = useState('');
  const [mgrFilterGroup, setMgrFilterGroup] = useState<string | null>(null);
  const [mgrFilterEntity, setMgrFilterEntity] = useState<string | null>(null);

  if (!user) { navigate('/org-settings/access-permissions'); return null; }

  const isPending = user.status === 'pending';

  const startEdit = () => { setEdit(initEdit(user.access)); setIsEditing(true); };
  const cancelEdit = () => { setIsEditing(false); setEdit(null); };

  const saveEdit = () => {
    if (!edit) return;
    const access: AccessPair[] = edit.map(p => {
      let perimeter: AccessPair['perimeter'];
      if (p.role === 'org')         perimeter = { type: 'org' };
      else if (p.role === 'mgr')    perimeter = { type: 'manager', reports: p.reports };
      else if (p.role === 'hr')     perimeter = { type: 'entity-group', entityIds: p.entityIds, groupIds: p.groupIds };
      else                          perimeter = { type: 'entity', entityIds: p.entityIds };
      return { role: p.role, perimeter };
    });
    updateUser(user.id, { access });
    setIsEditing(false); setEdit(null);
  };

  const canSave = edit
    ? edit.length > 0 && edit.every(p => {
        if (p.role === 'org') return true;
        if (p.role === 'mgr') return p.reports.length > 0;
        if (p.role === 'hr')  return p.entityIds.length > 0 || p.groupIds.length > 0;
        return p.entityIds.length > 0;
      })
    : false;

  const updatePair = (i: number, patch: Partial<PairEditState>) =>
    setEdit(prev => prev ? prev.map((p, idx) => idx === i ? { ...p, ...patch } : p) : prev);

  const addPair = () =>
    setEdit(prev => prev ? [...prev, { role: 'payroll' as RoleKey, entityIds: [], groupIds: [], reports: [] }] : prev);

  const removePair = (i: number) =>
    setEdit(prev => prev && prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const toggleEntity = (pairIdx: number, id: string) =>
    setEdit(prev => prev ? prev.map((p, i) => i !== pairIdx ? p : {
      ...p, entityIds: p.entityIds.includes(id) ? p.entityIds.filter(e => e !== id) : [...p.entityIds, id],
    }) : prev);

  const toggleGroup = (pairIdx: number, id: string) =>
    setEdit(prev => prev ? prev.map((p, i) => i !== pairIdx ? p : {
      ...p, groupIds: p.groupIds.includes(id) ? p.groupIds.filter(g => g !== id) : [...p.groupIds, id],
    }) : prev);

  const toggleReport = (pairIdx: number, empId: string) =>
    setEdit(prev => prev ? prev.map((p, i) => {
      if (i !== pairIdx) return p;
      const has = p.reports.some(r => r.employeeId === empId);
      return { ...p, reports: has ? p.reports.filter(r => r.employeeId !== empId) : [...p.reports, { employeeId: empId, permissions: { ...EMPTY_PERMS } }] };
    }) : prev);

  const toggleReportPerm = (pairIdx: number, empId: string, key: keyof ManagerPermissions) =>
    setEdit(prev => prev ? prev.map((p, i) => i !== pairIdx ? p : {
      ...p,
      reports: p.reports.map(r => r.employeeId !== empId ? r : { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }),
    }) : prev);

  // Conflict logic
  const assignedRoles = edit ? edit.map(p => p.role) : [];
  const hasOrg = assignedRoles.includes('org');
  const canAddMore = edit ? ASSIGNABLE_ROLES.some(r => {
    if (assignedRoles.includes(r)) return false;
    if (hasOrg && BLOCKED_BY_ORG.includes(r)) return false;
    return true;
  }) : false;

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/org-settings/access-permissions')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: 'var(--text2)', padding: '4px 0', marginBottom: 24, transition: 'color 0.1s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M8.5 2L3.5 6.5l5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Access & Permissions
      </button>

      {/* Person header */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,0,0,0.055)', border: '1.5px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>
          {user.avatarInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: 'var(--text)', lineHeight: 1.2 }}>{user.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{user.email}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 5, background: isPending ? 'rgba(196,140,40,0.08)' : 'rgba(15,110,86,0.08)', fontSize: 11.5, fontWeight: 500, color: isPending ? '#B8860B' : '#0F6E56' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: isPending ? '#B8860B' : '#0F6E56' }} />
            {isPending ? 'Pending' : 'Active'}
          </span>
          {isPending && <button style={secondaryBtn}>Resend invite</button>}
          <button onClick={() => { removeUser(user.id); navigate('/org-settings/access-permissions'); }} style={{ ...secondaryBtn, color: '#C04A1E', borderColor: '#C04A1E33' }}>
            Revoke access
          </button>
        </div>
      </div>

      {/* Permissions card */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Permissions</span>
          {!isEditing ? (
            <button onClick={startEdit} style={editBtn}>Edit</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={cancelEdit} style={secondaryBtn}>Cancel</button>
              <button onClick={saveEdit} disabled={!canSave} style={{ ...editBtn, background: canSave ? 'var(--text)' : 'var(--border2)', color: canSave ? 'white' : 'var(--text3)', borderColor: 'transparent', cursor: canSave ? 'pointer' : 'default' }}>Save</button>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px' }}>

          {/* ── READ VIEW ── */}
          {!isEditing && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {user.access.map((pair, i) => {
                const m = ROLE_META[pair.role];
                const p = pair.perimeter;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: i === 0 ? '0 0 16px' : '16px 0', borderTop: i > 0 ? '0.5px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', minWidth: 130, flexShrink: 0, paddingTop: 3 }}>{m.label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {p.type === 'org' && <span style={chipStyle}>Org-wide</span>}

                      {p.type === 'entity' && p.entityIds.map(id => {
                        const e = ENTITIES.find(en => en.id === id);
                        return e && (
                          <span key={id} style={chipStyle}>
                            <span style={{ fontSize: 15, lineHeight: 1 }}>{ENTITY_FLAGS[e.id] ?? '🏳️'}</span>
                            {e.name}
                          </span>
                        );
                      })}

                      {p.type === 'entity-group' && (
                        <>
                          {p.entityIds.map(id => {
                            const e = ENTITIES.find(en => en.id === id);
                            return e && <span key={id} style={chipStyle}><span style={{ fontSize: 15, lineHeight: 1 }}>{ENTITY_FLAGS[e.id] ?? '🏳️'}</span>{e.name}</span>;
                          })}
                          {p.groupIds.map(id => {
                            const g = GROUPS.find(gr => gr.id === id);
                            return g && <span key={id} style={chipStyle}><GroupIcon />{g.name}</span>;
                          })}
                        </>
                      )}

                      {p.type === 'manager' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                          {p.reports.map(report => {
                            const member = TEAM_MEMBERS.find(m => m.id === report.employeeId);
                            if (!member) return null;
                            const enabled = PERM_DEFS.filter(d => report.permissions[d.key]);
                            return (
                              <div key={report.employeeId} style={{ border: '0.5px solid var(--border2)', borderRadius: 7, overflow: 'hidden' }}>
                                <div style={{ padding: '9px 12px', background: 'var(--bg)', borderBottom: enabled.length > 0 ? '0.5px solid var(--border)' : 'none' }}>
                                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{member.name}</div>
                                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{member.title}</div>
                                </div>
                                {enabled.length > 0 && (
                                  <div style={{ padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                    {enabled.map(d => (
                                      <span key={d.key} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: 'var(--text2)', padding: '2px 7px', borderRadius: 3, background: 'var(--bg)', border: '0.5px solid var(--border2)' }}>
                                        {d.label}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {enabled.length === 0 && (
                                  <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text3)' }}>No permissions granted</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── EDIT VIEW ── */}
          {isEditing && edit && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {edit.map((pair, pairIndex) => {
                const mode = PERIMETER_MODE[pair.role];
                const takenByOthers = edit.filter((_, i) => i !== pairIndex).map(p => p.role);
                const isRoleBlocked = (role: RoleKey) =>
                  takenByOthers.includes(role) || (takenByOthers.includes('org') && BLOCKED_BY_ORG.includes(role));

                return (
                  <div key={pairIndex}>
                    {pairIndex > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                        <button onClick={() => removePair(pairIndex)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 0, transition: 'color 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#C04A1E')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
                          Remove
                        </button>
                        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {/* Role */}
                      <div>
                        <div style={{ ...fieldLabel, marginBottom: 10 }}>Role</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {ASSIGNABLE_ROLES.map(role => {
                            const m = ROLE_META[role];
                            const isSelected = pair.role === role;
                            const isTaken = isRoleBlocked(role);
                            return (
                              <button key={role}
                                onClick={() => !isTaken && updatePair(pairIndex, { role, entityIds: [], groupIds: [], reports: [] })}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 7, textAlign: 'left', width: '100%', border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`, background: isSelected ? m.bg : 'transparent', cursor: isTaken ? 'not-allowed' : 'pointer', opacity: isTaken ? 0.35 : 1, transition: 'all 0.1s' }}
                              >
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                                <div style={{ minWidth: 160 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? m.color : 'var(--text)' }}>{m.label}</div>
                                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{m.labelFr}</div>
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{m.description}</div>
                                {isSelected && <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}><circle cx="7.5" cy="7.5" r="6.5" stroke={m.color} strokeWidth="1.3"/><path d="M4.5 7.5l2.5 2.5 4-4" stroke={m.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Perimeter */}
                      {mode === 'fixed-org' && (
                        <div style={{ padding: '12px 16px', borderRadius: 7, background: 'var(--bg)', border: '0.5px solid var(--border2)' }}>
                          <div style={{ ...fieldLabel, marginBottom: 4 }}>Perimeter</div>
                          <div style={{ fontSize: 13, color: 'var(--text2)' }}>Org-wide — Organisation Admins have access to all entities.</div>
                        </div>
                      )}

                      {mode === 'entity' && (
                        <div>
                          <div style={{ ...fieldLabel, marginBottom: 10 }}>Entities</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {ENTITIES.map(entity => {
                              const isChecked = pair.entityIds.includes(entity.id);
                              return (
                                <label key={entity.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`, background: isChecked ? 'var(--bg)' : 'transparent', transition: 'all 0.1s' }}>
                                  <input type="checkbox" checked={isChecked} onChange={() => toggleEntity(pairIndex, entity.id)} style={{ display: 'none' }} />
                                  <EditCheckbox checked={isChecked} />
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{entity.name}</div>
                                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{entity.country} · {entity.code}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {mode === 'entity-and-group' && (
                        <>
                          <div>
                            <div style={{ ...fieldLabel, marginBottom: 10 }}>Entities</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {ENTITIES.map(entity => {
                                const isChecked = pair.entityIds.includes(entity.id);
                                return (
                                  <label key={entity.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`, background: isChecked ? 'var(--bg)' : 'transparent', transition: 'all 0.1s' }}>
                                    <input type="checkbox" checked={isChecked} onChange={() => toggleEntity(pairIndex, entity.id)} style={{ display: 'none' }} />
                                    <EditCheckbox checked={isChecked} />
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{entity.name}</div>
                                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{entity.country} · {entity.code}</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <div style={{ ...fieldLabel, marginBottom: 10 }}>Groups</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {GROUPS.map(group => {
                                const isChecked = pair.groupIds.includes(group.id);
                                return (
                                  <label key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`, background: isChecked ? 'var(--bg)' : 'transparent', transition: 'all 0.1s' }}>
                                    <input type="checkbox" checked={isChecked} onChange={() => toggleGroup(pairIndex, group.id)} style={{ display: 'none' }} />
                                    <EditCheckbox checked={isChecked} />
                                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{group.name}</div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      {mode === 'individual' && (
                        <div>
                          <div style={{ ...fieldLabel, marginBottom: 4 }}>Direct reports</div>
                          <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>Select employees and set per-person permissions.</p>

                          {/* Search + filters */}
                          <input value={mgrSearch} onChange={e => setMgrSearch(e.target.value)} placeholder="Search by name or role…"
                            style={{ width: '100%', maxWidth: 560, padding: '7px 10px', borderRadius: 5, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 12, color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 8, transition: 'border-color 0.1s' }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
                          />
                          {/* Filters */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                            {[null, ...GROUPS.map(g => g.id)].map(id => {
                              const label = id ? GROUPS.find(g => g.id === id)!.name : 'All teams';
                              const active = mgrFilterGroup === id;
                              return <button key={id ?? 'all'} onClick={() => setMgrFilterGroup(id)} style={filterPill(active)}>{label}</button>;
                            })}
                            <div style={{ width: '0.5px', background: 'var(--border2)', margin: '0 2px' }} />
                            {[null, 'fr', 'es', 'uk'].map(id => {
                              const active = mgrFilterEntity === id;
                              return <button key={id ?? 'all-e'} onClick={() => setMgrFilterEntity(id)} style={filterPill(active)}>{id ? ENTITY_FLAGS_D[id] : 'All entities'}</button>;
                            })}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 560 }}>
                            {TEAM_MEMBERS.filter(m => {
                              if (mgrSearch.trim() && !m.name.toLowerCase().includes(mgrSearch.toLowerCase()) && !m.title.toLowerCase().includes(mgrSearch.toLowerCase())) return false;
                              if (mgrFilterGroup && !m.groupIds.includes(mgrFilterGroup)) return false;
                              if (mgrFilterEntity && m.entityId !== mgrFilterEntity) return false;
                              return true;
                            }).map(member => {
                              const report = pair.reports.find(r => r.employeeId === member.id);
                              const isChecked = !!report;
                              const groups = GROUPS.filter(g => member.groupIds.includes(g.id));
                              // Find if another user (not the current one being edited) manages this member
                              const existingManager = users
                                .filter(u => u.id !== user.id)
                                .find(u => u.access.some(a => a.perimeter.type === 'manager' && a.perimeter.reports.some(r => r.employeeId === member.id)));
                              return (
                                <div key={member.id} style={{ borderRadius: 8, border: `1.5px solid ${isChecked ? 'var(--mgr)' : 'var(--border2)'}`, background: isChecked ? 'var(--mgr-bg)' : 'transparent', transition: 'all 0.1s', overflow: 'hidden' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={isChecked} onChange={() => toggleReport(pairIndex, member.id)} style={{ display: 'none' }} />
                                    <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${isChecked ? 'var(--mgr)' : 'var(--border2)'}`, background: isChecked ? 'var(--mgr)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
                                      {isChecked && <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 3.5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{member.name}</div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, flexWrap: 'wrap' }}>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{member.title}</span>
                                        <span style={{ color: 'var(--border2)', fontSize: 10 }}>·</span>
                                        <span style={{ fontSize: 11 }}>{ENTITY_FLAGS_D[member.entityId] ?? ''}</span>
                                        {groups.length > 0 && (
                                          <>
                                            <span style={{ color: 'var(--border2)', fontSize: 10 }}>·</span>
                                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{groups.map(g => g.name).join(', ')}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {existingManager && !isChecked && (
                                      <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: '#9A6B00', background: 'rgba(196,140,40,0.1)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                                        ↳ {existingManager.name}
                                      </span>
                                    )}
                                  </label>
                                  {isChecked && existingManager && (
                                    <div style={{ margin: '0 14px 10px', padding: '9px 12px', borderRadius: 6, background: 'rgba(196,140,40,0.08)', border: '0.5px solid rgba(196,140,40,0.3)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                                        <path d="M7 1.5L1 12.5h12L7 1.5z" stroke="#9A6B00" strokeWidth="1.2" strokeLinejoin="round"/>
                                        <path d="M7 5.5v3M7 10v.5" stroke="#9A6B00" strokeWidth="1.2" strokeLinecap="round"/>
                                      </svg>
                                      <span style={{ fontSize: 12, color: '#7A5000', lineHeight: 1.4 }}>
                                        Currently managed by <strong>{existingManager.name}</strong>. Assigning them here will replace their current manager.
                                      </span>
                                    </div>
                                  )}
                                  {isChecked && report && (
                                    <div style={{ borderTop: '0.5px solid var(--border)' }}>
                                      {PERM_GROUPS.map((group, gi) => (
                                        <div key={group.label}>
                                          <div style={{ padding: '8px 14px 4px', fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', borderTop: gi > 0 ? '0.5px solid var(--border)' : 'none' }}>
                                            {group.label}
                                          </div>
                                          {group.items.map(perm => {
                                            const active = report.permissions[perm.key];
                                            return (
                                              <label key={perm.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', cursor: 'pointer', borderTop: '0.5px solid var(--border)', background: active ? 'rgba(108,46,154,0.04)' : 'transparent', transition: 'background 0.1s' }}>
                                                <input type="checkbox" checked={active} onChange={() => toggleReportPerm(pairIndex, member.id, perm.key)} style={{ display: 'none' }} />
                                                <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `1.5px solid ${active ? 'var(--mgr)' : 'var(--border2)'}`, background: active ? 'var(--mgr)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
                                                  {active && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                </div>
                                                <div>
                                                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{perm.label}</div>
                                                  <div style={{ fontSize: 11.5, color: 'var(--text2)', marginTop: 1 }}>{perm.description}</div>
                                                </div>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {canAddMore && (
                <button onClick={addPair} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '20px 0 4px', fontSize: 12, color: 'var(--text3)', transition: 'color 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  Add another role
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function GroupIcon() {
  return (
    <span style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, background: 'var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="4" cy="3.5" r="1.8" stroke="var(--text2)" strokeWidth="1.1"/>
        <path d="M1 9c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="var(--text2)" strokeWidth="1.1" strokeLinecap="round"/>
        <circle cx="8" cy="3.5" r="1.4" stroke="var(--text2)" strokeWidth="1"/>
        <path d="M8 6.2c1.1.3 2 1.3 2 2.8" stroke="var(--text2)" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

function EditCheckbox({ checked }: { checked: boolean }) {
  return (
    <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${checked ? 'var(--text)' : 'var(--border2)'}`, background: checked ? 'var(--text)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
      {checked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

const filterPill = (active: boolean): React.CSSProperties => ({
  padding: '3px 10px', borderRadius: 20, fontSize: 11.5,
  border: `1px solid ${active ? 'var(--text)' : 'var(--border2)'}`,
  background: active ? 'var(--text)' : 'transparent',
  color: active ? 'white' : 'var(--text2)',
  cursor: 'pointer', transition: 'all 0.1s',
  fontFamily: "'DM Mono', monospace",
});

const chipStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '4px 10px 4px 5px', borderRadius: 6,
  background: 'var(--bg)', border: '0.5px solid var(--border2)',
  fontSize: 12.5, color: 'var(--text)',
};

const fieldLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace",
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const secondaryBtn: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text2)', transition: 'all 0.1s',
};

const editBtn: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text)', fontWeight: 500, transition: 'all 0.1s',
};
