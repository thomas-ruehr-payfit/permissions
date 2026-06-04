import type { RoleKey } from '../../../data/mock-users';

export interface InvitePair {
  role: RoleKey | null;
  entityIds: string[];
  groupIds: string[];
  perimeterTab: 'entity' | 'group';
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
  perimeterTab: 'entity',
};

export const INITIAL_INVITE: InviteState = {
  whoType: null,
  selectedEmployeeId: null,
  newName: '',
  newEmail: '',
  pairs: [{ ...EMPTY_PAIR }],
};
