import React, { useState } from 'react';
import type { SpendingData, Transaction } from '../types/bank';

interface SpendingChartProps {
  data: SpendingData[];
  transactions: Transaction[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data, transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Helper to normalize and check if a transaction is a withdrawal
  const isWithdrawal = (txnType: string) => {
    const type = txnType.toLowerCase();
    return type === 'withdraw' || type === 'withdrawal';
  };

  // Filter transactions to strictly withdrawals
  const withdrawalTransactions = transactions.filter((txn) => isWithdrawal(txn.txn_type));

  // Helper function to extract short month name (e.g., "Jan", "Feb") from created_at date string
  const getMonthFromDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleString('default', { month: 'short' });
  };

  // Calculate total withdrawals per month to keep chart data accurate
  const calculatedData = data.map((item) => {
    const monthWithdrawals = withdrawalTransactions.filter(
      (txn) => getMonthFromDate(txn.created_at) === item.month
    );

    // If month has specific matching transactions, sum their absolute amounts; otherwise fallback to item.amount
    const totalAmount = monthWithdrawals.length > 0
      ? monthWithdrawals.reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0)
      : item.amount;

    return { ...item, amount: totalAmount };
  });

  const maxAmount = Math.max(...calculatedData.map((d) => d.amount), 1);

  // Filter modal records to show withdrawals for the selected month
  const activeMonthTransactions = withdrawalTransactions.filter((txn) => {
    if (!selectedMonth) return false;
    const txnMonth = getMonthFromDate(txn.created_at);
    // Return true if month matches, or fallback to showing all withdrawals if dates aren't parseable
    return txnMonth ? txnMonth === selectedMonth : true;
  });

  return (
    <section className="bg-orange-50/50 border border-amber-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-amber-950">Spending Habits</h2>
          <p className="text-xs text-amber-800/60 font-medium">
            Click any bar to view withdrawal history
          </p>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="bg-amber-100/40 p-4 rounded-xl border border-amber-200/50 flex-1 flex flex-col justify-end">
        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
          {calculatedData.map((item) => {
            const heightPercent = (item.amount / maxAmount) * 100;
            return (
              <div
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded shadow-sm">
                  ${item.amount.toFixed(2)}
                </span>
                <div
                  style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  className="w-full max-w-[40px] bg-amber-600 group-hover:bg-amber-700 rounded-t-md transition-all duration-300"
                />
                <span className="text-xs text-amber-800 font-medium group-hover:text-amber-950">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdrawals Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-amber-950">
                  Withdrawal History ({selectedMonth})
                </h3>
                <p className="text-xs text-amber-800/60">
                  Showing spending and withdrawal activity
                </p>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="w-8 h-8 rounded-full bg-amber-200/60 text-amber-950 flex items-center justify-center hover:bg-amber-300 transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto max-h-96">
              {activeMonthTransactions.length === 0 ? (
                <p className="text-sm text-amber-800/60 py-8 text-center italic">
                  No withdrawal records found for this period.
                </p>
              ) : (
                <table className="w-full text-left text-xs text-amber-950">
                  <thead className="bg-amber-200/60 text-amber-900 uppercase font-semibold sticky top-0 border-b border-amber-300/60">
                    <tr>
                      <th className="p-3 rounded-l-xl">Txn ID</th>
                      <th className="p-3">Account</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right rounded-r-xl">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-200/40">
                    {activeMonthTransactions.map((txn, idx) => (
                      <tr key={txn.txn_id || idx} className="hover:bg-amber-100/40 transition-colors">
                        <td className="p-3 font-mono font-medium">#{txn.txn_id}</td>
                        <td className="p-3 font-semibold">Account #{txn.account_id}</td>
                        <td className="p-3">
                          <span className="bg-rose-200/70 text-rose-950 px-2 py-0.5 rounded font-semibold text-[10px]">
                            {txn.txn_type}
                          </span>
                        </td>
                        <td className="p-3 text-amber-800/80 font-mono">{txn.created_at}</td>
                        <td className="p-3 text-right font-bold font-mono text-sm text-rose-700">
                          -${Math.abs(Number(txn.amount)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex justify-end">
              <button
                onClick={() => setSelectedMonth(null)}
                className="px-4 py-2 text-xs font-semibold text-amber-50 bg-amber-800 hover:bg-amber-900 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};