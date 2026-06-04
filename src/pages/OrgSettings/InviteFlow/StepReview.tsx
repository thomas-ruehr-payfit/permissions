import { ORG_EMPLOYEES } from '../../../data/mock-users';
import { ROLE_META } from '../../../data/role-access';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import type { InviteState, InvitePair } from './types';

const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

interface Props {
  invite: InviteState;
}

function perimeterLabel(pair: InvitePair): string {
  if (pair.role === 'org') return 'Org-wide (all entities)';

  const prefix = pair.exclude ? 'All except ' : '';

  if (pair.perimeterTab === 'group') {
    if (pair.groupIds.length === 0) return '—';
    const names = pair.groupIds.map(id => GROUPS.find(g => g.id === id)?.name ?? id).join(', ');
    return prefix + names;
  }

  if (pair.entityIds.length === 0) return '—';
  const names = pair.entityIds
    .map(id => {
      const e = ENTITIES.find(en => en.id === id);
      return e ? `${ENTITY_FLAGS[e.id] ?? ''} ${e.name}` : id;
    })
    .join(', ');
  return prefix + names;
}

export function StepReview({ invite }: Props) {
  let name = invite.newName;
  let email = invite.newEmail;
  let initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  if (invite.whoType === 'existing' && invite.selectedEmployeeId) {
    const emp = ORG_EMPLOYEES.find(e => e.id === invite.selectedEmployeeId)!;
    name = emp.name;
    email = emp.email;
    initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  const firstRole = invite.pairs[0]?.role;
  const firstMeta = firstRole ? ROLE_META[firstRole] : null;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Review the details below before sending the invitation. The person will receive an email with a link to join.
      </p>

      <div style={{
        border: '0.5px solid var(--border2)', borderRadius: 10,
        overflow: 'hidden', maxWidth: 540,
      }}>
        {/* Person */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderBottom: '0.5px solid var(--border)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: firstMeta ? `${firstMeta.color}18` : 'rgba(0,0,0,0.055)',
            border: `1.5px solid ${firstMeta ? `${firstMeta.color}44` : 'rgba(0,0,0,0.09)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
            color: firstMeta?.color ?? 'var(--text2)',
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

        {/* Pairs */}
        {invite.pairs.map((pair, i) => {
          if (!pair.role) return null;
          const m = ROLE_META[pair.role];
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr',
              padding: '13px 20px', gap: 16, alignItems: 'start',
              borderBottom: i < invite.pairs.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              {/* Role */}
              <div>
                <div style={rowLabelStyle}>Role</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: m.color }}>{m.label}</span>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                  {m.labelFr}
                </div>
              </div>

              {/* Perimeter */}
              <div>
                <div style={rowLabelStyle}>Perimeter</div>
                <div style={{ fontSize: 12.5, color: 'var(--text)', marginTop: 4 }}>
                  {perimeterLabel(pair)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>
        An invitation email will be sent. The person will appear as <strong>Pending</strong> until they accept.
      </p>
    </div>
  );
}

const rowLabelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace",
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
};
