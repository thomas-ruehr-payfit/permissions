import { NAV_SECTIONS } from '../../data/role-access';
import { SubPageTabs } from '../../components/ui/SubPageTabs';
const sub = NAV_SECTIONS.find(s => s.id === 'company')!.subItems.find(s => s.id === 'subscription')!;
export function Subscription() {
  return <SubPageTabs tabs={(sub.subItems ?? []).map(s => ({ label: s.label, path: s.path, flag: s.flag }))} />;
}
