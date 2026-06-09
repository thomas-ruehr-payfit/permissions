import { PermissionEditor } from '../../../components/permissions/PermissionEditor';
import type { InviteState } from './types';
import type { ModuleAccess } from '../../../data/permissions';

interface Props {
  invite: InviteState;
  setInvite: React.Dispatch<React.SetStateAction<InviteState>>;
}

export function StepAdjustPermissions({ invite, setInvite }: Props) {
  const modules = invite.customModules ?? [];

  const onChange = (updated: ModuleAccess[]) =>
    setInvite(prev => ({ ...prev, customModules: updated }));

  const sp = invite.startingPoint;
  const sourceLabel = sp
    ? sp.type === 'preset'
      ? `Started from a role preset`
      : `Copied from another person`
    : null;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8, marginTop: 4 }}>
        Review and adjust the permission level for each area. Changes apply only to this person.
      </p>
      {sourceLabel && (
        <p style={{ fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: 'var(--text3)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M5.5 4.5v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <circle cx="5.5" cy="3.5" r=".4" fill="currentColor"/>
          </svg>
          {sourceLabel}
        </p>
      )}

      {modules.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text3)' }}>No permission data — go back and choose a starting point.</p>
      ) : (
        <PermissionEditor modules={modules} onChange={onChange} />
      )}
    </div>
  );
}
