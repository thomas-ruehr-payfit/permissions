import { useState, useEffect } from 'react';
import type { RoleKey, AdminUser, AccessPair } from '../../../data/mock-users';
import { ROLE_META, PERIMETER_MODE } from '../../../data/role-access';
import { ENTITIES, GROUPS } from '../../../data/mock-entities';
import { RoleBadge } from '../../ui/RoleBadge';
import { StepWho } from './StepWho';
import { StepRole } from './StepRole';
import { StepPerimeter, type PerimeterValue } from './StepPerimeter';

interface Props {
  onClose: () => void;
  onAdd: (user: AdminUser) => void;
}

type WhoValue = { type: 'org' | 'new'; employeeId?: string; name?: string; email?: string };

const STEPS = ['Who', 'Role', 'Perimeter', 'Confirm'];

export function InviteModal({ onClose, onAdd }: Props) {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<WhoValue>({ type: 'org' });
  const [role, setRole] = useState<RoleKey | null>(null);
  const [perimeter, setPerimeter] = useState<PerimeterValue>({ entityIds: [], groupId: null, hrMode: 'entity' });

  const isFixedOrg = role ? PERIMETER_MODE[role] === 'fixed-org' : false;

  const canNext = (() => {
    if (step === 0) return who.type === 'org' ? !!who.employeeId : (!!who.name && !!who.email);
    if (step === 1) return !!role;
    if (step === 2) {
      if (isFixedOrg) return true;
      const mode = role ? PERIMETER_MODE[role] : null;
      if (mode === 'entity') return perimeter.entityIds.length > 0;
      if (mode === 'entity-and-group') {
        if (perimeter.hrMode === 'entity') return perimeter.entityIds.length > 0;
        return !!perimeter.groupId;
      }
      return true;
    }
    return true;
  })();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleConfirm = () => {
    if (!role) return;
    const name = who.name ?? 'Unknown';
    const email = who.email ?? '';
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    const meta = ROLE_META[role];

    let perimeterValue: AccessPair['perimeter'];
    const mode = PERIMETER_MODE[role];
    if (mode === 'fixed-org') {
      perimeterValue = { type: 'org' };
    } else if (mode === 'entity') {
      perimeterValue = { type: 'entity', entityIds: perimeter.entityIds };
    } else {
      if (perimeter.hrMode === 'entity') {
        perimeterValue = { type: 'entity', entityIds: perimeter.entityIds };
      } else {
        perimeterValue = { type: 'entity-group', entityIds: [], groupIds: perimeter.groupId ? [perimeter.groupId] : [] };
      }
    }

    const newUser: AdminUser = {
      id: 'u-' + Date.now(),
      name,
      email,
      avatarInitials: initials,
      avatarColor: meta.color.replace('var(--', '').replace(')', ''),
      status: 'pending',
      access: [{ role, perimeter: perimeterValue }],
    };
    onAdd(newUser);
    onClose();
  };

  const perimeterLabel = () => {
    if (!role) return '—';
    const mode = PERIMETER_MODE[role];
    if (mode === 'fixed-org') return 'Organisation-wide';
    if (mode === 'entity' || (mode === 'entity-and-group' && perimeter.hrMode === 'entity')) {
      if (!perimeter.entityIds.length) return '—';
      return perimeter.entityIds.map(id => ENTITIES.find(e => e.id === id)?.name ?? id).join(', ');
    }
    if (mode === 'entity-and-group' && perimeter.hrMode === 'group') {
      return GROUPS.find(g => g.id === perimeter.groupId)?.name ?? '—';
    }
    return '—';
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,25,22,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '0.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 300, color: 'var(--text)', marginBottom: 4 }}>
              Invite admin
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i < step ? 'var(--text)' : i === step ? 'var(--text)' : 'var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 500,
                    color: i <= step ? 'var(--bg)' : 'var(--text3)',
                    fontFamily: "'DM Mono', monospace",
                    flexShrink: 0,
                  }}>
                    {i < step ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span style={{
                    fontSize: 11, color: i === step ? 'var(--text)' : 'var(--text3)',
                    fontWeight: i === step ? 500 : 400,
                  }}>
                    {s}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 16, height: 0.5, background: 'var(--border2)', margin: '0 2px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6,
            border: '0.5px solid var(--border2)', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="var(--text2)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {step === 0 && <StepWho value={who} onChange={setWho} />}
          {step === 1 && <StepRole value={role} onChange={setRole} />}
          {step === 2 && role && <StepPerimeter role={role} value={perimeter} onChange={setPerimeter} />}
          {step === 3 && role && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                padding: 16, borderRadius: 8,
                background: 'var(--bg)', border: '0.5px solid var(--border2)',
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  Summary
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Row label="Person" value={who.name ?? '—'} />
                  <Row label="Email" value={who.email ?? '—'} mono />
                  <Row label="Role" value={<RoleBadge role={role} size="sm" />} />
                  <Row label="Perimeter" value={perimeterLabel()} />
                </div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 7, background: 'rgba(192,74,30,0.06)', border: '0.5px solid rgba(192,74,30,0.15)' }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  An invitation email will be sent. The person will appear as <strong>Pending</strong> until they accept and join the organisation.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '0.5px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: 'var(--surface)',
        }}>
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            style={{
              padding: '8px 16px', borderRadius: 6,
              border: '0.5px solid var(--border2)', background: 'transparent',
              fontSize: 13, color: 'var(--text2)', cursor: 'pointer',
            }}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={() => {
              if (step === STEPS.length - 1) handleConfirm();
              else {
                if (step === 1 && isFixedOrg) setStep(3);
                else setStep(s => s + 1);
              }
            }}
            disabled={!canNext}
            style={{
              padding: '8px 20px', borderRadius: 6,
              border: 'none',
              background: canNext ? 'var(--text)' : 'var(--border)',
              color: canNext ? 'var(--bg)' : 'var(--text3)',
              fontSize: 13, fontWeight: 500,
              cursor: canNext ? 'pointer' : 'default',
              transition: 'all 0.12s',
            }}
          >
            {step === STEPS.length - 1 ? 'Send invitation' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
      <span style={{
        fontSize: 12, color: 'var(--text)', fontWeight: 500,
        fontFamily: mono ? "'DM Mono', monospace" : undefined,
      }}>
        {value}
      </span>
    </div>
  );
}
