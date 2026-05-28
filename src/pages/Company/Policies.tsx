import { NAV_SECTIONS } from '../../data/role-access';
import { SubPageTabs } from '../../components/ui/SubPageTabs';
const sub = NAV_SECTIONS.find(s => s.id === 'company')!.subItems.find(s => s.id === 'policies')!;
export function Policies() {
  return <SubPageTabs tabs={(sub.subItems ?? []).map(s => ({ label: s.label, path: s.path, flag: s.flag }))} />;
}
