import type { RoleKey, ManagerReport } from '../../../data/mock-users';
import type { ModuleAccess } from '../../../data/permissions';

export interface InvitePair {
  role: RoleKey | null;
  /** D1: custom role id if a custom role was selected */
  customRoleId?: string;
  /** Payroll / Acct / HR — selected entities */
  entityIds: string[];
  /** HR only — selected groups (additive with entities) */
  groupIds: string[];
  /** Manager only — list of reports with per-person permissions */
  reports: ManagerReport[];
}

/** D2: how permissions were seeded */
export type StartingPoint =
  | { type: 'preset'; roleKey: RoleKey }
  | { type: 'copy'; userId: string };

export interface InviteState {
  whoType: 'existing' | 'new' | null;
  selectedEmployeeId: string | null;
  newName: string;
  newEmail: string;
  pairs: InvitePair[];
  /** D2 only */
  startingPoint?: StartingPoint;
  /** D2 only — full module access for this individual */
  customModules?: ModuleAccess[];
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
