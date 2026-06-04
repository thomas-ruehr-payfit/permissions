import { useState, useRef, useEffect } from 'react';

interface Option { id: string; label: string }

interface Props {
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
}

export function MultiSelectDropdown({ options, selected, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  const label =
    selected.length === 0 ? `All ${placeholder}` :
    selected.length === 1 ? (options.find(o => o.id === selected[0])?.label ?? placeholder) :
    `${selected.length} ${placeholder.toLowerCase()}`;

  const active = selected.length > 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 6,
          border: `1px solid ${active ? 'var(--text)' : 'var(--border2)'}`,
          background: active ? 'var(--text)' : 'transparent',
          color: active ? 'white' : 'var(--text2)',
          fontSize: 11.5, fontFamily: "'DM Mono', monospace",
          cursor: 'pointer', transition: 'all 0.1s', whiteSpace: 'nowrap',
        }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s' }}>
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200,
          background: 'var(--surface)', border: '0.5px solid var(--border2)',
          borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          minWidth: 170, overflow: 'hidden',
        }}>
          {options.map((option, i) => {
            const checked = selected.includes(option.id);
            return (
              <label key={option.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', cursor: 'pointer',
                background: checked ? 'var(--bg)' : 'transparent',
                borderBottom: i < options.length - 1 ? '0.5px solid var(--border)' : 'none',
                transition: 'background 0.1s',
              }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(option.id)} style={{ display: 'none' }} />
                <div style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${checked ? 'var(--text)' : 'var(--border2)'}`,
                  background: checked ? 'var(--text)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.1s',
                }}>
                  {checked && (
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                      <path d="M1 3.5l2 2 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{option.label}</span>
              </label>
            );
          })}
          {selected.length > 0 && (
            <button
              onClick={() => { onChange([]); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 12px', border: 'none',
                borderTop: '0.5px solid var(--border)',
                background: 'transparent', cursor: 'pointer',
                fontSize: 11.5, fontFamily: "'DM Mono', monospace",
                color: 'var(--text3)', textAlign: 'left', transition: 'color 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text3)')}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
