import { NAV_SECTIONS } from '../../data/role-access';
import { SubPageTabs } from '../../components/ui/SubPageTabs';

const section = NAV_SECTIONS.find(s => s.id === 'company')!;
const subItem = section.subItems.find(s => s.id === 'roles-permissions')!;
const tabs = (subItem.subItems ?? []).map(s => ({ label: s.label, path: s.path, flag: s.flag }));

export function RolesPermissions() {
  return <SubPageTabs tabs={tabs} />;
}
