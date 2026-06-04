import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../../context/UsersContext';
import { GROUPS } from '../../data/mock-entities';
import { TEAM_MEMBERS } from '../../data/mock-users';
import { PERMISSION_GROUPS } from './ManagerFlow/StepPermissions';
import type { ManagerPermissions } from '../../data/mock-users';

export function ManagerDetail() {
  const { managerId } = useParams<{ managerId: string }>();
  const navigate = useNavigate();
  const { managers, updateManager, removeManager } = useUsers();

  const manager = managers.find(m => m.id === managerId);

  const [isEditing, setIsEditing] = useState(false);
  const [editGroups, setEditGroups]       = useState<string[]>([]);
  const [editEmployees, setEditEmployees] = useState<string[]>([]);
  const [editPerms, setEditPerms]         = useState<ManagerPermissions>({
    validateAbsences: false, validateExpenses: false, validateTimeReports: false,
    viewAbsences: false, viewSalary: false,
  });
  const [search, setSearch] = useState('');

  if (!manager) {
    navigate('/org-settings/access-permissions');
    return null;
  }

  const isPending = manager.status === 'pending';

  const startEdit = () => {
    setEditGroups([...manager.manageeGroupIds]);
    setEditEmployees([...manager.manageeEmployeeIds]);
    setEditPerms({ ...manager.permissions });
    setSearch('');
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = () => {
    updateManager(manager.id, {
      manageeGroupIds: editGroups,
      manageeEmployeeIds: editEmployees,
      permissions: editPerms,
    });
    setIsEditing(false);
  };

  const canSave = editGroups.length > 0 || editEmployees.length > 0;

  const toggleGroup = (id: string) =>
    setEditGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const toggleEmployee = (id: string) =>
    setEditEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const togglePerm = (key: keyof ManagerPermissions) =>
    setEditPerms(prev => ({ ...prev, [key]: !prev[key] }));

  // Read view data
  const groupChips  = GROUPS.filter(g => manager.manageeGroupIds.includes(g.id));
  const memberChips = TEAM_MEMBERS.filter(m => manager.manageeEmployeeIds.includes(m.id));
  const enabledPerms = PERMISSION_GROUPS.flatMap(g =>
    g.items.filter(item => manager.permissions[item.key])
  );

  const filteredMembers = search.trim()
    ? TEAM_MEMBERS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase()))
    : TEAM_MEMBERS;

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
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: 'var(--mgr-bg)', border: '1.5px solid var(--mgr)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--mgr)',
        }}>
          {manager.avatarInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: 'var(--text)', lineHeight: 1.2 }}>{manager.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{manager.email}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: 5,
            background: isPending ? 'rgba(196,140,40,0.08)' : 'rgba(15,110,86,0.08)',
            fontSize: 11.5, fontWeight: 500,
            color: isPending ? '#B8860B' : '#0F6E56',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: isPending ? '#B8860B' : '#0F6E56' }} />
            {isPending ? 'Pending' : 'Active'}
          </span>
          {isPending && <button style={secondaryBtn}>Resend invite</button>}
          <button
            onClick={() => { removeManager(manager.id); navigate('/org-settings/access-permissions'); }}
            style={{ ...secondaryBtn, color: '#C04A1E', borderColor: '#C04A1E33' }}
          >
            Revoke access
          </button>
        </div>
      </div>

      {/* Permissions card */}
      <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Manager settings
          </span>
          {!isEditing ? (
            <button onClick={startEdit} style={editBtn}>Edit</button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={cancelEdit} style={secondaryBtn}>Cancel</button>
              <button
                onClick={saveEdit}
                disabled={!canSave}
                style={{ ...editBtn, background: canSave ? 'var(--text)' : 'var(--border2)', color: canSave ? 'white' : 'var(--text3)', borderColor: 'transparent', cursor: canSave ? 'pointer' : 'default' }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* ── READ VIEW ── */}
          {!isEditing && (
            <>
              <Section label="Reports to">
                {groupChips.length === 0 && memberChips.length === 0 ? (
                  <span style={{ fontSize: 13, color: 'var(--text3)' }}>—</span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {groupChips.map(g => <Chip key={g.id}>{g.name}</Chip>)}
                    {memberChips.map(m => <Chip key={m.id}>{m.name}</Chip>)}
                  </div>
                )}
              </Section>

              <Section label="Permissions">
                {enabledPerms.length === 0 ? (
                  <span style={{ fontSize: 13, color: 'var(--text3)' }}>No permissions granted</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '0.5px solid var(--border2)', borderRadius: 8, overflow: 'hidden' }}>
                    {enabledPerms.map((item, i) => (
                      <div key={item.key} style={{
                        padding: '10px 14px', fontSize: 13, color: 'var(--text)',
                        borderBottom: i < enabledPerms.length - 1 ? '0.5px solid var(--border)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M2 6.5l3.5 3.5 5.5-6" stroke="var(--org)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </>
          )}

          {/* ── EDIT VIEW ── */}
          {isEditing && (
            <>
              {/* Reports to */}
              <Section label="Reports to">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

                  <div>
                    <div style={subLabelStyle}>Teams</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {GROUPS.map(group => {
                        const isChecked = editGroups.includes(group.id);
                        return (
                          <label key={group.id} style={checkRowStyle(isChecked)}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleGroup(group.id)} style={{ display: 'none' }} />
                            <CheckBox checked={isChecked} />
                            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{group.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={subLabelStyle}>Individual employees</div>
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search…"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 5, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 12, color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 6, transition: 'border-color 0.1s' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 240, overflowY: 'auto' }}>
                      {filteredMembers.map(member => {
                        const isChecked = editEmployees.includes(member.id);
                        return (
                          <label key={member.id} style={checkRowStyle(isChecked)}>
                            <input type="checkbox" checked={isChecked} onChange={() => toggleEmployee(member.id)} style={{ display: 'none' }} />
                            <CheckBox checked={isChecked} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.title}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Permissions */}
              <Section label="Permissions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 460 }}>
                  {PERMISSION_GROUPS.map(group => (
                    <div key={group.key} style={{ background: 'var(--bg)', border: '0.5px solid var(--border2)', borderRadius: 8, overflow: 'hidden' }}>
                      <div style={{ padding: '10px 16px', borderBottom: '0.5px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                        {group.label}
                      </div>
                      {group.items.map((item, i) => {
                        const checked = editPerms[item.key];
                        return (
                          <label key={item.key} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 16px', cursor: 'pointer',
                            borderBottom: i < group.items.length - 1 ? '0.5px solid var(--border)' : 'none',
                            background: checked ? 'rgba(91,79,212,0.03)' : 'transparent', transition: 'background 0.1s',
                          }}>
                            <input type="checkbox" checked={checked} onChange={() => togglePerm(item.key)} style={{ display: 'none' }} />
                            <div style={{
                              width: 16, height: 16, borderRadius: 3, flexShrink: 0, marginTop: 1,
                              border: `1.5px solid ${checked ? 'var(--org)' : 'var(--border2)'}`,
                              background: checked ? 'var(--org)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s',
                            }}>
                              {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <div>
                              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                              <div style={{ fontSize: 11.5, color: 'var(--text2)', marginTop: 1 }}>{item.description}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 6, background: 'var(--bg)', border: '0.5px solid var(--border2)', fontSize: 12.5, color: 'var(--text)' }}>
      {children}
    </span>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${checked ? 'var(--text)' : 'var(--border2)'}`, background: checked ? 'var(--text)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
      {checked && <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M1 3.5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  );
}

const checkRowStyle = (checked: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
  border: `1px solid ${checked ? 'var(--border2)' : 'transparent'}`,
  background: checked ? 'var(--bg)' : 'transparent', transition: 'all 0.1s',
});

const subLabelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
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
