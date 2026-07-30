import React, { useState } from 'react';
import { Auth } from './pages/Auth';
import Dashboard from './pages/Dashboard';

export interface UserSession {
  id: number;
  name: string;
  email: string;
}

export const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);

  const handleAuthSuccess = (userData: UserSession) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Dashboard
      userId={user.id}
      username={user.name}
      onLogout={handleLogout}
    />
  );
};

export default App;