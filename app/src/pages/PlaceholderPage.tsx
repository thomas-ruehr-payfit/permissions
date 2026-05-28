interface Props {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div style={{ padding: '32px 36px' }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 32 }}>{description}</p>
      <div style={{
        padding: '48px 32px',
        borderRadius: 10,
        border: '0.5px dashed var(--border2)',
        background: 'var(--surface)',
        textAlign: 'center',
        color: 'var(--text3)',
        fontSize: 13,
        fontFamily: "'DM Mono', monospace",
      }}>
        Content coming soon
      </div>
    </div>
  );
}
