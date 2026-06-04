import { useState } from 'react';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import { TEAM_MEMBERS } from '../../../data/mock-users';
import type { ManagerPermissions, ManagerReport } from '../../../data/mock-users';
import { ASSIGNABLE_ROLES, ROLE_META, PERIMETER_MODE, BLOCKED_BY_ORG } from '../../../data/role-access';
import type { RoleKey } from '../../../data/mock-users';
import type { InviteState, InvitePair } from './types';
import { EMPTY_PAIR } from './types';
import { useUsers } from '../../../context/UsersContext';

// ── Permission definitions ────────────────────────────────────────────────────

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

const EMPTY_PERMS: ManagerPermissions = {
  validateAbsences: false, validateExpenses: false, validateTimeReports: false,
  viewAbsences: false, viewSalary: false,
};

// ── Conflict helpers ──────────────────────────────────────────────────────────

function isBlocked(role: RoleKey, takenByOthers: string[]): boolean {
  if (takenByOthers.includes(role)) return true;
  if (takenByOthers.includes('org') && BLOCKED_BY_ORG.includes(role)) return true;
  return false;
}

function availableRoles(assigned: string[]): RoleKey[] {
  return ASSIGNABLE_ROLES.filter(r => !isBlocked(r, assigned));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

export function StepAccess({ invite, setInvite }: Props) {
  const assigned = invite.pairs.map(p => p.role).filter(Boolean) as string[];
  const canAddMore = availableRoles(assigned).length > 0;

  const addPair = () =>
    setInvite(prev => ({ ...prev, pairs: [...prev.pairs, { ...EMPTY_PAIR }] }));

  const removePair = (index: number) =>
    setInvite(prev => ({ ...prev, pairs: prev.pairs.filter((_, i) => i !== index) }));

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Assign one or more role + perimeter combinations. Roles are complementary — each can appear once.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {invite.pairs.map((pair, pairIndex) => {
          const takenByOthers = invite.pairs
            .filter((_, i) => i !== pairIndex)
            .map(p => p.role).filter(Boolean) as string[];

          return (
            <div key={pairIndex}>
              {pairIndex > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                  <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
                  <button
                    onClick={() => removePair(pairIndex)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: 0, transition: 'color 0.1s' }}
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
                takenByOthers={takenByOthers}
                onChange={patch => updatePair(setInvite, pairIndex, patch)}
              />
            </div>
          );
        })}

        {canAddMore && (
          <button
            onClick={addPair}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '24px 0 4px', fontSize: 12, color: 'var(--text3)', transition: 'color 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Add another role
          </button>
        )}
      </div>
    </div>
  );
}

// ── Pair editor ───────────────────────────────────────────────────────────────

