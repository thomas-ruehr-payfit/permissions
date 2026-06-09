import { createContext, useContext, useState, useEffect } from 'react';

export type Direction = 'rbac' | 'individual';

interface DirectionContextValue {
  direction: Direction;
  setDirection: (v: Direction) => void;
}

const DirectionContext = createContext<DirectionContextValue>({
  direction: 'rbac',
  setDirection: () => {},
});

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirectionState] = useState<Direction>(
    () => (localStorage.getItem('direction') as Direction | null) ?? 'rbac'
  );
  const setDirection = (v: Direction) => setDirectionState(v);
  useEffect(() => { localStorage.setItem('direction', direction); }, [direction]);
  return (
    <DirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() { return useContext(DirectionContext); }
