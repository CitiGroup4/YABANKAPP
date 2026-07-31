import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { AccountsList } from '../components/AccountsList';
import { SpendingChart } from '../components/SpendingChart';
import { CardsGallery } from '../components/CardsGallery';
import { AccountDetails } from './AccountDetails';
import type { Account, Card, SpendingData, Transaction } from '../types/bank';
import {
  getAccountsByUserId,
  getUserTransactions,
  createAccount,
  depositMoney,
  withdrawMoney,
  transferFunds,
} from '../api/accounts';

interface DashboardProps {
  userId: number; // Removed default hardcoded fallback requirement
  username?: string;
  onLogout?: () => void;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Dashboard: React.FC<DashboardProps> = ({
  userId,
  username = 'User',
  onLogout,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts and user transaction history
  const fetchData = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError(null);

      const [accountsData, transactionsData] = await Promise.all([
        getAccountsByUserId(userId),
        getUserTransactions(userId),
      ]);

      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Dynamically compute monthly spending from actual transactions
  const computedSpendingData: SpendingData[] = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};

    transactions.forEach((txn) => {
      const amount = Number(txn.amount);
    
      // Filter for spending transactions (e.g., negative amounts, Withdrawals, or Transfer Out)
      const isSpending = 
        amount < 0 || 
        txn.txn_type.toLowerCase().includes('withdraw') || 
        txn.txn_type.toLowerCase().includes('out');

      if (isSpending && txn.created_at) {
        const date = new Date(txn.created_at);
        const monthLabel = MONTH_NAMES[date.getMonth()];
        const absoluteAmount = Math.abs(amount);

        monthlyTotals[monthLabel] = (monthlyTotals[monthLabel] || 0) + absoluteAmount;
      }
    });

    // Format output as array of SpendingData
    return MONTH_NAMES.map((month) => ({
      month,
      amount: monthlyTotals[month] || 0,
    })).filter((item) => item.amount > 0); // Exclude months with zero spending
  }, [transactions]);

  const handleAddAccount = async (newAccount: Account) => {
    try {
      await createAccount({
        user_id: newAccount.user_id || userId,
        balance: newAccount.balance,
        account_type: newAccount.account_type,
      });

      await fetchData();
    } catch (err: any) {
      console.error('Error creating account:', err);
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleDeposit = async (accountId: number, amount: number) => {
    try {
      const res = await depositMoney(accountId, amount);
      if (res.message?.includes('not found')) {
        setError(res.message);
        return;
      }

      await fetchData();
    } catch (err: any) {
      console.error('Error processing deposit:', err);
      setError(err.message || 'Failed to process deposit.');
    }
  };

  const handleWithdraw = async (accountId: number, amount: number) => {
    try {
      const res = await withdrawMoney(accountId, amount);
      if (res.message?.includes('Insufficient') || res.message?.includes('not found')) {
        setError(res.message);
        return;
      }

      await fetchData();
    } catch (err: any) {
      console.error('Error processing withdrawal:', err);
      setError(err.message || 'Failed to process withdrawal.');
    }
  };

  const handleTransfer = async (
    fromAccountId: number,
    toAccountId: number,
    amount: number
  ) => {
    try {
      await transferFunds(fromAccountId, toAccountId, amount);
      await fetchData();
    } catch (err: any) {
      console.error('Error processing transfer:', err);
      setError(err.message || 'Failed to process transfer.');
    }
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccounts((prev) => prev.filter((acc) => acc.account_id !== accountId));
    setSelectedAccount(null);
  };

  const handleIssueCard = (newCard: Card) => {
    setCards((prev) => [newCard, ...prev]);
  };

  if (selectedAccount) {
    const activeAccount = accounts.find(
      (a) => a.account_id === selectedAccount.account_id
    );
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
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-2xl text-xs flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="font-bold ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-stone-500 text-sm font-semibold">
            Loading dashboard data...
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
          <SpendingChart 
            data={computedSpendingData.length > 0 ? computedSpendingData : []} 
            transactions={transactions} 
          />
          <CardsGallery
            userId={userId}
            accounts={accounts}
            cards={cards}
            onAddCard={handleIssueCard}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;