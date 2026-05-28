import { Navigate, Outlet, useLocation } from 'react-router-dom';
export function Employees() {
  const location = useLocation();
  if (location.pathname === '/employees' || location.pathname === '/employees/') {
    return <Navigate to="/employees/list" replace />;
  }
  return <Outlet />;
}
