import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext';
import { useOrgMode, getOrgCopy } from '../../context/OrgModeContext';
import { useDirection } from '../../context/DirectionContext';
import { useCustomRoles } from '../../context/CustomRolesContext';
import { getRoleLabel, ROLE_META, ASSIGNABLE_ROLES } from '../../data/role-access';
import { ROLE_MODULE_DEFAULTS, seedModules } from '../../data/permissions';
import type { CustomRole } from '../../data/permissions';
import { PermissionEditor } from '../../components/permissions/PermissionEditor';
import { ENTITIES, GROUPS } from '../../data/mock-entities';
import { TEAM_MEMBERS } from '../../data/mock-users';
import type { RoleKey } from '../../data/mock-users';

const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

// ── People tab ────────────────────────────────────────────────────────────────

function PeopleTab() {
  const { users } = useUsers();
  const navigate = useNavigate();
  const { orgEnabled } = useOrgMode();
  const copy = getOrgCopy(orgEnabled);

  const active  = users.filter(u => u.status === 'active');
  const pending = users.filter(u => u.status === 'pending');

  return (
    <div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5, color: 'var(--text2)', marginBottom: 20 }}>
        {active.length} active · {pending.length} pending
      </p>

      <div style={{ background: 'var(--surface)', borderRadius: 10, border: '0.5px solid var(--border2)', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px 96px 32px', padding: '10px 20px', borderBottom: '0.5px solid var(--border)', background: 'var(--bg)' }}>
          {['Person', 'Access', 'Status', ''].map(h => (
            <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: h === 'Person' ? 42 : 0 }}>
              {h}
            </div>
          ))}
        </div>

        {users.map((user, idx) => {
          const visibleAccess = orgEnabled
            ? user.access
            : user.access.filter(p => ['org', 'acct', 'mgr'].includes(p.role));
          if (visibleAccess.length === 0) return null;
          const isPending = user.status === 'pending';
          return (
            <div
              key={user.id}
              onClick={() => navigate(`/org-settings/access-permissions/${user.id}`)}
              style={{ display: 'grid', gridTemplateColumns: '1fr 360px 96px 32px', padding: '14px 20px', alignItems: 'center', borderBottom: idx < users.length - 1 ? '0.5px solid var(--border)' : 'none', opacity: isPending ? 0.65 : 1, cursor: 'pointer', transition: 'background 0.1s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; const ch = e.currentTarget.querySelector<SVGElement>('[data-chevron]'); if (ch) ch.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; const ch = e.currentTarget.querySelector<SVGElement>('[data-chevron]'); if (ch) ch.style.color = 'var(--text3)'; }}
            >
              {/* Person */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,0,0,0.055)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 10.5, fontWeight: 600, color: 'var(--text2)' }}>
                  {user.avatarInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
              </div>

              {/* Access */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {visibleAccess.map((pair, i) => {
                  const p = pair.perimeter;
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: orgEnabled ? '1fr 160px' : '1fr' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: '20px' }}>
                        {pair.customRoleId
                          ? pair.customRoleId // We'll display the name via the roles context in the real app; for now show the ID
                          : getRoleLabel(pair.role, orgEnabled)}
                      </div>
                      {orgEnabled && <div style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingLeft: 12 }}>
                        {p.type === 'org' && (
                          <span style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>{copy.orgWide}</span>
                        )}
                        {p.type === 'entity' && p.entityIds.map(id => {
                          const entity = ENTITIES.find(e => e.id === id);
                          return entity ? (
                            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>
                              <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{ENTITY_FLAGS[entity.id] ?? '🏳️'}</span>
                              {entity.name}
                            </div>
                          ) : null;
                        })}
                        {p.type === 'entity-group' && (
                          <>
                            {p.entityIds.map(id => {
                              const entity = ENTITIES.find(e => e.id === id);
                              return entity ? (
                                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>
                                  <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{ENTITY_FLAGS[entity.id] ?? '🏳️'}</span>
                                  {entity.name}
                                </div>
                              ) : null;
                            })}
                            {p.groupIds.map(id => {
                              const group = GROUPS.find(g => g.id === id);
                              return group ? (
                                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>
                                  <svg width="13" height="13" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0, color: 'var(--text3)' }}>
                                    <circle cx="4" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/>
                                    <path d="M1 9c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                                    <circle cx="8" cy="3.5" r="1.4" stroke="currentColor" strokeWidth="1"/>
                                    <path d="M8 6.2c1.1.3 2 1.3 2 2.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                                  </svg>
                                  {group.name}
                                </div>
                              ) : null;
                            })}
                          </>
                        )}
                        {p.type === 'manager' && (
                          p.reports.length === 0
                            ? <span style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: '20px' }}>—</span>
                            : p.reports.slice(0, 3).map(r => {
                              const member = TEAM_MEMBERS.find(m => m.id === r.employeeId);
                              return member ? (
                                <span key={r.employeeId} style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: '20px' }}>{member.name}</span>
                              ) : null;
                            }).concat(
                              p.reports.length > 3
                                ? [<span key="more" style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>+{p.reports.length - 3} more</span>]
                                : []
                            )
                        )}
                      </div>}
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 4, background: isPending ? 'rgba(196,140,40,0.08)' : 'rgba(15,110,86,0.08)', fontSize: 12, fontWeight: 500, color: isPending ? '#9A6B00' : '#0A5C47' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: isPending ? '#9A6B00' : '#0A5C47' }} />
                  {isPending ? 'Pending' : 'Active'}
                </span>
              </div>

              {/* Chevron */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text3)' }}>
                <svg data-chevron width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
            No admins yet — invite someone to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Role inspection modal ─────────────────────────────────────────────────────

