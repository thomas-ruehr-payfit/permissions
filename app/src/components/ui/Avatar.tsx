interface Props {
  initials: string;
  color: string;
  size?: number;
}

export function Avatar({ initials, color, size = 32 }: Props) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color + '22',
      border: `1.5px solid ${color}44`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
      fontSize: size * 0.34,
      fontWeight: 500,
      color,
      flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {initials}
    </div>
  );
}
