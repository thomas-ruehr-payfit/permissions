import { useState } from 'react';
import { PERMISSION_MODULES } from '../../data/permissions';
import type { ModuleAccess, AccessLevel } from '../../data/permissions';

interface Props {
  modules: ModuleAccess[];
  onChange?: (modules: ModuleAccess[]) => void;
  readOnly?: boolean;
}

const LEVELS: AccessLevel[] = ['none', 'view', 'manage', 'custom'];

const LEVEL_META: Record<AccessLevel, { label: string; color: string; bg: string }> = {
  none:   { label: 'No access', color: 'var(--text3)',  bg: 'transparent' },
  view:   { label: 'View',      color: '#1458A8',       bg: 'rgba(20,88,168,0.07)' },
  manage: { label: 'Manage',    color: '#0F6E56',       bg: 'rgba(15,110,86,0.07)' },
  custom: { label: 'Custom',    color: 'var(--org)',    bg: 'var(--org-bg)' },
};

function ModuleIcon({ id }: { id: string }) {
  const s = { width: 15, height: 15, flexShrink: 0 as const };
  switch (id) {
    case 'people-contracts': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 13c0-3.038 2.462-5.5 5.5-5.5S13 9.962 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'tracker': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 7.5l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    case 'time-off': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7.5 4.5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'time-tracking': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7.5 5.5V8l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M6 1.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'payroll-payments': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="3.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 6.5h12" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 9.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'documents': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <path d="M4 1.5h5l3.5 3.5V13a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 1.5V5h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M6 8.5h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'analytics-reports': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <path d="M2 12.5l3-3.5 2.5 2L10 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.5 12.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    case 'company-settings': return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7.5 1.5v1M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1M3.4 3.4l.7.7M10.9 10.9l.7.7M3.4 11.6l.7-.7M10.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    );
    default: return (
      <svg {...s} viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    );
  }
}

export function PermissionEditor({ modules, onChange, readOnly = false }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const setLevel = (moduleId: string, level: AccessLevel) => {
    if (!onChange) return;
    onChange(modules.map(m => m.moduleId === moduleId
      ? { ...m, level, enabledSubIds: level === 'custom' ? m.enabledSubIds : [] }
      : m
    ));
  };

  const toggleSub = (moduleId: string, subId: string) => {
    if (!onChange) return;
    onChange(modules.map(m => {
      if (m.moduleId !== moduleId) return m;
      const has = m.enabledSubIds.includes(subId);
      return { ...m, enabledSubIds: has ? m.enabledSubIds.filter(s => s !== subId) : [...m.enabledSubIds, subId] };
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {PERMISSION_MODULES.map(mod => {
        const access = modules.find(m => m.moduleId === mod.id) ?? { moduleId: mod.id, level: 'none' as AccessLevel, enabledSubIds: [] };
        const lm = LEVEL_META[access.level];
        const isExpanded = expanded.has(mod.id);
        const canExpand = access.level === 'custom' || (access.level !== 'none' && mod.subPermissions.length > 0);

        return (
          <div key={mod.id} style={{ borderRadius: 8, border: '0.5px solid var(--border2)', background: 'var(--surface)', overflow: 'hidden' }}>
            {/* Module row */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}
            >
              {/* Icon + label */}
              <div style={{ color: 'var(--text3)', flexShrink: 0 }}>
                <ModuleIcon id={mod.id} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{mod.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{mod.description}</div>
              </div>

              {/* Level selector (edit) or badge (read-only) */}
              {readOnly ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 11,
                    fontFamily: "'DM Mono', monospace", fontWeight: 500,
                    color: lm.color, background: lm.bg,
                    border: access.level === 'none' ? '0.5px solid var(--border2)' : `0.5px solid ${lm.color}33`,
                  }}>
                    {lm.label}
                    {access.level === 'custom' && ` · ${access.enabledSubIds.length}`}
                  </span>
                  {canExpand && (
                    <button
                      onClick={() => toggle(mod.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text3)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s' }}>
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg)', borderRadius: 6, padding: '2px', border: '0.5px solid var(--border2)' }}>
                  {LEVELS.map(level => {
                    const lmeta = LEVEL_META[level];
                    const isActive = access.level === level;
                    return (
                      <button
                        key={level}
                        onClick={() => { setLevel(mod.id, level); if (level === 'custom' && !isExpanded) toggle(mod.id); }}
                        style={{
                          padding: '3px 8px', borderRadius: 4, fontSize: 11,
                          fontFamily: "'DM Mono', monospace", fontWeight: isActive ? 500 : 400,
                          border: isActive ? `0.5px solid ${lmeta.color}44` : 'none',
                          background: isActive ? lmeta.bg : 'transparent',
                          color: isActive ? lmeta.color : 'var(--text3)',
                          cursor: 'pointer', transition: 'all 0.1s', whiteSpace: 'nowrap',
                        }}
                      >
                        {lmeta.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sub-permissions (expanded) */}
            {isExpanded && (
              <div style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg)', padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {mod.subPermissions.map(sub => {
                  const isEnabled = access.level === 'manage' || access.enabledSubIds.includes(sub.id);
                  const isEditable = !readOnly && access.level === 'custom';
                  return (
                    <label
                      key={sub.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        cursor: isEditable ? 'pointer' : 'default',
                        opacity: !isEnabled && readOnly ? 0.4 : 1,
                      }}
                    >
                      {!readOnly && (
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          disabled={!isEditable}
                          onChange={() => isEditable && toggleSub(mod.id, sub.id)}
                          style={{ marginTop: 2, flexShrink: 0, accentColor: 'var(--org)' }}
                        />
                      )}
                      {readOnly && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1, color: isEnabled ? '#0F6E56' : 'var(--border2)' }}>
                          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                          {isEnabled && <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
                        </svg>
                      )}
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>{sub.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{sub.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