function PairEditor({
  pair, takenByOthers, onChange,
}: {
  pair: InvitePair;
  takenByOthers: string[];
  onChange: (patch: Partial<InvitePair>) => void;
}) {
  const mode = pair.role ? PERIMETER_MODE[pair.role] : null;

  const toggleEntity = (id: string) =>
    onChange({ entityIds: pair.entityIds.includes(id) ? pair.entityIds.filter(e => e !== id) : [...pair.entityIds, id] });

  const toggleGroup = (id: string) =>
    onChange({ groupIds: pair.groupIds.includes(id) ? pair.groupIds.filter(g => g !== id) : [...pair.groupIds, id] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Role selector */}
      <div>
        <div style={labelStyle}>Role</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ASSIGNABLE_ROLES.map(role => {
            const m = ROLE_META[role];
            const isSelected = pair.role === role;
            const isTaken = isBlocked(role, takenByOthers);
            return (
              <button
                key={role}
                onClick={() => !isTaken && onChange({ role, entityIds: [], groupIds: [], reports: [] })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 14px', borderRadius: 8, textAlign: 'left', width: '100%',
                  border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`,
                  background: isSelected ? m.bg : 'transparent',
                  cursor: isTaken ? 'not-allowed' : 'pointer',
                  opacity: isTaken ? 0.35 : 1,
                  transition: 'all 0.12s',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isSelected ? m.color : 'var(--text)' }}>{m.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{m.labelFr}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>{m.description}</div>
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

      {/* Perimeter — shown once a role is selected */}
      {pair.role && mode === 'fixed-org' && (
        <div style={{ padding: '12px 16px', borderRadius: 7, background: 'var(--bg)', border: '0.5px solid var(--border2)' }}>
          <div style={{ ...labelStyle, marginBottom: 4 }}>Perimeter</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>Org-wide — Organisation Admins have access to all entities.</div>
        </div>
      )}

      {pair.role && mode === 'entity' && (
        <div>
          <div style={labelStyle}>Entities</div>
          <CheckList items={ENTITIES.map(e => ({ id: e.id, label: e.name, sub: `${e.country} · ${e.code}` }))} selected={pair.entityIds} onToggle={toggleEntity} />
        </div>
      )}

      {pair.role && mode === 'entity-and-group' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={labelStyle}>Entities</div>
            <CheckList items={ENTITIES.map(e => ({ id: e.id, label: e.name, sub: `${e.country} · ${e.code}` }))} selected={pair.entityIds} onToggle={toggleEntity} />
          </div>
          <div>
            <div style={labelStyle}>Groups</div>
            <CheckList items={GROUPS.map(g => ({ id: g.id, label: g.name }))} selected={pair.groupIds} onToggle={toggleGroup} />
          </div>
          {pair.entityIds.length === 0 && pair.groupIds.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: -12 }}>Select at least one entity or group.</p>
          )}
        </div>
      )}

      {pair.role && mode === 'individual' && (
        <ManagerPerimeterEditor
          reports={pair.reports}
          onChange={reports => onChange({ reports })}
        />
      )}
    </div>
  );
}

// ── Manager perimeter editor ──────────────────────────────────────────────────

const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

function entityLabel(id: string) {
  const e = ENTITIES.find(en => en.id === id);
  return e ? `${ENTITY_FLAGS[id] ?? ''} ${e.country}` : id;
}

function ManagerPerimeterEditor({
  reports, onChange,
}: {
  reports: ManagerReport[];
  onChange: (reports: ManagerReport[]) => void;
}) {
  const { users } = useUsers();
  const [search, setSearch]           = useState('');
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [filterEntity, setFilterEntity] = useState<string | null>(null);
  const [filterMgr, setFilterMgr]     = useState<'all' | 'with' | 'without'>('all');

  // Build employeeId → current manager name map
  const managerOf: Record<string, string> = {};
  for (const user of users) {
    for (const pair of user.access) {
      if (pair.perimeter.type === 'manager') {
        for (const report of pair.perimeter.reports) {
          managerOf[report.employeeId] = user.name;
        }
      }
    }
  }

  const selectedIds = reports.map(r => r.employeeId);

  const toggleEmployee = (empId: string) => {
    if (selectedIds.includes(empId)) {
      onChange(reports.filter(r => r.employeeId !== empId));
    } else {
      onChange([...reports, { employeeId: empId, permissions: { ...EMPTY_PERMS } }]);
    }
  };

  const togglePerm = (empId: string, key: keyof ManagerPermissions) => {
    onChange(reports.map(r =>
      r.employeeId !== empId ? r : { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
    ));
  };

  const filtered = TEAM_MEMBERS.filter(m => {
    if (search.trim() && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterGroup && !m.groupIds.includes(filterGroup)) return false;
    if (filterEntity && m.entityId !== filterEntity) return false;
    if (filterMgr === 'with' && !managerOf[m.id]) return false;
    if (filterMgr === 'without' && managerOf[m.id]) return false;
    return true;
  });

  return (
    <div>
      <div style={labelStyle}>Direct reports</div>
      <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14, marginTop: -4 }}>
        Select employees this manager is responsible for. Set permissions per person.
      </p>

      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or role…"
        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 12.5, color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10, transition: 'border-color 0.1s' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
      />

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {/* Team filters */}
        {[null, ...GROUPS.map(g => g.id)].map(id => {
          const label = id ? GROUPS.find(g => g.id === id)!.name : 'All teams';
          const active = filterGroup === id;
          return (
            <button key={id ?? 'all'} onClick={() => setFilterGroup(id)}
              style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11.5, border: `1px solid ${active ? 'var(--text)' : 'var(--border2)'}`, background: active ? 'var(--text)' : 'transparent', color: active ? 'white' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.1s', fontFamily: "'DM Mono', monospace" }}>
              {label}
            </button>
          );
        })}

        <div style={{ width: '0.5px', background: 'var(--border2)', margin: '0 2px' }} />

        {/* Entity filters */}
        {[null, 'fr', 'es', 'uk'].map(id => {
          const active = filterEntity === id;
          return (
            <button key={id ?? 'all-ent'} onClick={() => setFilterEntity(id)}
              style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11.5, border: `1px solid ${active ? 'var(--text)' : 'var(--border2)'}`, background: active ? 'var(--text)' : 'transparent', color: active ? 'white' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.1s', fontFamily: "'DM Mono', monospace" }}>
              {id ? ENTITY_FLAGS[id] : 'All entities'}
            </button>
          );
        })}

        <div style={{ width: '0.5px', background: 'var(--border2)', margin: '0 2px' }} />

        {/* Manager filter */}
        {(['all', 'with', 'without'] as const).map(val => {
          const labels = { all: 'All', with: 'Has manager', without: 'No manager' };
          const active = filterMgr === val;
          return (
            <button key={val} onClick={() => setFilterMgr(val)}
              style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11.5, border: `1px solid ${active ? 'var(--text)' : 'var(--border2)'}`, background: active ? 'var(--text)' : 'transparent', color: active ? 'white' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.1s', fontFamily: "'DM Mono', monospace" }}>
              {labels[val]}
            </button>
          );
        })}
      </div>

      {/* Employee list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(member => {
          const report = reports.find(r => r.employeeId === member.id);
          const isChecked = !!report;
          const currentManager = managerOf[member.id];
          const groups = GROUPS.filter(g => member.groupIds.includes(g.id));

          return (
            <div key={member.id} style={{
              borderRadius: 8, border: `1.5px solid ${isChecked ? 'var(--mgr)' : 'var(--border2)'}`,
              background: isChecked ? 'var(--mgr-bg)' : 'transparent', transition: 'all 0.1s', overflow: 'hidden',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isChecked} onChange={() => toggleEmployee(member.id)} style={{ display: 'none' }} />
                <Checkbox checked={isChecked} color="var(--mgr)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{member.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>{member.title}</span>
                    <span style={{ color: 'var(--border2)', fontSize: 11 }}>·</span>
                    <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>{entityLabel(member.entityId)}</span>
                    {groups.length > 0 && (
                      <>
                        <span style={{ color: 'var(--border2)', fontSize: 11 }}>·</span>
                        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>
                          {groups.map(g => g.name).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {currentManager && !isChecked && (
                  <span style={{ fontSize: 10.5, fontFamily: "'DM Mono', monospace", color: '#9A6B00', background: 'rgba(196,140,40,0.1)', padding: '2px 7px', borderRadius: 4, flexShrink: 0 }}>
                    ↳ {currentManager}
                  </span>
                )}
              </label>

              {/* Manager replacement warning */}
              {isChecked && currentManager && (
                <div style={{ margin: '0 14px 10px', padding: '9px 12px', borderRadius: 6, background: 'rgba(196,140,40,0.08)', border: '0.5px solid rgba(196,140,40,0.3)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M7 1.5L1 12.5h12L7 1.5z" stroke="#9A6B00" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M7 5.5v3M7 10v.5" stroke="#9A6B00" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 12, color: '#7A5000', lineHeight: 1.4 }}>
                    Currently managed by <strong>{currentManager}</strong>. Assigning them here will replace their current manager.
                  </span>
                </div>
              )}

              {/* Inline permissions when checked */}
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
                            <input type="checkbox" checked={active} onChange={() => togglePerm(member.id, perm.key)} style={{ display: 'none' }} />
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
        {filtered.length === 0 && (
          <div style={{ fontSize: 12.5, color: 'var(--text3)', padding: '12px 0' }}>No results</div>
        )}
      </div>
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function CheckList({
  items, selected, onToggle,
}: {
  items: { id: string; label: string; sub?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 420 }}>
      {items.map(item => {
        const isChecked = selected.includes(item.id);
        return (
          <label key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
            border: `1.5px solid ${isChecked ? 'var(--text)' : 'var(--border2)'}`,
            background: isChecked ? 'var(--bg)' : 'transparent', transition: 'all 0.1s',
          }}>
            <input type="checkbox" checked={isChecked} onChange={() => onToggle(item.id)} style={{ display: 'none' }} />
            <Checkbox checked={isChecked} color="var(--text)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
              {item.sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{item.sub}</div>}
            </div>
          </label>
        );
      })}
    </div>
  );
}

function Checkbox({ checked, color }: { checked: boolean; color: string }) {
  return (
    <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${checked ? color : 'var(--border2)'}`, background: checked ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
      {checked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
};
