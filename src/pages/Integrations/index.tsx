import { Navigate, useLocation } from 'react-router-dom';
import { OverlayShell } from '../../components/layout/OverlayShell';

const SECTIONS = [
  { id: 'all',       label: 'All Integrations',       path: '/integrations/all'       },
  { id: 'activated', label: 'Activated Integrations', path: '/integrations/activated' },
  { id: 'api',       label: 'API Accesses',            path: '/integrations/api'       },
];

const ICON = (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M11 8.5v1.5M11 10v1.5m0 0H9.5m1.5 0H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export function IntegrationsShell() {
  const location = useLocation();
  if (location.pathname === '/integrations' || location.pathname === '/integrations/') {
    return <Navigate to="/integrations/all" replace />;
  }
  return <OverlayShell title="Integrations" icon={ICON} sections={SECTIONS} />;
}
