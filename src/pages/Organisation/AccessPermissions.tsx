import { useState } from 'react';
import { MOCK_USERS } from '../../data/mock-users';
import type { AdminUser } from '../../data/mock-users';
import { PeopleTable } from '../../components/permissions/PeopleTable';

export function AccessPermissions() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);

  const handleAdd = (user: AdminUser) => {
    setUsers(prev => [...prev, user]);
  };

  const handleRevoke = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleResend = (userId: string) => {
    // In a real app: trigger API call. Here just a visual no-op.
    console.log('Resend invite for', userId);
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      <PeopleTable
        users={users}
        onAdd={handleAdd}
        onRevoke={handleRevoke}
        onResend={handleResend}
      />
    </div>
  );
}
