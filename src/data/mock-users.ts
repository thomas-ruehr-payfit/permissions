export type RoleKey = 'org' | 'payroll' | 'hr' | 'acct' | 'mgr';

export type PerimeterType = 'org' | 'entity' | 'group';

export interface AccessPair {
  role: RoleKey;
  perimeter: {
    type: PerimeterType;
    entityIds?: string[];
    groupIds?: string[];
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  status: 'active' | 'pending';
  access: AccessPair[];
}

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'Sophie Marchand',
    email: 'sophie.marchand@acme.com',
    avatarInitials: 'SM',
    avatarColor: '#5B4FD4',
    status: 'active',
    access: [
      { role: 'org', perimeter: { type: 'org' } },
    ],
  },
  {
    id: 'u2',
    name: 'Lucas Fontaine',
    email: 'lucas.fontaine@acme.com',
    avatarInitials: 'LF',
    avatarColor: '#0F6E56',
    status: 'active',
    access: [
      { role: 'payroll', perimeter: { type: 'entity', entityIds: ['fr', 'es'] } },
    ],
  },
  {
    id: 'u3',
    name: 'Amara Diallo',
    email: 'amara.diallo@acme.com',
    avatarInitials: 'AD',
    avatarColor: '#C04A1E',
    status: 'active',
    access: [
      { role: 'hr', perimeter: { type: 'entity', entityIds: ['fr'] } },
    ],
  },
  {
    id: 'u4',
    name: 'Inès Bouchard',
    email: 'ines.bouchard@acme.com',
    avatarInitials: 'IB',
    avatarColor: '#6C2E9A',
    status: 'active',
    access: [
      { role: 'hr', perimeter: { type: 'entity', entityIds: ['fr', 'uk'] } },
    ],
  },
  {
    id: 'u5',
    name: 'Théo Renard',
    email: 'theo.renard@acme.com',
    avatarInitials: 'TR',
    avatarColor: '#1458A8',
    status: 'active',
    access: [
      { role: 'acct', perimeter: { type: 'entity', entityIds: ['es', 'uk'] } },
    ],
  },
  {
    id: 'u6',
    name: 'Chiara Romano',
    email: 'chiara.romano@acme.com',
    avatarInitials: 'CR',
    avatarColor: '#6C2E9A',
    status: 'active',
    access: [
      { role: 'hr', perimeter: { type: 'group', groupIds: ['eng'] } },
    ],
  },
  {
    id: 'u7',
    name: 'James Okafor',
    email: 'james.okafor@partner.com',
    avatarInitials: 'JO',
    avatarColor: '#1458A8',
    status: 'pending',
    access: [
      { role: 'acct', perimeter: { type: 'entity', entityIds: ['uk'] } },
    ],
  },
  {
    id: 'u8',
    name: 'Martina García',
    email: 'martina.garcia@acme.com',
    avatarInitials: 'MG',
    avatarColor: '#0F6E56',
    status: 'pending',
    access: [
      { role: 'payroll', perimeter: { type: 'entity', entityIds: ['es'] } },
    ],
  },
];

export const ORG_EMPLOYEES = [
  { id: 'e1', name: 'Hugo Bernard', email: 'hugo.bernard@acme.com', title: 'Lead Engineer' },
  { id: 'e2', name: 'Nour El-Amin', email: 'nour.el-amin@acme.com', title: 'People Partner' },
  { id: 'e3', name: 'Elsa Petit', email: 'elsa.petit@acme.com', title: 'Finance Analyst' },
  { id: 'e4', name: 'Carlos Reyes', email: 'carlos.reyes@acme.com', title: 'Payroll Specialist' },
];
