import React, { useState, useRef } from 'react';
import type { Account } from '../types/bank';
import { AccountCard } from './AccountCard';
import { AddAccountModal } from './AddAccountModal';

export interface AccountsListProps {
  userId: number;
  accounts: Account[];
  onAddAccount: (newAccount: Account) => void;
  onSelectAccount: (account: Account) => void;
}

export const AccountsList: React.FC<AccountsListProps> = ({
  userId,
  accounts,
  onAddAccount,
  onSelectAccount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State for Click-and-Drag Scrolling
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. Mouse Wheel Scroll Handler
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      if (e.deltaY !== 0) {
        scrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // 2. Drag-to-Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs space-y-5 min-w-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            Your Accounts
          </h2>
          <p className="text-xs font-medium text-stone-500 mt-0.5">
            Manage and view balance details
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          + Add Account
        </button>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 overflow-x-auto py-2 px-1 scroll-smooth min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {accounts.length === 0 ? (
          <div className="py-8 w-full text-center text-stone-400 text-xs font-medium border border-dashed border-stone-200 rounded-2xl">
            No accounts found.
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard
              key={account.account_id}
              account={account}
              onSelectAccount={onSelectAccount}
            />
          ))
        )}
      </div>

      <AddAccountModal
        isOpen={isModalOpen}
        userId={userId}
        onClose={() => setIsModalOpen(false)}
        onAddAccount={onAddAccount}
      />
    </div>
  );
};