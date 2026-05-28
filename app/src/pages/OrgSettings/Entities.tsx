import { useState } from 'react';
import { ENTITIES } from '../../data/mock-entities';

const ENTITY_META: Record<string, { employees: number; payroll: string; flag: string }> = {
  fr: { employees: 142, payroll: 'Monthly', flag: '🇫🇷' },
  es: { employees: 38,  payroll: 'Monthly', flag: '🇪🇸' },
  uk: { employees: 61,  payroll: 'Monthly', flag: '🇬🇧' },
};

export function Entities() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 300,
            color: 'var(--text)', marginBottom: 4, lineHeight: 1.2,
          }}>
            Entities
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text2)', fontFamily: "'DM Mono', monospace" }}>
            {ENTITIES.length} entities in this organisation
          </p>
        </div>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 14px', borderRadius: 7, border: 'none',
            background: 'var(--text)', color: 'white',
            fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
            transition: 'opacity 0.1s', marginTop: 4,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Add entity
        </button>
      </div>

      {/* Entity list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ENTITIES.map(entity => {
          const meta = ENTITY_META[entity.id];
          const isSelected = selected === entity.id;

          return (
            <div
              key={entity.id}
              onClick={() => setSelected(isSelected ? null : entity.id)}
              style={{
                background: 'var(--surface)', border: `1.5px solid ${isSelected ? 'var(--text)' : 'var(--border2)'}`,
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.1s',
              }}
            >
              {/* Row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
              }}>
                {/* Flag */}
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'var(--bg)', border: '0.5px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {meta.flag}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                    {entity.name}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                    {entity.country} · {entity.code}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                  <Stat label="Employees" value={String(meta.employees)} />
                  <Stat label="Payroll" value={meta.payroll} />
                </div>

                {/* Status */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 4,
                  background: 'rgba(15,110,86,0.08)',
                  fontSize: 11.5, fontWeight: 500, color: '#0F6E56',
                  flexShrink: 0,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0F6E56' }} />
                  Active
                </span>

                {/* Chevron */}
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{
                    color: 'var(--border2)', flexShrink: 0,
                    transform: isSelected ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                >
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Expanded detail */}
              {isSelected && (
                <div style={{
                  borderTop: '0.5px solid var(--border)',
                  padding: '16px 18px',
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                }}>
                  <DetailField label="Legal name" value={entity.name} />
                  <DetailField label="Country" value={entity.country} />
                  <DetailField label="Entity code" value={entity.code} />
                  <DetailField label="SIRET / Registration" value="832 945 112 00017" />
                  <DetailField label="Payroll cycle" value="Monthly" />
                  <DetailField label="Created" value="March 2021" />

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, paddingTop: 4 }}>
                    <button style={actionBtn}>Edit entity</button>
                    <button style={{ ...actionBtn, color: '#C04A1E', borderColor: '#C04A1E33' }}>
                      Deactivate
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{value}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: 'var(--text3)', marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: '6px 13px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text2)', transition: 'all 0.1s',
};
