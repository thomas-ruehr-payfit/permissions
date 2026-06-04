import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../../context/UsersContext';
import { ORG_EMPLOYEES } from '../../../data/mock-users';
import { StepWho } from './StepWho';
import { StepAccess } from './StepAccess';
import { StepReview } from './StepReview';
import { INITIAL_INVITE } from './types';
import type { InviteState } from './types';
import type { AccessPair } from '../../../data/mock-users';

const STEPS = [
  { num: 1 as const, label: 'Who are you inviting?' },
  { num: 2 as const, label: 'Access' },
  { num: 3 as const, label: 'Review & send' },
];

const STEP_TITLES: Record<number, string> = {
  1: 'Who are you inviting?',
  2: 'What access should they have?',
  3: 'Review & confirm',
};

function canProceed(step: number, invite: InviteState): boolean {
  switch (step) {
    case 1:
      if (!invite.whoType) return false;
      if (invite.whoType === 'existing') return !!invite.selectedEmployeeId;
      return !!invite.newName.trim() && !!invite.newEmail.trim();
    case 2:
      return invite.pairs.length > 0 && invite.pairs.every(p => {
        if (!p.role) return false;
        if (p.role === 'org') return true;
        if (p.role === 'mgr') return p.reports.length > 0;
        if (p.role === 'hr') return p.entityIds.length > 0 || p.groupIds.length > 0;
        return p.entityIds.length > 0;
      });
    case 3:
      return true;
    default:
      return false;
  }
}

type StepNum = 1 | 2 | 3;

export function InviteFlowPage() {
  const navigate = useNavigate();
  const { addUser } = useUsers();

  const [step, setStep] = useState<StepNum>(1);
  const [invite, setInvite] = useState<InviteState>(INITIAL_INVITE);

  const goNext = () => {
    if (step === 3) { handleSubmit(); return; }
    setStep(s => (s + 1) as StepNum);
  };

  const goPrev = () => {
    if (step === 1) { navigate('/org-settings/access-permissions'); return; }
    setStep(s => (s - 1) as StepNum);
  };

  const handleSubmit = () => {
    let name = invite.newName;
    let email = invite.newEmail;
    let initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    if (invite.whoType === 'existing' && invite.selectedEmployeeId) {
      const emp = ORG_EMPLOYEES.find(e => e.id === invite.selectedEmployeeId)!;
      name = emp.name;
      email = emp.email;
      initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }

    const access: AccessPair[] = invite.pairs
      .filter(p => p.role !== null)
      .map(p => {
        let perimeter: AccessPair['perimeter'];
        if (p.role === 'org') {
          perimeter = { type: 'org' };
        } else if (p.role === 'mgr') {
          perimeter = { type: 'manager', reports: p.reports };
        } else if (p.role === 'hr') {
          perimeter = { type: 'entity-group', entityIds: p.entityIds, groupIds: p.groupIds };
        } else {
          perimeter = { type: 'entity', entityIds: p.entityIds };
        }
        return { role: p.role!, perimeter };
      });

    addUser({
      id: `u${Date.now()}`,
      name,
      email,
      avatarInitials: initials || '??',
      avatarColor: '#5B4FD4',
      status: 'pending',
      access,
    });

    navigate('/org-settings/access-permissions');
  };

  const progress = step / STEPS.length;
  const ok = canProceed(step, invite);

  const stepContent = {
    1: <StepWho invite={invite} setInvite={setInvite} />,
    2: <StepAccess invite={invite} setInvite={setInvite} />,
    3: <StepReview invite={invite} />,
  }[step];

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        height: 52, flexShrink: 0,
        background: 'var(--surface)', borderBottom: '0.5px solid var(--border2)',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        position: 'relative',
      }}>
        <button
          onClick={() => navigate('/org-settings/access-permissions')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--text2)', padding: '4px 8px', borderRadius: 5,
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Access & Permissions
        </button>
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: 13, fontWeight: 500, color: 'var(--text)',
        }}>
          Invite admin
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--org)', transition: 'width 0.35s ease' }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', padding: '28px 32px', gap: 20 }}>

        {/* Step nav */}
        <div style={{
          width: 230, flexShrink: 0,
          background: 'var(--surface)', border: '0.5px solid var(--border2)',
          borderRadius: 12, padding: '10px 8px',
          display: 'flex', flexDirection: 'column', gap: 2,
          alignSelf: 'start',
        }}>
          {STEPS.map(s => {
            const isDone = s.num < step;
            const isActive = s.num === step;
            return (
              <button
                key={s.num}
                onClick={() => isDone && setStep(s.num)}
                disabled={!isDone && !isActive}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px', borderRadius: 7, width: '100%',
                  border: isActive ? '0.5px solid var(--border2)' : 'none',
                  background: isActive ? 'var(--bg)' : 'transparent',
                  cursor: isDone ? 'pointer' : 'default',
                  transition: 'all 0.1s', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'var(--text)' : 'transparent',
                  border: `1.5px solid ${isActive ? 'var(--text)' : isDone ? 'var(--text3)' : 'var(--border2)'}`,
                  transition: 'all 0.15s',
                }}>
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--text3)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: isActive ? 'white' : 'var(--text3)', lineHeight: 1 }}>
                      {s.num}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--text)' : isDone ? 'var(--text2)' : 'var(--text3)' }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content card */}
        <div style={{
          flex: 1, background: 'var(--surface)', border: '0.5px solid var(--border2)',
          borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 300,
              color: 'var(--text)', marginBottom: 0, lineHeight: 1.2,
            }}>
              {STEP_TITLES[step]}
            </h2>
            <div style={{ marginTop: 20 }}>
              {stepContent}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '14px 32px', flexShrink: 0,
            borderTop: '0.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onClick={goPrev}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text2)', padding: '8px 0',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M8 2L3 6.5l5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {step === 1 ? 'Cancel' : 'Previous'}
            </button>

            <button
              onClick={goNext}
              disabled={!ok}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 7, border: 'none',
                background: ok ? 'var(--text)' : 'var(--border2)',
                color: ok ? 'white' : 'var(--text3)',
                fontSize: 13, fontWeight: 500, cursor: ok ? 'pointer' : 'default',
                transition: 'all 0.12s',
              }}
            >
              {step === 3 ? 'Send invitation' : 'Next'}
              {step !== 3 && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M5 2l5 4.5L5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
