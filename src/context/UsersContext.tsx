import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { MOCK_USERS } from '../data/mock-users';
import type { AdminUser } from '../data/mock-users';

interface UsersContextValue {
  users: AdminUser[];
  addUser: (user: AdminUser) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, patch: Partial<AdminUser>) => void;
}

const UsersContext = createContext<UsersContextValue>({
  users: [],
  addUser: () => {},
  removeUser: () => {},
  updateUser: () => {},
});

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  return (
    <UsersContext.Provider value={{
      users,
      addUser:    user       => setUsers(prev => [...prev, user]),
      removeUser: id         => setUsers(prev => prev.filter(u => u.id !== id)),
      updateUser: (id, patch) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u)),
    }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
