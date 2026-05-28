import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';

export function RootShell() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Outlet />
      </div>
    </div>
  );
}
