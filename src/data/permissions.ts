import type { RoleKey } from './mock-users';

export type AccessLevel = 'none' | 'view' | 'manage' | 'custom';

export interface SubPermission {
  id: string;
  label: string;
  description: string;
}

export interface PermissionModule {
  id: string;
  label: string;
  description: string;
  icon: string;
  subPermissions: SubPermission[];
}

export interface ModuleAccess {
  moduleId: string;
  level: AccessLevel;
  enabledSubIds: string[];
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  baseRoleKey: RoleKey;
  modules: ModuleAccess[];
}

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: 'people-contracts',
    label: 'People & Contracts',
    description: 'Employee profiles, contracts and compensation',
    icon: 'people',
    subPermissions: [
      { id: 'view-profiles',     label: 'View employee profiles',  description: 'Access name, contact, and role info' },
      { id: 'edit-profiles',     label: 'Edit employee profiles',  description: 'Update personal and job information' },
      { id: 'manage-contracts',  label: 'Manage contracts',        description: 'Create, edit and terminate contracts' },
      { id: 'view-compensation', label: 'View compensation',       description: 'See salary and bonus data' },
      { id: 'view-sensitive',    label: 'View sensitive info',     description: 'Access health, diversity and confidential data' },
    ],
  },
  {
    id: 'tracker',
    label: 'Tracker',
    description: 'Onboarding, offboarding and change requests',
    icon: 'tracker',
    subPermissions: [
      { id: 'view-requests',    label: 'View requests',        description: 'See onboarding and offboarding tasks' },
      { id: 'process-requests', label: 'Process requests',     description: 'Complete and validate workflow steps' },
      { id: 'manage-templates', label: 'Manage templates',     description: 'Create and edit workflow templates' },
    ],
  },
  {
    id: 'time-off',
    label: 'Time Off',
    description: 'Leave requests and entitlements',
    icon: 'time-off',
    subPermissions: [
      { id: 'view-requests',    label: 'View requests',          description: 'See leave requests for managed employees' },
      { id: 'approve-requests', label: 'Approve / reject',       description: 'Validate or deny leave requests' },
      { id: 'view-sensitive',   label: 'View sensitive requests', description: 'Access medical and confidential leave details' },
      { id: 'manage-policies',  label: 'Manage policies',        description: 'Configure leave types and entitlements' },
    ],
  },
  {
    id: 'time-tracking',
    label: 'Time Tracking',
    description: 'Work hours and activity reports',
    icon: 'time-tracking',
    subPermissions: [
      { id: 'view-reports',     label: 'View time reports',     description: 'See employee work hours and activity' },
      { id: 'validate-reports', label: 'Validate time reports', description: 'Approve or reject time entries' },
      { id: 'export-data',      label: 'Export data',           description: 'Download time tracking reports' },
    ],
  },
  {
    id: 'payroll-payments',
    label: 'Payroll & Payments',
    description: 'Payroll runs, payments and payslips',
    icon: 'payroll',
    subPermissions: [
      { id: 'view-payslips',   label: 'View payslips',           description: 'Access employee payslips and salary history' },
      { id: 'run-payroll',     label: 'Run payroll',             description: 'Prepare and close monthly payroll' },
      { id: 'make-payments',   label: 'Make payments',           description: 'Process salary and expense payments' },
      { id: 'access-reports',  label: 'Payroll reports',         description: 'View payroll journals and declarations' },
      { id: 'manage-settings', label: 'Manage payroll settings', description: 'Configure payroll rules and schedules' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Document creation, templates and e-signature',
    icon: 'documents',
    subPermissions: [
      { id: 'view-documents',   label: 'View documents',      description: 'Access the document library' },
      { id: 'create-documents', label: 'Create documents',    description: 'Generate documents from templates' },
      { id: 'manage-templates', label: 'Manage templates',    description: 'Create and edit document templates' },
      { id: 'esignature',       label: 'E-signature',         description: 'Send and manage signature requests' },
    ],
  },
  {
    id: 'analytics-reports',
    label: 'Analytics & Reports',
    description: 'Custom reports, exports and analytics',
    icon: 'analytics',
    subPermissions: [
      { id: 'view-standard',    label: 'View standard reports', description: 'Access built-in company reports' },
      { id: 'export-data',      label: 'Export data',           description: 'Download reports and raw data' },
      { id: 'create-custom',    label: 'Create custom reports', description: 'Build and save custom report views' },
      { id: 'access-sensitive', label: 'Sensitive data access', description: 'View salary and personal data in reports' },
    ],
  },
  {
    id: 'company-settings',
    label: 'Company Settings',
    description: 'Company profile, policies and subscription',
    icon: 'company',
    subPermissions: [
      { id: 'view-settings',   label: 'View settings',   description: 'See company profile and configuration' },
      { id: 'edit-settings',   label: 'Edit settings',   description: 'Update company profile and bank info' },
      { id: 'manage-policies', label: 'Manage policies', description: 'Configure HR and payroll policies' },
      { id: 'manage-entities', label: 'Manage entities', description: 'Add, edit and configure entities' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function full(moduleId: string): ModuleAccess {
  return { moduleId, level: 'manage', enabledSubIds: [] };
}
function view(moduleId: string): ModuleAccess {
  return { moduleId, level: 'view', enabledSubIds: [] };
}
function none(moduleId: string): ModuleAccess {
  return { moduleId, level: 'none', enabledSubIds: [] };
}
function custom(moduleId: string, enabledSubIds: string[]): ModuleAccess {
  return { moduleId, level: 'custom', enabledSubIds };
}

// ── Default permissions per built-in role ─────────────────────────────────────

export const ROLE_MODULE_DEFAULTS: Record<RoleKey, ModuleAccess[]> = {
  org: PERMISSION_MODULES.map(m => full(m.id)),

  payroll: [
    full('people-contracts'),
    full('tracker'),
    full('time-off'),
    full('time-tracking'),
    full('payroll-payments'),
    full('documents'),
    custom('analytics-reports', ['view-standard', 'export-data', 'create-custom']),
    view('company-settings'),
  ],

  hr: [
    full('people-contracts'),
    full('tracker'),
    full('time-off'),
    full('time-tracking'),
    none('payroll-payments'),
    custom('documents', ['view-documents', 'create-documents', 'esignature']),
    view('analytics-reports'),
    none('company-settings'),
  ],

  acct: [
    none('people-contracts'),
    none('tracker'),
    none('time-off'),
    none('time-tracking'),
    custom('payroll-payments', ['view-payslips', 'access-reports']),
    none('documents'),
    full('analytics-reports'),
    none('company-settings'),
  ],

  mgr: [
    view('people-contracts'),
    none('tracker'),
    full('time-off'),
    full('time-tracking'),
    none('payroll-payments'),
    none('documents'),
    none('analytics-reports'),
    none('company-settings'),
  ],
};

/** Deep-copy a role's defaults so they can be mutated safely */
export function seedModules(baseRoleKey: RoleKey): ModuleAccess[] {
  return ROLE_MODULE_DEFAULTS[baseRoleKey].map(m => ({ ...m, enabledSubIds: [...m.enabledSubIds] }));
}

/** Count active sub-permissions (custom level only) */
export function countEnabledSubs(access: ModuleAccess): number {
  const mod = PERMISSION_MODULES.find(m => m.id === access.moduleId);
  if (!mod) return 0;
  if (access.level === 'custom') return access.enabledSubIds.length;
  if (access.level === 'manage') return mod.subPermissions.length;
  return 0;
}
