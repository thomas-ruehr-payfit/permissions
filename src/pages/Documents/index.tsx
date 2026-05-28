import { Navigate, Outlet, useLocation } from 'react-router-dom';
export function Documents() {
  const location = useLocation();
  if (location.pathname === '/documents' || location.pathname === '/documents/') {
    return <Navigate to="/documents/list" replace />;
  }
  return <Outlet />;
}
