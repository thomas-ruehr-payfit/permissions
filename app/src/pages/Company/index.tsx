import { Outlet, Navigate, useLocation } from 'react-router-dom';

export function Company() {
  const location = useLocation();
  if (location.pathname === '/company' || location.pathname === '/company/') {
    return <Navigate to="/company/profile" replace />;
  }
  return <Outlet />;
}
