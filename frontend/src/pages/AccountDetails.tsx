import React, { useState, useEffect } from 'react';
import type { Account, Transaction, Card } from '../types/bank';
import { getAccountTransactions } from '../api/accounts';

interface AccountDetailsProps {
  account: Account;
  allAccounts: Account[];
  transactions?: Transaction[]; // Optional now as we fetch live transactions directly
  onBack: () => void;
  onDeposit: (accountId: number, amount: number) => Promise<void> | void;
  onWithdraw: (accountId: number, amount: number) => Promise<void> | void;
  onTransfer: (fromAccountId: number, toAccountId: number, amount: number) => Promise<void> | void;
  onDeleteAccount: (accountId: number) => void;
  onIssueCard: (newCard: Card) => void;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  account,
  allAccounts,
  onBack,
  onDeposit,
  onWithdraw,
  onTransfer,
  onDeleteAccount,
  onIssueCard,
}) => {
  const [activeModal, setActiveModal] = useState<
    'deposit' | 'withdraw' | 'transfer' | 'newCard' | null
  >(null);

  // Live transaction state from API
  const [accountTransactions, setAccountTransactions] = useState<Transaction[]>([]);
  const [isLoadingTxns, setIsLoadingTxns] = useState<boolean>(true);

  // Form states
  const [amount, setAmount] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<number>(
    allAccounts.find((a) => a.account_id !== account.account_id)?.account_id || 0
  );
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard' | 'Amex'>('Visa');
  const [cardVariant, setCardVariant] = useState<'credit' | 'debit'>('debit');

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      setIsLoadingTxns(true);
      const data = await getAccountTransactions(account.account_id);
      setAccountTransactions(data.transactions || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoadingTxns(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [account.account_id]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      await onDeposit(account.account_id, val);
      setAmount('');
      setActiveModal(null);
      await fetchTransactions(); // Refresh list after action
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0 && val <= account.balance) {
      await onWithdraw(account.account_id, val);
      setAmount('');
      setActiveModal(null);
      await fetchTransactions(); // Refresh list after action
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0 && val <= account.balance && targetAccountId) {
      await onTransfer(account.account_id, targetAccountId, val);
      setAmount('');
      setActiveModal(null);
      await fetchTransactions(); // Refresh list after action
    }
  };

  const handleIssueCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradients = [
      'bg-gradient-to-br from-amber-800 via-orange-900 to-stone-900',
      'bg-gradient-to-br from-stone-800 via-amber-900 to-amber-950',
      'bg-gradient-to-br from-amber-700 via-yellow-900 to-stone-950',
      'bg-gradient-to-br from-rose-950 via-amber-950 to-stone-900',
    ];

    const randomCardNum = `4${Math.floor(100000000050000 + Math.random() * 899999999950000)}`;

    const newCard: Card = {
      id: `c_${Date.now()}`,
      account_id: account.account_id,
      cardHolder: 'Alex Morgan',
      cardNumber: randomCardNum,
      expiry: '12/29',
      type: cardType,
      variant: cardVariant,
      bgGradient: gradients[Math.floor(Math.random() * gradients.length)],
    };

    onIssueCard(newCard);
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Account #${account.account_id}?`)) {
      onDeleteAccount(account.account_id);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-semibold text-amber-900 hover:text-amber-700 transition-colors bg-amber-200/50 hover:bg-amber-200 px-4 py-2 rounded-xl border border-amber-300/60 w-fit cursor-pointer"
        >
          <span>← Back to Dashboard</span>
        </button>

        {/* Account Summary Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-amber-50 rounded-3xl p-8 shadow-md flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-amber-700/60 px-3 py-1 rounded-full border border-amber-500/30">
              {account.account_type} Account
            </span>
            <h1 className="text-3xl font-extrabold mt-3">Account #{account.account_id}</h1>
            <p className="text-xs text-amber-200/70 mt-1 font-mono">Created: {account.created_at}</p>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-amber-200/80">
              Available Balance
            </span>
            <p className="text-4xl font-black tracking-tight text-amber-100">
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setActiveModal('deposit')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center space-y-1 cursor-pointer"
          >
            <span className="text-lg">💵</span>
            <span>Deposit</span>
          </button>

          <button
            onClick={() => setActiveModal('withdraw')}
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center space-y-1 cursor-pointer"
          >
            <span className="text-lg">🏧</span>
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setActiveModal('transfer')}
            className="bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center space-y-1 cursor-pointer"
          >
            <span className="text-lg">🔄</span>
            <span>Transfer</span>
          </button>

          <button
            onClick={() => setActiveModal('newCard')}
            className="bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center space-y-1 cursor-pointer"
          >
            <span className="text-lg">💳</span>
            <span>Issue Card</span>
          </button>

          <button
            onClick={handleDelete}
            className="col-span-2 sm:col-span-1 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center space-y-1 cursor-pointer"
          >
            <span className="text-lg">🗑️</span>
            <span>Delete Account</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-orange-50/50 border border-amber-200/70 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-amber-950">Transaction History</h2>
            <span className="text-xs text-amber-800/70 font-medium">
              {accountTransactions.length} records
            </span>
          </div>

          {isLoadingTxns ? (
            <div className="text-center py-8 text-amber-800/60 text-sm font-semibold">
              Loading transactions...
            </div>
          ) : accountTransactions.length === 0 ? (
            <p className="text-sm text-amber-800/60 py-8 text-center italic">
              No transactions recorded for this account.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-amber-950">
                <thead className="bg-amber-200/50 text-amber-900 uppercase font-semibold border-b border-amber-300/60">
                  <tr>
                    <th className="p-3 rounded-l-xl">Txn ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right rounded-r-xl">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/40">
                  {accountTransactions.map((txn) => (
                    <tr key={txn.txn_id} className="hover:bg-amber-100/40 transition-colors">
                      <td className="p-3 font-mono font-medium">#{txn.txn_id}</td>
                      <td className="p-3">
                        <span className="bg-amber-200/60 px-2 py-0.5 rounded font-semibold text-[10px]">
                          {txn.txn_type}
                        </span>
                      </td>
                      <td className="p-3 text-amber-800/80 font-mono">{txn.created_at}</td>
                      <td
                        className={`p-3 text-right font-bold font-mono text-sm ${
                          Number(txn.amount) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {Number(txn.amount) >= 0
                          ? `+$${Number(txn.amount).toFixed(2)}`
                          : `-$${Math.abs(Number(txn.amount)).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-amber-950 capitalize">
                {activeModal === 'newCard' ? 'Issue New Card' : `${activeModal} Funds`}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-amber-200/60 text-amber-950 flex items-center justify-center hover:bg-amber-300 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Deposit / Withdraw Form */}
            {(activeModal === 'deposit' || activeModal === 'withdraw') && (
              <form
                onSubmit={activeModal === 'deposit' ? handleDepositSubmit : handleWithdrawSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-amber-900 uppercase mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 text-sm font-medium focus:ring-2 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Confirm {activeModal}
                </button>
              </form>
            )}

            {/* Transfer Form */}
            {activeModal === 'transfer' && (
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 uppercase mb-1">
                    Destination Account
                  </label>
                  <select
                    value={targetAccountId}
                    onChange={(e) => setTargetAccountId(Number(e.target.value))}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 text-sm font-medium focus:ring-2 focus:ring-amber-500/50 outline-none"
                  >
                    {allAccounts
                      .filter((a) => a.account_id !== account.account_id)
                      .map((a) => (
                        <option key={a.account_id} value={a.account_id}>
                          Account #{a.account_id} ({a.account_type}) - ${a.balance.toFixed(2)}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-900 uppercase mb-1">
                    Transfer Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 text-sm font-medium focus:ring-2 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </form>
            )}

            {/* New Card Form */}
            {activeModal === 'newCard' && (
              <form onSubmit={handleIssueCardSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-900 uppercase mb-1">
                    Card Type
                  </label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value as any)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 text-sm font-medium outline-none"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-900 uppercase mb-1">
                    Card Variant
                  </label>
                  <select
                    value={cardVariant}
                    onChange={(e) => setCardVariant(e.target.value as any)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-amber-950 text-sm font-medium outline-none"
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Issue Card Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};