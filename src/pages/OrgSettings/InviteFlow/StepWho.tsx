import { useState } from 'react';
import { TEAM_MEMBERS } from '../../../data/mock-users';
import { GROUPS, ENTITIES } from '../../../data/mock-entities';
import type { InviteState } from './types';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

function entityLabel(id: string) {
  const e = ENTITIES.find(en => en.id === id);
  return e ? `${ENTITY_FLAGS[id] ?? ''} ${e.country}` : id;
}

export function StepWho({ invite, setInvite }: Props) {
  const [search, setSearch] = useState('');
  const set = (patch: Partial<InviteState>) =>
    setInvite(prev => ({ ...prev, ...patch }));

  const filtered = search.trim()
    ? TEAM_MEMBERS.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.title.toLowerCase().includes(search.toLowerCase())
      )
    : TEAM_MEMBERS;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, marginTop: 4 }}>
        Choose whether you're designating someone already in your organisation, or inviting a new external person.
      </p>

      {/* Source toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {(['existing', 'new'] as const).map(type => {
          const isSelected = invite.whoType === type;
          return (
            <button
              key={type}
              onClick={() => set({ whoType: type, selectedEmployeeId: null })}
              style={{ flex: 1, padding: '14px 16px', borderRadius: 8, textAlign: 'left', border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border2)'}`, background: isSelected ? 'var(--bg)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.12s' }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 3 }}>
                {type === 'existing' ? 'From this organisation' : 'New person'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                {type === 'existing' ? 'Designate an existing collaborator' : 'Invite someone from outside'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Collaborator list */}
      {invite.whoType === 'existing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or role…"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.1s' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 360, overflowY: 'auto' }}>
            {filtered.map(emp => {
              const isSelected = invite.selectedEmployeeId === emp.id;
              const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              const groups = GROUPS.filter(g => emp.groupIds.includes(g.id));
              return (
                <button
                  key={emp.id}
                  onClick={() => set({ selectedEmployeeId: emp.id })}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 7, textAlign: 'left', width: '100%', border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border)'}`, background: isSelected ? 'var(--bg)' : 'transparent', cursor: 'pointer', transition: 'all 0.1s' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'rgba(0,0,0,0.055)', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 10.5, fontWeight: 600, color: 'var(--text2)' }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{emp.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>{emp.title}</span>
                      <span style={{ color: 'var(--border2)' }}>·</span>
                      <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>{entityLabel(emp.entityId)}</span>
                      {groups.length > 0 && (
                        <>
                          <span style={{ color: 'var(--border2)' }}>·</span>
                          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)' }}>
                            {groups.map(g => g.name).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" stroke="var(--text)" strokeWidth="1.3"/>
                      <path d="M5 8l2.5 2.5L11 5.5" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12.5, color: 'var(--text3)' }}>No results</div>
            )}
          </div>
        </div>
      )}

      {/* New person form */}
      {invite.whoType === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
          <Field label="Full name" value={invite.newName} onChange={v => set({ newName: v })} placeholder="e.g. Marie Dupont" />
          <Field label="Email address" value={invite.newEmail} onChange={v => set({ newEmail: v })} placeholder="e.g. marie.dupont@company.com" type="email" />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '0.5px solid var(--border2)', background: 'var(--surface)', fontSize: 13, color: 'var(--text)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.1s' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
      />
    </div>
  );
}
