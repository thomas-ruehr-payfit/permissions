import { Navigate, useLocation } from 'react-router-dom';
import { OverlayShell } from '../../components/layout/OverlayShell';

const SECTIONS = [
  { id: 'centre',   label: 'Help Centre',           path: '/help/centre'   },
  { id: 'inbox',    label: 'PayFit Inbox',           path: '/help/inbox'    },
  { id: 'academy',  label: 'PayFit Academy',         path: '/help/academy'  },
];

const ICON = (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5.5 5.5a2 2 0 013.5 1.333C9 8 7.5 8.5 7.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="7.5" cy="11.5" r=".5" fill="currentColor"/>
  </svg>
);

export function HelpShell() {
  const location = useLocation();
  if (location.pathname === '/help' || location.pathname === '/help/') {
    return <Navigate to="/help/centre" replace />;
  }
  return <OverlayShell title="Help" icon={ICON} sections={SECTIONS} />;
}
