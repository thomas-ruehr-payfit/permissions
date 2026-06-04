import type { RoleKey, ManagerReport } from '../../../data/mock-users';

export interface InvitePair {
  role: RoleKey | null;
  /** Payroll / Acct / HR — selected entities */
  entityIds: string[];
  /** HR only — selected groups (additive with entities) */
  groupIds: string[];
  /** Manager only — list of reports with per-person permissions */
  reports: ManagerReport[];
}

export interface InviteState {
  whoType: 'existing' | 'new' | null;
  selectedEmployeeId: string | null;
  newName: string;
  newEmail: string;
  pairs: InvitePair[];
}

export const EMPTY_PAIR: InvitePair = {
  role: null,
  entityIds: [],
  groupIds: [],
  reports: [],
};

export const INITIAL_INVITE: InviteState = {
  whoType: null,
  selectedEmployeeId: null,
  newName: '',
  newEmail: '',
  pairs: [{ ...EMPTY_PAIR }],
};
