import { TEAM_MEMBERS } from '../../../data/mock-users';
import { ROLE_META, getRoleLabel } from '../../../data/role-access';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import { useOrgMode } from '../../../context/OrgModeContext';
import { useDirection } from '../../../context/DirectionContext';
import { PERMISSION_MODULES } from '../../../data/permissions';
import type { InviteState, InvitePair } from './types';

const ENTITY_FLAGS: Record<string, string> = { fr: '🇫🇷', es: '🇪🇸', uk: '🇬🇧' };

function perimeterLabel(pair: InvitePair, orgEnabled: boolean): string {
  if (!pair.role) return '—';
  if (pair.role === 'org') return orgEnabled ? 'Org-wide' : 'Company-wide';
  if (pair.role === 'acct' && !orgEnabled) return 'Company-wide';
  if (pair.role === 'mgr') {
    if (pair.reports.length === 0) return '—';
    return pair.reports.map(r => TEAM_MEMBERS.find(m => m.id === r.employeeId)?.name ?? r.employeeId).join(' · ');
  }
  const entityNames = pair.entityIds.map(id => {
    const e = ENTITIES.find(en => en.id === id);
    return e ? `${ENTITY_FLAGS[e.id] ?? ''} ${e.name}` : id;
  });
  const groupNames = pair.groupIds.map(id => GROUPS.find(g => g.id === id)?.name ?? id);
  return [...entityNames, ...groupNames].join(' · ') || '—';
}

const LEVEL_COLORS: Record<string, string> = { none: 'var(--text3)', view: '#1458A8', manage: '#0F6E56', custom: 'var(--org)' };

interface Props { invite: InviteState }

export function StepReview({ invite }: Props) {
  const { orgEnabled } = useOrgMode();
  const { direction } = useDirection();
  let name = invite.newName;
  let email = invite.newEmail;
  let initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  if (invite.whoType === 'existing' && invite.selectedEmployeeId) {
    const emp = TEAM_MEMBERS.find(e => e.id === invite.selectedEmployeeId);
    if (emp) { name = emp.name; email = emp.email; initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }
  }

  const firstMeta = invite.pairs[0]?.role ? ROLE_META[invite.pairs[0].role] : null;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28, marginTop: 4 }}>
        Review before sending the invitation.
      </p>

      <div style={{ border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden', maxWidth: 540 }}>
        {/* Person */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: firstMeta ? `${firstMeta.color}18` : 'rgba(0,0,0,0.055)',
            border: `1.5px solid ${firstMeta ? `${firstMeta.color}44` : 'rgba(0,0,0,0.09)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: firstMeta?.color ?? 'var(--text2)',
          }}>
            {initials || '?'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{name || '—'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{email || '—'}</div>
          </div>
        </div>

        {/* Access pairs */}
        {invite.pairs.map((pair, i) => {
          if (!pair.role) return null;
          const m = ROLE_META[pair.role];
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr',
              padding: '13px 20px', gap: 16, alignItems: 'start',
              borderBottom: i < invite.pairs.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={rowLabel}>Role</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: m.color }}>{getRoleLabel(pair.role, orgEnabled)}</span>
                </div>
              </div>
              <div>
                <div style={rowLabel}>Perimeter</div>
                <div style={{ fontSize: 12.5, color: 'var(--text)', marginTop: 4 }}>{perimeterLabel(pair, orgEnabled)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* D2: custom module summary */}
      {direction === 'individual' && invite.customModules && invite.customModules.length > 0 && (
        <div style={{ marginTop: 20, border: '0.5px solid var(--border2)', borderRadius: 10, overflow: 'hidden', maxWidth: 540 }}>
          <div style={{ padding: '10px 16px 8px', background: 'var(--bg)', borderBottom: '0.5px solid var(--border)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Permission summary</span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invite.customModules.map(ma => {
              const mod = PERMISSION_MODULES.find(m => m.id === ma.moduleId);
              if (!mod || ma.level === 'none') return null;
              return (
                <div key={ma.moduleId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text)' }}>{mod.label}</span>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: LEVEL_COLORS[ma.level], textTransform: 'capitalize' }}>
                    {ma.level}{ma.level === 'custom' ? ` · ${ma.enabledSubIds.length}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>
        An invitation email will be sent. The person will appear as <strong>Pending</strong> until they accept.
      </p>
    </div>
  );
}

const rowLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: "'DM Mono', monospace",
  color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
};
