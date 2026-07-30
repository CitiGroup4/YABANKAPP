import React, { useState } from 'react';
import { Auth } from './pages/Auth';
import Dashboard from './pages/Dashboard';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string>('Alex Morgan');

  const handleAuthSuccess = (username: string) => {
    setUser(username);
    setIsAuthenticated(true); // 🚀 Directly goes to Dashboard!
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // 🔙 Returns to Login/Signup page
  };

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard username={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default App;