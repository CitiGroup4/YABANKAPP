import React from 'react';
import type { SpendingData } from '../types/bank.ts';

interface SpendingChartProps {
  data: SpendingData[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <section className="bg-orange-50/50 border border-amber-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <h2 className="text-lg font-semibold text-amber-950 mb-6">Spending Habits</h2>
      
      {/* SVG Bar Chart Visualization */}
      <div className="bg-amber-100/40 p-4 rounded-xl border border-amber-200/50 flex-1 flex flex-col justify-end">
        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
          {data.map((item) => {
            const heightPercent = (item.amount / maxAmount) * 100;
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded shadow-sm">
                  ${item.amount}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[40px] bg-amber-600 group-hover:bg-amber-700 rounded-t-md transition-all duration-300"
                />
                <span className="text-xs text-amber-800 font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};