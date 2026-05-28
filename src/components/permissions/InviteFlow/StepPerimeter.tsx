import type { RoleKey } from '../../../data/mock-users';
import { PERIMETER_MODE, ROLE_META } from '../../../data/role-access';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';

export interface PerimeterValue {
  entityIds: string[];
  groupId: string | null;
  hrMode: 'entity' | 'group';
}

interface Props {
  role: RoleKey;
  value: PerimeterValue;
  onChange: (v: PerimeterValue) => void;
}

export function StepPerimeter({ role, value, onChange }: Props) {
  const mode = PERIMETER_MODE[role];
  const meta = ROLE_META[role];

  if (mode === 'fixed-org') {
    return (
      <div style={{
        padding: 16,
        borderRadius: 8,
        background: meta.bg,
        border: `0.5px solid ${meta.color}33`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: meta.color, marginBottom: 4 }}>
          Organisation-wide
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
          Organisation Admins always have org-wide access. The perimeter is fixed and cannot be narrowed.
        </div>
      </div>
    );
  }

  const toggleEntity = (id: string) => {
    const next = value.entityIds.includes(id)
      ? value.entityIds.filter(e => e !== id)
      : [...value.entityIds, id];
    onChange({ ...value, entityIds: next });
  };

  if (mode === 'entity') {
    return (
      <div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6 }}>
          Select one or more entities this person will have access to.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ENTITIES.map(entity => {
            const selected = value.entityIds.includes(entity.id);
            return (
              <button
                key={entity.id}
                onClick={() => toggleEntity(entity.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 7,
                  border: `1px solid ${selected ? meta.color + '55' : 'var(--border2)'}`,
                  background: selected ? meta.bg : 'var(--surface)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `1.5px solid ${selected ? meta.color : 'var(--border2)'}`,
                  background: selected ? meta.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.12s',
                }}>
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: selected ? 500 : 400, color: selected ? meta.color : 'var(--text)' }}>
                    {entity.name}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>
                    {entity.country}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'entity-or-group') {
    return (
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['entity', 'group'] as const).map(m => (
            <button
              key={m}
              onClick={() => onChange({ ...value, hrMode: m })}
              style={{
                padding: '6px 14px', borderRadius: 6,
                border: `1px solid ${value.hrMode === m ? 'var(--text)' : 'var(--border2)'}`,
                background: value.hrMode === m ? 'var(--text)' : 'transparent',
                color: value.hrMode === m ? 'var(--bg)' : 'var(--text2)',
                fontSize: 12, fontWeight: value.hrMode === m ? 500 : 400,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {m === 'entity' ? 'By entity' : 'By group'}
            </button>
          ))}
        </div>

        {value.hrMode === 'entity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ENTITIES.map(entity => {
              const selected = value.entityIds.includes(entity.id);
              return (
                <button
                  key={entity.id}
                  onClick={() => toggleEntity(entity.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 7,
                    border: `1px solid ${selected ? meta.color + '55' : 'var(--border2)'}`,
                    background: selected ? meta.bg : 'var(--surface)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    border: `1.5px solid ${selected ? meta.color : 'var(--border2)'}`,
                    background: selected ? meta.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: selected ? 500 : 400, color: selected ? meta.color : 'var(--text)' }}>
                      {entity.name}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>{entity.country}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {value.hrMode === 'group' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {GROUPS.map(group => {
              const selected = value.groupId === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => onChange({ ...value, groupId: selected ? null : group.id })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 7,
                    border: `1px solid ${selected ? meta.color + '55' : 'var(--border2)'}`,
                    background: selected ? meta.bg : 'var(--surface)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `1.5px solid ${selected ? meta.color : 'var(--border2)'}`,
                    background: selected ? meta.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: selected ? 500 : 400, color: selected ? meta.color : 'var(--text)' }}>
                    {group.name}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
}
