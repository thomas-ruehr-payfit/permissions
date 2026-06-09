import { createContext, useContext, useState } from 'react';
import type { CustomRole } from '../data/permissions';

interface CustomRolesContextValue {
  customRoles: CustomRole[];
  addRole: (role: CustomRole) => void;
  updateRole: (role: CustomRole) => void;
  deleteRole: (id: string) => void;
}

const CustomRolesContext = createContext<CustomRolesContextValue>({
  customRoles: [],
  addRole: () => {},
  updateRole: () => {},
  deleteRole: () => {},
});

export function CustomRolesProvider({ children }: { children: React.ReactNode }) {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);

  const addRole    = (role: CustomRole)  => setCustomRoles(prev => [...prev, role]);
  const updateRole = (role: CustomRole)  => setCustomRoles(prev => prev.map(r => r.id === role.id ? role : r));
  const deleteRole = (id: string)        => setCustomRoles(prev => prev.filter(r => r.id !== id));

  return (
    <CustomRolesContext.Provider value={{ customRoles, addRole, updateRole, deleteRole }}>
      {children}
    </CustomRolesContext.Provider>
  );
}

export function useCustomRoles() { return useContext(CustomRolesContext); }
