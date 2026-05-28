import { Navigate, Outlet, useLocation } from 'react-router-dom';
export function RunPayroll() {
  const location = useLocation();
  if (location.pathname === '/payroll' || location.pathname === '/payroll/') {
    return <Navigate to="/payroll/review" replace />;
  }
  return <Outlet />;
}
