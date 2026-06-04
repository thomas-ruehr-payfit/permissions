import { useState } from 'react';
import { GROUPS } from '../../../data/mock-entities';
import { TEAM_MEMBERS } from '../../../data/mock-users';
import type { ManagerFlowState } from './types';

interface Props {
  state: ManagerFlowState;
  setState: React.Dispatch<React.SetStateAction<ManagerFlowState>>;
}

export function StepPerimeter({ state, setState }: Props) {
  const [search, setSearch] = useState('');

  const toggleGroup = (id: string) => {
    setState(prev => ({
      ...prev,
      manageeGroupIds: prev.manageeGroupIds.includes(id)
        ? prev.manageeGroupIds.filter(g => g !== id)
        : [...prev.manageeGroupIds, id],
    }));
  };

  const toggleEmployee = (id: string) => {
    setState(prev => ({
      ...prev,
      manageeEmployeeIds: prev.manageeEmployeeIds.includes(id)
        ? prev.manageeEmployeeIds.filter(e => e !== id)
        : [...prev.manageeEmployeeIds, id],
    }));
  };

  const filteredMembers = search.trim()
    ? TEAM_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
      )
    : TEAM_MEMBERS;

  const totalSelected = state.manageeGroupIds.length + state.manageeEmployeeIds.length;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Define who this manager is responsible for. You can combine teams and individual employees.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Teams */}
        <div>
          <div style={sectionLabelStyle}>Teams</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {GROUPS.map(group => {
              const isChecked = state.manageeGroupIds.includes(group.id);
              return (
                <label key={group.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${isChecked ? 'var(--mgr)' : 'var(--border2)'}`,
                  background: isChecked ? 'var(--mgr-bg)' : 'transparent',
                  transition: 'all 0.1s',
                }}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleGroup(group.id)} style={{ display: 'none' }} />
                  <Checkbox checked={isChecked} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{group.name}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Individual employees */}
        <div>
          <div style={sectionLabelStyle}>Individual employees</div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or role…"
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 6, marginBottom: 8,
              border: '0.5px solid var(--border2)', background: 'var(--surface)',
              fontSize: 12.5, color: 'var(--text)', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.1s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--text)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 320, overflowY: 'auto' }}>
            {filteredMembers.map(member => {
              const isChecked = state.manageeEmployeeIds.includes(member.id);
              return (
                <label key={member.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 7, cursor: 'pointer',
                  border: `1.5px solid ${isChecked ? 'var(--mgr)' : 'var(--border2)'}`,
                  background: isChecked ? 'var(--mgr-bg)' : 'transparent',
                  transition: 'all 0.1s',
                }}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggleEmployee(member.id)} style={{ display: 'none' }} />
                  <Checkbox checked={isChecked} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: 10.5, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.title}
                    </div>
                  </div>
                </label>
              );
            })}
            {filteredMembers.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--text3)', padding: '12px 0' }}>No results</div>
            )}
          </div>
        </div>
      </div>

      {totalSelected > 0 && (
        <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
          {state.manageeGroupIds.length > 0 && `${state.manageeGroupIds.length} team${state.manageeGroupIds.length > 1 ? 's' : ''}`}
          {state.manageeGroupIds.length > 0 && state.manageeEmployeeIds.length > 0 && ' · '}
          {state.manageeEmployeeIds.length > 0 && `${state.manageeEmployeeIds.length} individual${state.manageeEmployeeIds.length > 1 ? 's' : ''}`}
          {' selected'}
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 15, height: 15, borderRadius: 3, flexShrink: 0,
      border: `1.5px solid ${checked ? 'var(--mgr)' : 'var(--border2)'}`,
      background: checked ? 'var(--mgr)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.1s',
    }}>
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4l2.5 2.5L7 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'var(--text3)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
};
