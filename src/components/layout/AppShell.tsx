import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useRoleView } from '../../context/RoleViewContext';
import { NAV_SECTIONS } from '../../data/role-access';
import { Sidebar } from './Sidebar';
import { useEffect } from 'react';

export function AppShell() {
  const { viewAs } = useRoleView();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const visibleSections = NAV_SECTIONS.filter(s => s.visibleTo.includes(viewAs));

    // Find which section the current path belongs to
    const currentSection = NAV_SECTIONS.find(s =>
      location.pathname.startsWith('/' + s.id)
    );

    // If current section is not visible for this role, redirect to first visible section
    if (currentSection && !visibleSections.find(s => s.id === currentSection.id)) {
      const first = visibleSections[0];
      if (first) {
        const firstVisibleSub = first.subItems.filter(i => i.visibleTo.includes(viewAs))[0];
        navigate(firstVisibleSub?.path ?? first.defaultPath);
      }
    }
  }, [viewAs, location.pathname, navigate]);

  return (
    <>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </>
  );
}
