import { NAV_SECTIONS } from '../../data/role-access';
import { SubPageTabs } from '../../components/ui/SubPageTabs';
const sub = NAV_SECTIONS.find(s => s.id === 'employees')!.subItems.find(s => s.id === 'activity')!;
export function Activity() {
  return <SubPageTabs tabs={(sub.subItems ?? []).map(s => ({ label: s.label, path: s.path, flag: s.flag }))} />;
}
