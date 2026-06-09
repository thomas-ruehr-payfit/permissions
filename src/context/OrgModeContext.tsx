import { createContext, useContext, useState, useEffect } from 'react';

interface OrgModeContextValue {
  orgEnabled: boolean;
  setOrgEnabled: (v: boolean) => void;
}

const OrgModeContext = createContext<OrgModeContextValue>({
  orgEnabled: true,
  setOrgEnabled: () => {},
});

export function OrgModeProvider({ children }: { children: React.ReactNode }) {
  const [orgEnabled, setOrgEnabledState] = useState<boolean>(
    () => localStorage.getItem('orgMode') !== 'false'
  );

  const setOrgEnabled = (v: boolean) => {
    setOrgEnabledState(v);
  };

  useEffect(() => {
    localStorage.setItem('orgMode', String(orgEnabled));
  }, [orgEnabled]);

  return (
    <OrgModeContext.Provider value={{ orgEnabled, setOrgEnabled }}>
      {children}
    </OrgModeContext.Provider>
  );
}

export function useOrgMode() {
  return useContext(OrgModeContext);
}

export function getOrgCopy(orgEnabled: boolean) {
  return {
    orgRoleLabel:  orgEnabled ? 'Organisation Admin' : 'Administrator',
    orgWide:       orgEnabled ? 'Org-wide'            : 'Company-wide',
    orgWideDesc:   orgEnabled
      ? 'Organisation Admins have access to all entities.'
      : 'Administrators have company-wide access.',
    fromThisOrg:   orgEnabled ? 'From this organisation' : 'From this company',
  };
}
