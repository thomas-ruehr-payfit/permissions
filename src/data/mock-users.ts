export type RoleKey = 'org' | 'payroll' | 'hr' | 'acct' | 'mgr';

// ── Perimeter types ───────────────────────────────────────────────────────────

export interface ManagerPermissions {
  validateAbsences: boolean;
  validateExpenses: boolean;
  validateTimeReports: boolean;
  viewAbsences: boolean;
  viewSalary: boolean;
}

export interface ManagerReport {
  employeeId: string;
  permissions: ManagerPermissions;
}

export type AccessPerimeter =
  | { type: 'org' }
  | { type: 'entity';        entityIds: string[] }
  | { type: 'entity-group';  entityIds: string[]; groupIds: string[] }
  | { type: 'manager';       reports: ManagerReport[] };

export interface AccessPair {
  role: RoleKey;
  perimeter: AccessPerimeter;
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  status: 'active' | 'pending';
  access: AccessPair[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'Sophie Marchand',
    email: 'sophie.marchand@acme.com',
    avatarInitials: 'SM', avatarColor: '#5B4FD4', status: 'active',
    access: [
      { role: 'org', perimeter: { type: 'org' } },
    ],
  },
  {
    id: 'u2',
    name: 'Lucas Fontaine',
    email: 'lucas.fontaine@acme.com',
    avatarInitials: 'LF', avatarColor: '#0F6E56', status: 'active',
    access: [
      { role: 'payroll', perimeter: { type: 'entity', entityIds: ['fr', 'es'] } },
    ],
  },
  {
    id: 'u3',
    name: 'Amara Diallo',
    email: 'amara.diallo@acme.com',
    avatarInitials: 'AD', avatarColor: '#C04A1E', status: 'active',
    access: [
      { role: 'hr', perimeter: { type: 'entity-group', entityIds: ['fr'], groupIds: [] } },
    ],
  },
  {
    id: 'u4',
    name: 'Inès Bouchard',
    email: 'ines.bouchard@acme.com',
    avatarInitials: 'IB', avatarColor: '#6C2E9A', status: 'active',
    access: [
      // HR on entities FR+UK and group People Ops — additive
      { role: 'hr', perimeter: { type: 'entity-group', entityIds: ['fr', 'uk'], groupIds: ['people'] } },
    ],
  },
  {
    id: 'u5',
    name: 'Théo Renard',
    email: 'theo.renard@acme.com',
    avatarInitials: 'TR', avatarColor: '#1458A8', status: 'active',
    access: [
      { role: 'acct', perimeter: { type: 'entity', entityIds: ['es', 'uk'] } },
    ],
  },
  {
    id: 'u6',
    name: 'Chiara Romano',
    email: 'chiara.romano@acme.com',
    avatarInitials: 'CR', avatarColor: '#6C2E9A', status: 'active',
    access: [
      { role: 'hr', perimeter: { type: 'entity-group', entityIds: [], groupIds: ['eng'] } },
    ],
  },
  {
    id: 'u7',
    name: 'James Okafor',
    email: 'james.okafor@partner.com',
    avatarInitials: 'JO', avatarColor: '#1458A8', status: 'pending',
    access: [
      { role: 'acct', perimeter: { type: 'entity', entityIds: ['uk'] } },
    ],
  },
  {
    id: 'u8',
    name: 'Martina García',
    email: 'martina.garcia@acme.com',
    avatarInitials: 'MG', avatarColor: '#0F6E56', status: 'pending',
    access: [
      { role: 'payroll', perimeter: { type: 'entity', entityIds: ['es'] } },
    ],
  },
  // Pure manager
  {
    id: 'm1',
    name: 'Rafael Torres',
    email: 'rafael.torres@acme.com',
    avatarInitials: 'RT', avatarColor: '#6C2E9A', status: 'active',
    access: [{
      role: 'mgr',
      perimeter: {
        type: 'manager',
        reports: [
          { employeeId: 't1', permissions: { validateAbsences: true,  validateExpenses: true,  validateTimeReports: false, viewAbsences: true,  viewSalary: false } },
          { employeeId: 't2', permissions: { validateAbsences: true,  validateExpenses: false, validateTimeReports: false, viewAbsences: true,  viewSalary: false } },
          { employeeId: 't3', permissions: { validateAbsences: true,  validateExpenses: true,  validateTimeReports: false, viewAbsences: true,  viewSalary: false } },
        ],
      },
    }],
  },
  // Accountant + Manager
  {
    id: 'm2',
    name: 'Nadia Lefebvre',
    email: 'nadia.lefebvre@acme.com',
    avatarInitials: 'NL', avatarColor: '#1458A8', status: 'active',
    access: [
      { role: 'acct', perimeter: { type: 'entity', entityIds: ['fr', 'es'] } },
      {
        role: 'mgr',
        perimeter: {
          type: 'manager',
          reports: [
            { employeeId: 't6', permissions: { validateAbsences: true,  validateExpenses: false, validateTimeReports: false, viewAbsences: true,  viewSalary: true  } },
            { employeeId: 't8', permissions: { validateAbsences: true,  validateExpenses: false, validateTimeReports: false, viewAbsences: true,  viewSalary: false } },
          ],
        },
      },
    ],
  },
];

// ── Employee pools ────────────────────────────────────────────────────────────

/** Employees who can be selected as manager reports */
export const TEAM_MEMBERS = [
  { id: 't1',  name: 'Alice Martin',    email: 'alice.martin@acme.com',   title: 'Frontend Engineer'   },
  { id: 't2',  name: 'Baptiste Leroy',  email: 'baptiste.leroy@acme.com', title: 'Backend Engineer'    },
  { id: 't3',  name: 'Camille Durand',  email: 'camille.durand@acme.com', title: 'Product Designer'    },
  { id: 't4',  name: 'David Chen',      email: 'david.chen@acme.com',     title: 'HR Business Partner' },
  { id: 't5',  name: 'Emma Roux',       email: 'emma.roux@acme.com',      title: 'Recruiter'           },
  { id: 't6',  name: 'François Blanc',  email: 'f.blanc@acme.com',        title: 'Finance Controller'  },
  { id: 't7',  name: 'Grace Kim',       email: 'grace.kim@acme.com',      title: 'Accountant'          },
  { id: 't8',  name: 'Hugo Perrin',     email: 'hugo.perrin@acme.com',    title: 'Remote Engineer'     },
  { id: 't9',  name: 'Isabelle Morin',  email: 'i.morin@acme.com',        title: 'Sales Manager'       },
  { id: 't10', name: 'Jules Garnier',   email: 'jules.garnier@acme.com',  title: 'DevOps Engineer'     },
];

/** Employees who can be invited as admins */
export const ORG_EMPLOYEES = [
  { id: 'e1', name: 'Hugo Bernard',  email: 'hugo.bernard@acme.com',  title: 'Lead Engineer'      },
  { id: 'e2', name: 'Nour El-Amin', email: 'nour.el-amin@acme.com',  title: 'People Partner'     },
  { id: 'e3', name: 'Elsa Petit',   email: 'elsa.petit@acme.com',    title: 'Finance Analyst'    },
  { id: 'e4', name: 'Carlos Reyes', email: 'carlos.reyes@acme.com',  title: 'Payroll Specialist' },
];
