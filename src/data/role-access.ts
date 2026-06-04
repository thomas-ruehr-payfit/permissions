import type { RoleKey } from './mock-users';

export interface NavSubSubItem {
  id: string;
  label: string;
  path: string;
  flag?: string;
}

export interface NavSubItem {
  id: string;
  label: string;
  path: string;
  visibleTo: RoleKey[];
  subItems?: NavSubSubItem[];
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  visibleTo: RoleKey[];
  defaultPath: string;
  subItems: NavSubItem[];
}

export const ROLE_META: Record<RoleKey, { label: string; labelFr: string; color: string; bg: string; description: string }> = {
  org: {
    label: 'Organisation Admin',
    labelFr: 'Admin Organisation',
    color: 'var(--org)',
    bg: 'var(--org-bg)',
    description: 'Full access to all features and data — except confidential conversations between managers and their reports. Can manage entities and all admin roles.',
  },
  payroll: {
    label: 'Payroll Manager',
    labelFr: 'Responsable Paie',
    color: 'var(--entity)',
    bg: 'var(--entity-bg)',
    description: 'Full operational access within assigned entities. Cannot add entities or manage org-level roles.',
  },
  hr: {
    label: 'HR Manager',
    labelFr: 'Gestionnaire RH',
    color: 'var(--hr)',
    bg: 'var(--hr-bg)',
    description: 'HR objects, personal employee data, and payslips. Perimeter by entity or group.',
  },
  acct: {
    label: 'Accountant',
    labelFr: 'Comptable',
    color: 'var(--acct)',
    bg: 'var(--acct-bg)',
    description: 'Read-oriented access to financial outputs, reports, exports and declarations.',
  },
  mgr: {
    label: 'Manager',
    labelFr: 'Manager',
    color: 'var(--mgr)',
    bg: 'var(--mgr-bg)',
    description: 'Relationship-derived — not assignable. Manager space only: 1:1s, absences, objectives.',
  },
};

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'employees',
    label: 'Employees',
    icon: 'employees',
    visibleTo: ['org', 'payroll', 'hr', 'mgr'],
    defaultPath: '/employees/list',
    subItems: [
      { id: 'employee-list', label: 'Employee List', path: '/employees/list', visibleTo: ['org', 'payroll', 'hr'] },
      {
        id: 'new-hires', label: 'New Hires', path: '/employees/new-hires', visibleTo: ['org', 'payroll', 'hr'],
        subItems: [
          { id: 'ob-questionnaire', label: 'OB Questionnaire', path: '/employees/new-hires/ob-questionnaire' },
          { id: 'ob-checklist',     label: 'OB Checklist',     path: '/employees/new-hires/ob-checklist'     },
        ],
      },
      {
        id: 'activity', label: 'Activity', path: '/employees/activity', visibleTo: ['org', 'payroll', 'hr'],
        subItems: [
          { id: 'time-planning',   label: 'Time Planning',  path: '/employees/activity/time-planning'  },
          { id: 'projects',        label: 'Projects',       path: '/employees/activity/projects'       },
          { id: 'time-on',         label: 'Time-on',        path: '/employees/activity/time-on'        },
          { id: 'work-location',   label: 'Work Location',  path: '/employees/activity/work-location'  },
          { id: 'apprenticeship',  label: 'Apprenticeship', path: '/employees/activity/apprenticeship' },
        ],
      },
      {
        id: 'leaves', label: 'Leaves', path: '/employees/leaves', visibleTo: ['org', 'payroll', 'hr', 'mgr'],
        subItems: [
          { id: 'holidays',       label: 'Holidays',        path: '/employees/leaves/holidays'       },
          { id: 'sick-leaves',    label: 'Sick Leaves',     path: '/employees/leaves/sick-leaves'    },
          { id: 'parental',       label: 'Parental Leaves', path: '/employees/leaves/parental'       },
          { id: 'unpaid',         label: 'Unpaid Leaves',   path: '/employees/leaves/unpaid'         },
        ],
      },
      {
        id: 'compensation', label: 'Compensation', path: '/employees/compensation', visibleTo: ['org', 'payroll', 'hr'],
        subItems: [
          { id: 'salary',         label: 'Salary',                path: '/employees/compensation/salary'        },
          { id: 'expenses',       label: 'Expenses',              path: '/employees/compensation/expenses'      },
          { id: 'contributions',  label: 'Employee Contributions', path: '/employees/compensation/contributions' },
        ],
      },
      { id: 'bonuses', label: 'Bonuses', path: '/employees/bonuses', visibleTo: ['org', 'payroll'] },
      {
        id: 'benefits', label: 'Benefits', path: '/employees/benefits', visibleTo: ['org', 'payroll', 'hr'],
        subItems: [
          { id: 'meals',     label: 'Meals',             path: '/employees/benefits/meals'     },
          { id: 'transport', label: 'Transport',         path: '/employees/benefits/transport' },
          { id: 'medical',   label: 'Medical Insurance', path: '/employees/benefits/medical'   },
          { id: 'life-ins',  label: 'Life Insurance',    path: '/employees/benefits/life-ins',  flag: '🇫🇷' },
          { id: 'pension',   label: 'Pension',           path: '/employees/benefits/pension',   flag: '🇬🇧' },
          { id: 'training',  label: 'Training',          path: '/employees/benefits/training',  flag: '🇬🇧' },
          { id: 'wealth',    label: 'Wealth',            path: '/employees/benefits/wealth'    },
        ],
      },
      {
        id: 'performance', label: 'Performance + Goals', path: '/employees/performance', visibleTo: ['org', 'payroll', 'hr', 'mgr'],
        subItems: [
          { id: 'reviews',  label: 'Performance Reviews', path: '/employees/performance/reviews'  },
          { id: 'surveys',  label: 'Surveys',             path: '/employees/performance/surveys'  },
          { id: 'goals',    label: 'Goals',               path: '/employees/performance/goals'    },
          { id: 'checkins', label: '1:1 Check-ins',       path: '/employees/performance/checkins' },
        ],
      },
    ],
  },
  {
    id: 'payroll',
    label: 'Run Payroll',
    icon: 'payroll',
    visibleTo: ['org', 'payroll'],
    defaultPath: '/payroll/review',
    subItems: [
      { id: 'review-payroll', label: 'Review and Close', path: '/payroll/review', visibleTo: ['org', 'payroll'] },
      {
        id: 'pay-employees', label: 'Pay Employees', path: '/payroll/payments', visibleTo: ['org', 'payroll'],
        subItems: [
          { id: 'monthly',    label: "This Month's Payments",  path: '/payroll/payments/monthly'    },
          { id: 'advances',   label: 'Salary Advances',        path: '/payroll/payments/advances'   },
          { id: 'reimburse',  label: 'Expense Reimbursements', path: '/payroll/payments/reimburse'  },
          { id: 'settlement', label: 'Final Settlement',       path: '/payroll/payments/settlement', flag: '🇫🇷' },
          { id: 'past',       label: 'Past Payments',          path: '/payroll/payments/past'       },
        ],
      },
      {
        id: 'post-payroll', label: 'Post-Payroll', path: '/payroll/post', visibleTo: ['org', 'payroll'],
        subItems: [
          { id: 'post-accounting', label: 'Accounting',        path: '/payroll/post/accounting' },
          { id: 'post-reports',    label: 'Reports',           path: '/payroll/post/reports'    },
          { id: 'post-docs',       label: 'Payroll Documents', path: '/payroll/post/docs'       },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    icon: 'company',
    visibleTo: ['org', 'payroll', 'acct'],
    defaultPath: '/company/profile',
    subItems: [
      {
        id: 'company-profile', label: 'Company Profile', path: '/company/profile', visibleTo: ['org', 'payroll'],
        subItems: [
          { id: 'general-info', label: 'General Info', path: '/company/profile/general'   },
          { id: 'bank-info',    label: 'Bank Info',    path: '/company/profile/bank'      },
          { id: 'industry',     label: 'Industry',     path: '/company/profile/industry'  },
          { id: 'headcount',    label: 'Headcount',    path: '/company/profile/headcount' },
        ],
      },
      {
        id: 'subscription', label: 'PayFit Subscription', path: '/company/subscription', visibleTo: ['org'],
        subItems: [
          { id: 'invoices', label: 'Your Invoices', path: '/company/subscription/invoices' },
          { id: 'plan',     label: 'Your Plan',     path: '/company/subscription/plan'     },
        ],
      },
      { id: 'journals', label: 'Payroll Journals', path: '/company/journals', visibleTo: ['org', 'payroll', 'acct'] },
      {
        id: 'analytics', label: 'Analytics + Exports', path: '/company/analytics', visibleTo: ['org', 'payroll', 'acct'],
        subItems: [
          { id: 'custom-reports',  label: 'Custom Reports',   path: '/company/analytics/custom'    },
          { id: 'company-reports', label: 'Company Reports',  path: '/company/analytics/company'   },
          { id: 'emp-register',    label: 'Employee Register', path: '/company/analytics/register', flag: '🇫🇷' },
        ],
      },
      {
        id: 'policies', label: 'Company Policies', path: '/company/policies', visibleTo: ['org', 'payroll'],
        subItems: [
          { id: 'pol-activity',  label: 'Activity',             path: '/company/policies/activity'     },
          { id: 'pol-leaves',    label: 'Leaves',               path: '/company/policies/leaves'       },
          { id: 'pol-comp',      label: 'Compensation',         path: '/company/policies/compensation' },
          { id: 'pol-bonuses',   label: 'Bonuses',              path: '/company/policies/bonuses'      },
          { id: 'pol-benefits',  label: 'Benefits',             path: '/company/policies/benefits'     },
          { id: 'pol-contracts', label: 'Employment Contracts', path: '/company/policies/contracts'    },
        ],
      },
      {
        id: 'roles-permissions', label: 'Roles + Permissions', path: '/company/roles-permissions', visibleTo: ['org'],
        subItems: [
          { id: 'payroll-approval', label: 'Payroll Approval',           path: '/company/roles-permissions/payroll-approval' },
          { id: 'admin-notifs',     label: 'Admin Notification Settings', path: '/company/roles-permissions/notifications'   },
        ],
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: 'documents',
    visibleTo: ['org', 'payroll', 'hr'],
    defaultPath: '/documents/list',
    subItems: [
      { id: 'doc-list',   label: 'Documents List',     path: '/documents/list',      visibleTo: ['org', 'payroll', 'hr'] },
      {
        id: 'templates', label: 'Document Templates', path: '/documents/templates', visibleTo: ['org', 'payroll', 'hr'],
        subItems: [
          { id: 'drafts',    label: 'Drafts',             path: '/documents/templates/drafts'    },
          { id: 'generated', label: 'Generated Documents', path: '/documents/templates/generated' },
          { id: 'gallery',   label: 'Template Gallery',   path: '/documents/templates/gallery'   },
          { id: 'custom',    label: 'Custom Templates',   path: '/documents/templates/custom'    },
        ],
      },
      { id: 'esignature', label: 'E-Signature', path: '/documents/esignature', visibleTo: ['org', 'payroll', 'hr'] },
    ],
  },
];

export const ASSIGNABLE_ROLES: RoleKey[] = ['org', 'payroll', 'hr', 'acct'];

export type PerimeterMode = 'fixed-org' | 'entity' | 'entity-or-group';

export const PERIMETER_MODE: Record<RoleKey, PerimeterMode> = {
  org: 'fixed-org',
  payroll: 'entity',
  hr: 'entity-or-group',
  acct: 'entity',
  mgr: 'fixed-org',
};
