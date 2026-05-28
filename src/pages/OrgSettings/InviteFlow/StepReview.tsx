import { ORG_EMPLOYEES } from '../../../data/mock-users';
import { ROLE_META } from '../../../data/role-access';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import type { InviteState } from './types';

interface Props {
  invite: InviteState;
}

export function StepReview({ invite }: Props) {
  const role = invite.selectedRole!;
  const meta = ROLE_META[role];

  let name = invite.newName;
  let email = invite.newEmail;
  let initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  if (invite.whoType === 'existing' && invite.selectedEmployeeId) {
    const emp = ORG_EMPLOYEES.find(e => e.id === invite.selectedEmployeeId)!;
    name = emp.name;
    email = emp.email;
    initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  const perimeterLabel = (() => {
    if (role === 'org') return 'Org-wide (all entities)';
    if (invite.perimeterTab === 'group' && invite.groupId) {
      return GROUPS.find(g => g.id === invite.groupId)?.name ?? invite.groupId;
    }
    if (invite.entityIds.length === 0) return '—';
    return invite.entityIds
      .map(id => ENTITIES.find(e => e.id === id)?.name ?? id)
      .join(', ');
  })();

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Review the details below before sending the invitation. The person will receive an email with a link to join.
      </p>

      {/* Summary card */}
      <div style={{
        border: '0.5px solid var(--border2)', borderRadius: 10,
        overflow: 'hidden', maxWidth: 520,
      }}>
        {/* Person */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderBottom: '0.5px solid var(--border)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: `${meta.color}18`, border: `1.5px solid ${meta.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: meta.color,
          }}>
            {initials || '?'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{name || '—'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
              {email || '—'}
            </div>
          </div>
        </div>

        {/* Role */}
        <ReviewRow label="Role">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: meta.color }}>{meta.label}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)' }}>
              {meta.labelFr}
            </span>
          </div>
        </ReviewRow>

        {/* Perimeter */}
        <ReviewRow label="Perimeter" last>
          <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: role === 'org' ? 'inherit' : "'DM Mono', monospace" }}>
            {perimeterLabel}
          </span>
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
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '13px 20px',
      borderBottom: last ? 'none' : '0.5px solid var(--border)',
    }}>
      <div style={{
        width: 100, flexShrink: 0,
        fontSize: 11, fontFamily: "'DM Mono', monospace",
        color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}
