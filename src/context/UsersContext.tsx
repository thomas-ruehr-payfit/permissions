import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { MOCK_USERS, MOCK_MANAGERS } from '../data/mock-users';
import type { AdminUser, ManagerUser } from '../data/mock-users';

interface UsersContextValue {
  users: AdminUser[];
  addUser: (user: AdminUser) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, patch: Partial<AdminUser>) => void;
  managers: ManagerUser[];
  addManager: (manager: ManagerUser) => void;
  removeManager: (id: string) => void;
  updateManager: (id: string, patch: Partial<ManagerUser>) => void;
}

const UsersContext = createContext<UsersContextValue>({
  users: [],
  addUser: () => {},
  removeUser: () => {},
  updateUser: () => {},
  managers: [],
  addManager: () => {},
  removeManager: () => {},
  updateManager: () => {},
});

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [managers, setManagers] = useState<ManagerUser[]>(MOCK_MANAGERS);

  return (
    <UsersContext.Provider value={{
      users,
      addUser:    user  => setUsers(prev => [...prev, user]),
      removeUser: id    => setUsers(prev => prev.filter(u => u.id !== id)),
      updateUser: (id, patch) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u)),
      managers,
      addManager:    mgr  => setManagers(prev => [...prev, mgr]),
      removeManager: id   => setManagers(prev => prev.filter(m => m.id !== id)),
      updateManager: (id, patch) => setManagers(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m)),
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
