import { useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '../data/role-access';
import { PlaceholderPage } from './PlaceholderPage';

// Overlay section labels for top-bar routes not in NAV_SECTIONS
const OVERLAY_LABELS: Record<string, string> = {
  '/integrations/all':       'All Integrations',
  '/integrations/activated': 'Activated Integrations',
  '/integrations/api':       'API Accesses',
  '/help/centre':            'Help Centre',
  '/help/inbox':             'PayFit Inbox',
  '/help/academy':           'PayFit Academy',
};

function findLabel(pathname: string): string {
  if (OVERLAY_LABELS[pathname]) return OVERLAY_LABELS[pathname];
  for (const section of NAV_SECTIONS) {
    for (const sub of section.subItems) {
      if (sub.subItems) {
        for (const item of sub.subItems) {
          if (pathname === item.path || pathname.startsWith(item.path + '/')) {
            return item.label;
          }
        }
      }
    }
  }
  return 'Coming soon';
}

export function AutoPlaceholder() {
  const { pathname } = useLocation();
  const label = findLabel(pathname);
  return <PlaceholderPage title={label} description="" />;
}
