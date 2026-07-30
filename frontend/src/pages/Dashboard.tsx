import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AccountsList } from '../components/AccountsList';
import { SpendingChart } from '../components/SpendingChart';
import { CardsGallery } from '../components/CardsGallery';
import { AccountDetails } from './AccountDetails';
import type { Account, Card, SpendingData, Transaction } from '../types/bank';

// 1. Define props interface for Dashboard
interface DashboardProps {
  username?: string;
  onLogout?: () => void;
}

const initialAccounts: Account[] = [
  { account_id: 101, user_id: 1, balance: 3550.0, account_type: 'Checking', created_at: '2026-07-28 18:59:44' },
  { account_id: 102, user_id: 1, balance: 4350.0, account_type: 'Checking', created_at: '2026-07-28 18:59:55' },
  { account_id: 103, user_id: 1, balance: 50054.0, account_type: 'Checking', created_at: '2026-07-28 19:00:12' },
  { account_id: 104, user_id: 1, balance: 50054.0, account_type: 'Checking', created_at: '2026-07-28 19:00:22' },
  { account_id: 105, user_id: 1, balance: 554.0, account_type: 'Saving', created_at: '2026-07-28 19:03:15' },
];

const initialTransactions: Transaction[] = [
  { txn_id: 102, account_id: 102, txn_type: 'Checking', amount: -50.0, created_at: '2026-07-29 10:27:58' },
  { txn_id: 102, account_id: 102, txn_type: 'Checking', amount: 500.0, created_at: '2026-07-29 10:43:27' },
  { txn_id: 102, account_id: 102, txn_type: 'Checking', amount: 500.0, created_at: '2026-07-29 10:43:43' },
  { txn_id: 101, account_id: 101, txn_type: 'Checking', amount: 500.0, created_at: '2026-07-29 10:44:02' },
  { txn_id: 101, account_id: 101, txn_type: 'Checking', amount: 500.0, created_at: '2026-07-29 10:44:19' },
  { txn_id: 101, account_id: 101, txn_type: 'Checking', amount: -50.0, created_at: '2026-07-29 10:44:50' },
];

const initialCards: Card[] = [
  {
    id: 'c1',
    account_id: 101,
    cardHolder: 'Alex Morgan',
    cardNumber: '4532890123458821',
    expiry: '08/28',
    type: 'Visa',
    variant: 'credit',
    bgGradient: 'bg-gradient-to-br from-amber-800 via-orange-900 to-stone-900',
  },
  {
    id: 'c2',
    account_id: 102,
    cardHolder: 'Alex Morgan',
    cardNumber: '5412751234891092',
    expiry: '11/27',
    type: 'Mastercard',
    variant: 'debit',
    bgGradient: 'bg-gradient-to-br from-stone-800 via-amber-900 to-amber-950',
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

// 2. Accept props in Dashboard component
export const Dashboard: React.FC<DashboardProps> = ({
  username = 'Alex Morgan',
  onLogout,
}) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const getFormattedTimestamp = () =>
    new Date().toISOString().replace('T', ' ').substring(0, 19);

  const handleAddAccount = (newAccount: Account) => {
    setAccounts((prev) => [newAccount, ...prev]);
  };

  const handleDeposit = (accountId: number, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.account_id === accountId ? { ...acc, balance: acc.balance + amount } : acc
      )
    );
    setTransactions((prev) => [
      {
        txn_id: accountId,
        account_id: accountId,
        txn_type: 'Deposit',
        amount,
        created_at: getFormattedTimestamp(),
      },
      ...prev,
    ]);
  };

  const handleWithdraw = (accountId: number, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.account_id === accountId ? { ...acc, balance: acc.balance - amount } : acc
      )
    );
    setTransactions((prev) => [
      {
        txn_id: accountId,
        account_id: accountId,
        txn_type: 'Withdrawal',
        amount: -amount,
        created_at: getFormattedTimestamp(),
      },
      ...prev,
    ]);
  };

  const handleTransfer = (fromAccountId: number, toAccountId: number, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.account_id === fromAccountId) return { ...acc, balance: acc.balance - amount };
        if (acc.account_id === toAccountId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );
    const now = getFormattedTimestamp();
    setTransactions((prev) => [
      { txn_id: fromAccountId, account_id: fromAccountId, txn_type: 'Transfer Out', amount: -amount, created_at: now },
      { txn_id: toAccountId, account_id: toAccountId, txn_type: 'Transfer In', amount, created_at: now },
      ...prev,
    ]);
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccounts((prev) => prev.filter((acc) => acc.account_id !== accountId));
    setSelectedAccount(null);
  };

  const handleIssueCard = (newCard: Card) => {
    setCards((prev) => [newCard, ...prev]);
  };

  if (selectedAccount) {
    const activeAccount = accounts.find((a) => a.account_id === selectedAccount.account_id);
    if (!activeAccount) {
      setSelectedAccount(null);
      return null;
    }

    return (
      <AccountDetails
        account={activeAccount}
        allAccounts={accounts}
        transactions={transactions}
        onBack={() => setSelectedAccount(null)}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onTransfer={handleTransfer}
        onDeleteAccount={handleDeleteAccount}
        onIssueCard={handleIssueCard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* 3. Pass username and onLogout into Header */}
      <Header username={username} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <AccountsList
          accounts={accounts}
          onAddAccount={handleAddAccount}
          onSelectAccount={setSelectedAccount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart data={mockSpending} transactions={transactions} />
          <CardsGallery
            cards={cards}
            accounts={accounts}
            onAddCard={handleIssueCard}
        />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;