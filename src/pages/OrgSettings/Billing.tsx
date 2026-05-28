export function Billing() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300,
          color: 'var(--text)', marginBottom: 4, lineHeight: 1.2,
        }}>
          Billing
        </h1>
        <p style={{ fontSize: 12.5, color: 'var(--text2)', fontFamily: "'DM Mono', monospace" }}>
          Manage your PayFit subscription and payment details
        </p>
      </div>

      {/* Current plan */}
      <Section label="Current plan">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InfoRow label="Plan" value="Enterprise" />
          <InfoRow label="Billing cycle" value="Monthly" />
          <InfoRow label="Entities" value="3 (FR, ES, UK)" />
          <InfoRow label="Next renewal" value="1 July 2026" />
        </div>
        <div style={{ marginTop: 16 }}>
          <button style={secondaryBtn}>View plan details</button>
        </div>
      </Section>

      {/* Next invoice */}
      <Section label="Upcoming invoice">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', fontFamily: "'Fraunces', serif", fontVariantNumeric: 'tabular-nums' }}>
              €4,320
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              Due 1 July 2026
            </div>
          </div>
          <button style={secondaryBtn}>Download last invoice</button>
        </div>
      </Section>

      {/* Payment method */}
      <Section label="Payment method">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 26, borderRadius: 4,
              background: 'var(--bg)', border: '0.5px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <rect width="22" height="16" rx="2" fill="#1A1F71" opacity="0.08"/>
                <circle cx="8" cy="8" r="5" fill="#EB001B" opacity="0.7"/>
                <circle cx="14" cy="8" r="5" fill="#F79E1B" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                Mastercard ending in 4242
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>
                Expires 09 / 28
              </div>
            </div>
          </div>
          <button style={secondaryBtn}>Update</button>
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '0.5px solid var(--border2)',
      borderRadius: 10, overflow: 'hidden', marginBottom: 14,
    }}>
      <div style={{
        padding: '12px 20px', borderBottom: '0.5px solid var(--border)',
        fontSize: 10, fontFamily: "'DM Mono', monospace",
        color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      <div style={{ padding: '18px 20px' }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontFamily: "'DM Mono', monospace",
        color: 'var(--text3)', textTransform: 'uppercase',
        letterSpacing: '0.06em', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>{value}</div>
    </div>
  );
}

const secondaryBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
  border: '0.5px solid var(--border2)', background: 'transparent',
  fontSize: 12.5, color: 'var(--text2)', transition: 'all 0.1s',
};
