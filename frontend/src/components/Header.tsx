import React from 'react';

interface HeaderProps {
  username: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-amber-950 text-amber-50 px-6 py-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-amber-800 text-amber-50 font-bold rounded-xl flex items-center justify-center">
          B
        </div>
        <span className="font-bold tracking-tight text-lg">Apex Banking</span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-xs font-medium text-amber-200/80">
          Welcome back, <strong className="text-white">{username}</strong>
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs font-semibold bg-amber-900/80 hover:bg-amber-900 text-amber-200 px-3 py-1.5 rounded-xl border border-amber-800/60 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};