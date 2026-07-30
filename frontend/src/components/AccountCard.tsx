import React from 'react';
import type { Account } from '../types/bank';

interface AccountCardProps {
  account: Account;
  onSelectAccount?: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onSelectAccount }) => {
  return (
    <div
      onClick={() => onSelectAccount?.(account)}
      className="flex-shrink-0 w-80 bg-gradient-to-br from-amber-50/60 via-white to-stone-50/80 border border-amber-200/80 hover:border-amber-400 p-5 rounded-2xl transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer group select-none"
    >
      {/* Header Info */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 border border-amber-300/60 px-2 py-0.5 rounded-md inline-block">
          {account.account_type}
        </span>
        <h3 className="text-base font-bold text-amber-950 mt-2 group-hover:text-amber-800 transition-colors">
          Account #{account.account_id}
        </h3>
      </div>

      {/* Balance Section */}
      <div className="pt-3 border-t border-amber-200/50">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
          Available Balance
        </span>
        <p className="text-2xl font-black text-amber-950 tracking-tight mt-0.5">
          ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};