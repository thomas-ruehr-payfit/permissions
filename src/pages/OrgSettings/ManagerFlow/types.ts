import type { ManagerPermissions } from '../../../data/mock-users';

export interface ManagerFlowState {
  whoType: 'existing' | 'new' | null;
  selectedEmployeeId: string | null;
  newName: string;
  newEmail: string;
  manageeGroupIds: string[];
  manageeEmployeeIds: string[];
  permissions: ManagerPermissions;
}

export const INITIAL_MANAGER_FLOW: ManagerFlowState = {
  whoType: null,
  selectedEmployeeId: null,
  newName: '',
  newEmail: '',
  manageeGroupIds: [],
  manageeEmployeeIds: [],
  permissions: {
    validateAbsences: false,
    validateExpenses: false,
    validateTimeReports: false,
    viewAbsences: false,
    viewSalary: false,
  },
};
