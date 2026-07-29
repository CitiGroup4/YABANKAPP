import React, { useRef, useState } from 'react';
import type { Account } from '../types/bank';
import { AccountCard } from './AccountCard';
import { AddAccountModal } from './AddAccountModal.tsx';

interface AccountsListProps {
  accounts: Account[];
  onAddAccount: (newAccount: Account) => void;
}

export const AccountsList: React.FC<AccountsListProps> = ({ accounts, onAddAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse Drag to Scroll Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="bg-orange-50/50 border border-amber-200/70 rounded-2xl p-6 shadow-sm select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-amber-950">Accounts</h2>
          <p className="text-xs text-amber-800/60 font-medium">
            Drag ↔ or scroll horizontally
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-amber-900 bg-amber-200/60 hover:bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-300/60 transition-all flex items-center space-x-1"
        >
          <span>+ Add Account</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="flex space-x-4 overflow-x-auto pb-4 pt-1 cursor-grab active:cursor-grabbing scrollbar-none transition-all"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {accounts.map((acc) => (
          <AccountCard key={acc.account_id} account={acc} />
        ))}
      </div>

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAccount={onAddAccount}
      />
    </section>
  );
};