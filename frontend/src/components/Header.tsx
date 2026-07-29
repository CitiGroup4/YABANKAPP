import React from 'react';

interface HeaderProps {
  username?: string;
}

export const Header: React.FC<HeaderProps> = ({ username = 'Alex Morgan' }) => {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-amber-50/80 backdrop-blur-sm border-b border-amber-200/60 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center text-amber-50 font-bold text-xl shadow-md">
          B
        </div>
        <h1 className="text-2xl font-bold text-amber-950 tracking-tight">Bank APP</h1>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-amber-800/80">Welcome,</span>
        <span className="text-sm font-semibold text-amber-950 bg-amber-200/50 px-3 py-1.5 rounded-full border border-amber-300/50">
          {username}
        </span>
      </div>
    </header>
  );
};