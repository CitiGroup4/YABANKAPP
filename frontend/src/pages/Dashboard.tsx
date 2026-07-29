import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AccountsList } from '../components/AccountsList';
import { SpendingChart } from '../components/SpendingChart';
import { CardsGallery } from '../components/CardsGallery';
import type { Account, Card, SpendingData } from '../types/bank';

const initialAccounts: Account[] = [
  {
    account_id: 101,
    user_id: 1,
    balance: 3550.0,
    account_type: 'Checking',
    created_at: '2026-07-28 18:59:44',
  },
  {
    account_id: 102,
    user_id: 1,
    balance: 4350.0,
    account_type: 'Checking',
    created_at: '2026-07-28 18:59:55',
  },
  {
    account_id: 103,
    user_id: 1,
    balance: 50054.0,
    account_type: 'Checking',
    created_at: '2026-07-28 19:00:12',
  },
  {
    account_id: 104,
    user_id: 1,
    balance: 50054.0,
    account_type: 'Checking',
    created_at: '2026-07-28 19:00:22',
  },
  {
    account_id: 105,
    user_id: 1,
    balance: 554.0,
    account_type: 'Saving',
    created_at: '2026-07-28 19:03:15',
  },
];

const mockCards: Card[] = [
  {
    id: 'c1',
    cardHolder: 'Alex Morgan',
    cardNumber: '4532890123458821',
    expiry: '08/28',
    type: 'Visa',
    variant: 'credit',
    bgGradient: 'bg-gradient-to-br from-amber-800 via-orange-900 to-stone-900',
  },
  {
    id: 'c2',
    cardHolder: 'Alex Morgan',
    cardNumber: '5412751234891092',
    expiry: '11/27',
    type: 'Mastercard',
    variant: 'debit',
    bgGradient: 'bg-gradient-to-br from-stone-800 via-amber-900 to-amber-950',
  },
  {
    id: 'c3',
    cardHolder: 'Alex Morgan',
    cardNumber: '378282246310005',
    expiry: '04/29',
    type: 'Amex',
    variant: 'credit',
    bgGradient: 'bg-gradient-to-br from-amber-700 via-yellow-900 to-stone-950',
  },
];

const mockSpending: SpendingData[] = [
  { month: 'Jan', amount: 1800 },
  { month: 'Feb', amount: 2200 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 2800 },
  { month: 'May', amount: 2100 },
  { month: 'Jun', amount: 1950 },
];

export const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const handleAddAccount = (newAccount: Account) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      <Header username="Alex Morgan" />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <AccountsList accounts={accounts} onAddAccount={handleAddAccount} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart data={mockSpending} />
          <CardsGallery cards={mockCards} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;