function RoleInspectModal({
  role,
  isCustom,
  customRole,
  onClose,
  onEdit,
}: {
  role: RoleKey;
  isCustom: boolean;
  customRole?: CustomRole;
  onClose: () => void;
  onEdit?: () => void;
}) {
  const modules = customRole ? customRole.modules : ROLE_MODULE_DEFAULTS[role];
  const meta = ROLE_META[role];

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--surface)', borderRadius: 12, border: '0.5px solid var(--border2)', width: 480, maxHeight: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              {customRole ? customRole.name : meta.label}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
              {isCustom ? `Custom · Based on ${meta.label}` : 'PayFit built-in role'}
            </div>
          </div>
          {!isCustom && (
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: 4, padding: '2px 7px' }}>
              PayFit
            </span>
          )}
          {isCustom && onEdit && (
            <button onClick={onEdit} style={{ fontSize: 12, color: 'var(--org)', background: 'var(--org-bg)', border: `0.5px solid var(--org)33`, borderRadius: 5, padding: '4px 10px', cursor: 'pointer' }}>
              Edit
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          <PermissionEditor modules={modules} readOnly />
        </div>
      </div>
    </div>
  );
}

// ── Create/edit custom role modal ─────────────────────────────────────────────

function CreateRoleModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: CustomRole;
  onSave: (role: CustomRole) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'meta' | 'permissions'>(initial ? 'permissions' : 'meta');
  const [name, setName] = useState(initial?.name ?? '');
  const [baseKey, setBaseKey] = useState<RoleKey>(initial?.baseRoleKey ?? 'payroll');
  const [modules, setModules] = useState(initial?.modules ?? seedModules('payroll'));

  const handleBaseChange = (key: RoleKey) => {
    setBaseKey(key);
    setModules(seedModules(key));
  };

  const save = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? `cr_${Date.now()}`,
      name: name.trim(),
      description: `Custom role based on ${ROLE_META[baseKey].label}`,
      baseRoleKey: baseKey,
      modules,
    });
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--surface)', borderRadius: 12, border: '0.5px solid var(--border2)', width: step === 'meta' ? 420 : 520, maxHeight: 'calc(100vh - 32px)', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{initial ? 'Edit role' : 'New custom role'}</div>
            {step === 'permissions' && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Based on {ROLE_META[baseKey].label}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {step === 'meta' ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Name */}
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Role name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Finance Controller"
                autoFocus
                style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '0.5px solid var(--border2)', background: 'var(--bg)', fontSize: 13, color: 'var(--text)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.1s' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
              />
            </div>

            {/* Base role */}
            <div>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>
                Start from template
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ASSIGNABLE_ROLES.map(key => {
                  const m = ROLE_META[key];
                  const isSelected = baseKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleBaseChange(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 7, border: `1.5px solid ${isSelected ? m.color : 'var(--border2)'}`, background: isSelected ? m.bg : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s' }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: isSelected ? 500 : 400, color: isSelected ? m.color : 'var(--text)' }}>{m.label}</span>
                      {isSelected && (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginLeft: 'auto' }}>
                          <path d="M2.5 6.5l3 3 5-5" stroke={m.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={!name.trim()}
              onClick={() => setStep('permissions')}
              style={{ padding: '10px', borderRadius: 7, border: 'none', background: name.trim() ? 'var(--text)' : 'var(--border2)', color: name.trim() ? 'white' : 'var(--text3)', fontSize: 13, fontWeight: 500, cursor: name.trim() ? 'pointer' : 'default', transition: 'all 0.1s' }}
            >
              Configure permissions →
            </button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              <PermissionEditor modules={modules} onChange={setModules} />
            </div>
            <div style={{ padding: '14px 20px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {!initial && (
                <button onClick={() => setStep('meta')} style={{ padding: '9px 16px', borderRadius: 7, border: '0.5px solid var(--border2)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}>
                  ← Back
                </button>
              )}
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 7, border: '0.5px solid var(--border2)', background: 'transparent', color: 'var(--text2)', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                disabled={!name.trim()}
                onClick={save}
                style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: name.trim() ? 'var(--text)' : 'var(--border2)', color: name.trim() ? 'white' : 'var(--text3)', fontSize: 13, fontWeight: 500, cursor: name.trim() ? 'pointer' : 'default' }}
              >
                Save role
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Roles tab ─────────────────────────────────────────────────────────────────

function RolesTab() {
  const { customRoles, addRole, updateRole, deleteRole } = useCustomRoles();
  const [inspecting, setInspecting] = useState<{ role: RoleKey; customRole?: CustomRole } | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CustomRole | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text3)' }}>
          Built-in PayFit roles cannot be edited. Create custom roles from a template.
        </p>
        <button
          onClick={() => setCreating(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 12.5, color: 'var(--text)', cursor: 'pointer', flexShrink: 0, transition: 'all 0.1s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          New role
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 10, border: '0.5px solid var(--border2)', overflow: 'hidden' }}>
        {/* Built-in roles */}
        <div style={{ padding: '8px 16px 6px', background: 'var(--bg)', borderBottom: '0.5px solid var(--border)' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Built-in</span>
        </div>
        {ASSIGNABLE_ROLES.map((key, idx) => {
          const m = ROLE_META[key];
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: idx < ASSIGNABLE_ROLES.length - 1 || customRoles.length > 0 ? '0.5px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{m.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 1 }}>{m.description}</div>
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>
                PayFit
              </span>
              <button
                onClick={() => setInspecting({ role: key })}
                style={{ background: 'none', border: '0.5px solid var(--border2)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11.5, color: 'var(--text2)', transition: 'all 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text2)'; }}
              >
                View
              </button>
            </div>
          );
        })}

        {/* Custom roles */}
        {customRoles.length > 0 && (
          <>
            <div style={{ padding: '8px 16px 6px', background: 'var(--bg)', borderBottom: '0.5px solid var(--border)', borderTop: '0.5px solid var(--border)' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Custom</span>
            </div>
            {customRoles.map((cr, idx) => {
              const base = ROLE_META[cr.baseRoleKey];
              return (
                <div key={cr.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: idx < customRoles.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: base.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{cr.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 1 }}>Based on {base.label}</div>
                  </div>
                  <button
                    onClick={() => setInspecting({ role: cr.baseRoleKey, customRole: cr })}
                    style={{ background: 'none', border: '0.5px solid var(--border2)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11.5, color: 'var(--text2)', transition: 'all 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text2)'; }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => { setEditing(cr); setInspecting(null); }}
                    style={{ background: 'none', border: '0.5px solid var(--border2)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11.5, color: 'var(--text2)', transition: 'all 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text2)'; }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRole(cr.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: '4px 6px', fontSize: 15, lineHeight: 1, transition: 'color 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C04A1E')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </>
        )}

        {customRoles.length === 0 && (
          <div style={{ padding: '28px 20px', textAlign: 'center', borderTop: '0.5px solid var(--border)' }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>No custom roles yet</div>
            <button onClick={() => setCreating(true)} style={{ fontSize: 12.5, color: 'var(--org)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Create your first custom role
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {inspecting && (
        <RoleInspectModal
          role={inspecting.role}
          isCustom={!!inspecting.customRole}
          customRole={inspecting.customRole}
          onClose={() => setInspecting(null)}
          onEdit={inspecting.customRole ? () => { setEditing(inspecting.customRole!); setInspecting(null); } : undefined}
        />
      )}
      {(creating || editing) && (
        <CreateRoleModal
          initial={editing ?? undefined}
          onSave={role => { editing ? updateRole(role) : addRole(role); setCreating(false); setEditing(null); }}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = 'people' | 'roles';

export function AccessPermissions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orgEnabled, setOrgEnabled } = useOrgMode();
  const { direction, setDirection } = useDirection();

  const defaultTab: Tab = searchParams.get('tab') === 'roles' ? 'roles' : 'people';
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300, color: 'var(--text)', marginBottom: 4, lineHeight: 1.2 }}>
          Access & Permissions
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Org mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, border: '0.5px solid var(--border2)', background: 'var(--bg)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              Org mode
            </span>
            {(['off', 'on'] as const).map(val => {
              const isActive = orgEnabled === (val === 'on');
              return (
                <button key={val} onClick={() => setOrgEnabled(val === 'on')} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: "'DM Mono', monospace", border: `1px solid ${isActive ? 'var(--text)' : 'transparent'}`, background: isActive ? 'var(--text)' : 'transparent', color: isActive ? 'white' : 'var(--text3)', cursor: 'pointer', transition: 'all 0.1s', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {val}
                </button>
              );
            })}
          </div>

          {/* Direction toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 6, border: '0.5px solid var(--border2)', background: 'var(--bg)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
              Model
            </span>
            {(['rbac', 'individual'] as const).map(val => {
              const isActive = direction === val;
              const labels = { rbac: 'RBAC', individual: 'Individual' };
              return (
                <button key={val} onClick={() => setDirection(val)} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: "'DM Mono', monospace", border: `1px solid ${isActive ? 'var(--text)' : 'transparent'}`, background: isActive ? 'var(--text)' : 'transparent', color: isActive ? 'white' : 'var(--text3)', cursor: 'pointer', transition: 'all 0.1s', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {labels[val]}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/org-settings/invite')}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 7, border: 'none', background: 'var(--text)', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Invite admin
          </button>
        </div>
      </div>

      {/* Tab bar — only visible in RBAC mode */}
      {direction === 'rbac' && (
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '0.5px solid var(--border)', paddingBottom: 0 }}>
          {(['people', 'roles'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t ? 500 : 400,
                color: tab === t ? 'var(--text)' : 'var(--text3)',
                borderBottom: `2px solid ${tab === t ? 'var(--text)' : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.1s', textTransform: 'capitalize',
              }}
            >
              {t === 'people' ? 'People' : 'Roles'}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {direction === 'individual' || tab === 'people' ? <PeopleTab /> : <RolesTab />}
    </div>
  );
}
