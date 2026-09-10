import { useState } from 'react';
import { Pencil, Trash2, FileText, X } from 'lucide-react';
import type { LedgerEntry } from '@/types';

interface TransactionsTableProps {
  entries: LedgerEntry[];
  currentFilterPerson: string | null;
  onEdit: (entry: LedgerEntry) => void;
  onDelete: (id: string) => void;
  onFilterPerson: (name: string) => void;
  onGeneratePDF: (personName: string) => void;
  onGenerateFullPDF: () => void;
  onShowAll: () => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export function TransactionsTable({
  entries,
  currentFilterPerson,
  onEdit,
  onDelete,
  onFilterPerson,
  onGeneratePDF,
  onGenerateFullPDF,
  onShowAll,
  search,
  onSearchChange,
}: TransactionsTableProps) {
  const filtered = entries
    .filter(e => {
      if (currentFilterPerson) {
        if (e.person.toLowerCase() !== currentFilterPerson.toLowerCase()) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        if (!e.person.toLowerCase().includes(s) && !e.date.includes(s)) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {currentFilterPerson ? `Ledger: ${currentFilterPerson}` : 'All Transactions'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentFilterPerson
              ? `Showing transactions for ${currentFilterPerson}`
              : 'Showing complete transaction history'}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="w-full sm:w-48 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {currentFilterPerson ? (
            <>
              <button
                onClick={() => onGeneratePDF(currentFilterPerson)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </button>
              <button
                onClick={onShowAll}
                className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Show All
              </button>
            </>
          ) : (
            <button
              onClick={onGenerateFullPDF}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Full Report
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto flex-grow max-h-[60vh]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Person</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filtered.map(item => {
                const isGiven = item.type === 'given';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 text-xs font-medium text-slate-600 dark:text-slate-400">{item.date}</td>
                    <td
                      className="py-3 px-4 text-xs font-semibold text-slate-900 dark:text-slate-200 cursor-pointer hover:text-blue-600"
                      onClick={() => onFilterPerson(item.person)}
                    >
                      {item.person}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          isGiven
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        {isGiven ? 'Given' : 'Taken'}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-xs font-bold text-right ${
                        isGiven ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      Rs. {Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit"
                          className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-sm"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          title="Delete"
                          className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
