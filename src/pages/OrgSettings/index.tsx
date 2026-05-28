import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function OrgSettings() {
  const location = useLocation();
  if (location.pathname === '/org-settings' || location.pathname === '/org-settings/') {
    return <Navigate to="/org-settings/access-permissions" replace />;
  }
  return <Outlet />;
}
