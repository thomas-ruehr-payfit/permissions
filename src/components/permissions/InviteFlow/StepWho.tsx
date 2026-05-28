import { useState } from 'react';
import { ORG_EMPLOYEES } from '../../../data/mock-users';

interface Props {
  value: { type: 'org' | 'new'; employeeId?: string; name?: string; email?: string };
  onChange: (v: Props['value']) => void;
}

export function StepWho({ value, onChange }: Props) {
  const [search, setSearch] = useState('');

  const filtered = ORG_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['org', 'new'] as const).map(t => (
          <button
            key={t}
            onClick={() => onChange({ type: t })}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 7,
              border: `1.5px solid ${value.type === t ? 'var(--text)' : 'var(--border2)'}`,
              background: value.type === t ? 'var(--text)' : 'var(--surface)',
              color: value.type === t ? 'var(--bg)' : 'var(--text2)',
              fontSize: 13,
              fontWeight: value.type === t ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {t === 'org' ? 'From this organisation' : 'New person'}
          </button>
        ))}
      </div>

      {value.type === 'org' && (
        <div>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '0.5px solid var(--border2)',
              borderRadius: 7,
              fontSize: 13,
              color: 'var(--text)',
              background: 'var(--surface)',
              outline: 'none',
              marginBottom: 8,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => onChange({ type: 'org', employeeId: emp.id, name: emp.name, email: emp.email })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 7,
                  border: `1px solid ${value.employeeId === emp.id ? 'var(--text)' : 'var(--border)'}`,
                  background: value.employeeId === emp.id ? 'rgba(0,0,0,0.03)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--bg)', border: '0.5px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text2)',
                  flexShrink: 0,
                }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>{emp.title}</div>
                </div>
                {value.employeeId === emp.id && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 'auto', color: 'var(--text)' }}>
                    <path d="M2.5 7l3 3L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.type === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Full name</label>
            <input
              placeholder="e.g. Marie Dupont"
              value={value.name ?? ''}
              onChange={e => onChange({ ...value, name: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px',
                border: '0.5px solid var(--border2)', borderRadius: 7,
                fontSize: 13, color: 'var(--text)', background: 'var(--surface)', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Work email</label>
            <input
              type="email"
              placeholder="marie.dupont@company.com"
              value={value.email ?? ''}
              onChange={e => onChange({ ...value, email: e.target.value })}
              style={{
                width: '100%', padding: '9px 12px',
                border: '0.5px solid var(--border2)', borderRadius: 7,
                fontSize: 13, color: 'var(--text)', background: 'var(--surface)', outline: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
