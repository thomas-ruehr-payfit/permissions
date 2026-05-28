import type { RoleKey } from '../../data/mock-users';
import { ROLE_META } from '../../data/role-access';

interface Props {
  role: RoleKey;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'md' }: Props) {
  const meta = ROLE_META[role];
  const fontSize = size === 'sm' ? '11px' : '12px';
  const padding = size === 'sm' ? '2px 7px' : '3px 9px';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: meta.bg,
      color: meta.color,
      borderRadius: 4,
      fontFamily: "'DM Mono', monospace",
      fontSize,
      fontWeight: 500,
      padding,
      whiteSpace: 'nowrap',
    }}>
      {meta.label}
    </span>
  );
}
