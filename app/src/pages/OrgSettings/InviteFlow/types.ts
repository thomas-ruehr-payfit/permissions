import type { RoleKey } from '../../../data/mock-users';

export interface InviteState {
  whoType: 'existing' | 'new' | null;
  selectedEmployeeId: string | null;
  newName: string;
  newEmail: string;
  selectedRole: RoleKey | null;
  entityIds: string[];
  groupId: string | null;
  perimeterTab: 'entity' | 'group';
}

export const INITIAL_INVITE: InviteState = {
  whoType: null,
  selectedEmployeeId: null,
  newName: '',
  newEmail: '',
  selectedRole: null,
  entityIds: [],
  groupId: null,
  perimeterTab: 'entity',
};
