import { createContext, useContext, useState } from 'react';
import type { RoleKey } from '../data/mock-users';

interface RoleViewContextValue {
  viewAs: RoleKey;
  setViewAs: (role: RoleKey) => void;
}

const RoleViewContext = createContext<RoleViewContextValue>({
  viewAs: 'org',
  setViewAs: () => {},
});

export function RoleViewProvider({ children }: { children: React.ReactNode }) {
  const [viewAs, setViewAs] = useState<RoleKey>('org');
  return (
    <RoleViewContext.Provider value={{ viewAs, setViewAs }}>
      {children}
    </RoleViewContext.Provider>
  );
}

export function useRoleView() {
  return useContext(RoleViewContext);
}
