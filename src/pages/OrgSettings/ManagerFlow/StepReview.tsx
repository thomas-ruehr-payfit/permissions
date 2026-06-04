import { TEAM_MEMBERS } from '../../../data/mock-users';
import { GROUPS } from '../../../data/mock-entities';
import { PERMISSION_GROUPS } from './StepPermissions';
import type { ManagerFlowState } from './types';

interface Props { state: ManagerFlowState }

export function StepReview({ state }: Props) {
  let name = state.newName;
  let email = state.newEmail;

  if (state.whoType === 'existing' && state.selectedEmployeeId) {
    const emp = TEAM_MEMBERS.find(e => e.id === state.selectedEmployeeId)!;
    name = emp.name;
    email = emp.email;
  }

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const groupNames = GROUPS.filter(g => state.manageeGroupIds.includes(g.id)).map(g => g.name);
  const memberNames = TEAM_MEMBERS.filter(m => state.manageeEmployeeIds.includes(m.id)).map(m => m.name);
  const perimeterParts = [...groupNames, ...memberNames];

  const enabledPermissions = PERMISSION_GROUPS.flatMap(g =>
    g.items.filter(item => state.permissions[item.key]).map(item => item.label)
  );

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Review the details before sending the invitation.
      </p>

      <div style={{ border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden', maxWidth: 540 }}>

        {/* Person */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'var(--mgr-bg)', border: '1.5px solid var(--mgr)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: 'var(--mgr)',
          }}>
            {initials || '?'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{name || '—'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{email || '—'}</div>
          </div>
        </div>

        {/* Role */}
        <ReviewRow label="Role">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--mgr)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--mgr)' }}>Manager</span>
          </div>
        </ReviewRow>

        {/* Reports to */}
        <ReviewRow label="Reports">
          <div style={{ fontSize: 12.5, color: 'var(--text)' }}>
            {perimeterParts.length > 0 ? perimeterParts.join(' · ') : '—'}
          </div>
        </ReviewRow>

        {/* Permissions */}
        <ReviewRow label="Permissions" last>
          <div style={{ fontSize: 12.5, color: 'var(--text)' }}>
            {enabledPermissions.length > 0 ? enabledPermissions.join(' · ') : 'None selected'}
          </div>
        </ReviewRow>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>
        An invitation email will be sent. The person will appear as <strong>Pending</strong> until they accept.
      </p>
    </div>
  );
}

function ReviewRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16,
      padding: '13px 20px',
      borderBottom: last ? 'none' : '0.5px solid var(--border)',
    }}>
      <div style={{
        width: 100, flexShrink: 0,
        fontSize: 10, fontFamily: "'DM Mono', monospace",
        color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}
