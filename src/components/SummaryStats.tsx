import type { PersonSummary } from '@/types';

interface SummaryStatsProps {
  stats: PersonSummary | null;
  totalGiven: number;
  totalTaken: number;
  netBalance: number;
}

export function SummaryStats({ stats, totalGiven, totalTaken, netBalance }: SummaryStatsProps) {
  const given = stats ? stats.totalGiven : totalGiven;
  const taken = stats ? stats.totalTaken : totalTaken;
  const net = stats ? stats.netBalance : netBalance;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Given</p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
          Rs. {given.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Taken</p>
        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
          Rs. {taken.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Balance</p>
        <p
          className={`text-2xl font-bold mt-1 ${
            net >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          Rs. {Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
