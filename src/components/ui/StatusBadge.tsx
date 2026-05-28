interface Props {
  status: 'active' | 'pending';
}

export function StatusBadge({ status }: Props) {
  const isActive = status === 'active';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: isActive ? 'rgba(15,110,86,0.08)' : 'rgba(0,0,0,0.05)',
      color: isActive ? 'var(--entity)' : 'var(--text3)',
      borderRadius: 4,
      fontFamily: "'DM Mono', monospace",
      fontSize: 11,
      fontWeight: 500,
      padding: '3px 8px',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: isActive ? 'var(--entity)' : 'var(--text3)',
        flexShrink: 0,
      }} />
      {isActive ? 'Active' : 'Pending'}
    </span>
  );
}
