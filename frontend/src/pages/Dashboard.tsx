import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { AccountsList } from '../components/AccountsList';
import { SpendingChart } from '../components/SpendingChart';
import { CardsGallery } from '../components/CardsGallery';
import { AccountDetails } from './AccountDetails';
import type { Account, Card, SpendingData, Transaction } from '../types/bank';
import { getAccountsByUserId, createAccount } from '../api/accounts';

interface DashboardProps {
  userId?: number;
  username?: string;
  onLogout?: () => void;
}

const mockSpending: SpendingData[] = [
  { month: 'Jan', amount: 1800 },
  { month: 'Feb', amount: 2200 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 2800 },
  { month: 'May', amount: 2100 },
  { month: 'Jun', amount: 1950 },
];

export const Dashboard: React.FC<DashboardProps> = ({
  userId = 2,
  username = 'User',
  onLogout,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getAccountsByUserId(userId);
        setAccounts(data);
      } catch (err: any) {
        console.error('Error loading accounts:', err);
        setError(err.message || 'Failed to load accounts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  const getFormattedTimestamp = () =>
    new Date().toISOString().replace('T', ' ').substring(0, 19);

  const handleAddAccount = async (newAccount: Account) => {
    try {
      await createAccount({
        user_id: newAccount.user_id || userId,
        balance: newAccount.balance,
        account_type: newAccount.account_type,
      });

      // Re-fetch to synchronize state with the server DB
      const refreshedAccounts = await getAccountsByUserId(userId);
      setAccounts(refreshedAccounts);
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleDeposit = (accountId: number, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.account_id === accountId ? { ...acc, balance: acc.balance + amount } : acc
      )
    );
    setTransactions((prev) => [
      {
        txn_id: Date.now(),
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
        txn_id: Date.now(),
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
      { txn_id: Date.now(), account_id: fromAccountId, txn_type: 'Transfer Out', amount: -amount, created_at: now },
      { txn_id: Date.now() + 1, account_id: toAccountId, txn_type: 'Transfer In', amount, created_at: now },
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
      <Header username={username} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-2xl text-xs">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-stone-500 text-sm font-semibold">
            Loading accounts...
          </div>
        ) : (
          <AccountsList
            userId={userId}
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onSelectAccount={setSelectedAccount}
          />
        )}

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