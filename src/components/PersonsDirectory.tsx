import type { PersonSummary } from '@/types';
import { FileText, Trash2 } from 'lucide-react';

interface PersonsDirectoryProps {
  persons: PersonSummary[];
  currentFilterPerson: string | null;
  onFilterPerson: (name: string) => void;
  onGeneratePDF: (personName: string) => void;
  onDeletePerson: (name: string) => void;
}

export function PersonsDirectory({
  persons,
  currentFilterPerson,
  onFilterPerson,
  onGeneratePDF,
  onDeletePerson,
}: PersonsDirectoryProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
        Persons Directory (A-Z)
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {persons.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No persons added yet.</p>
        ) : (
          persons.map(p => {
            const isSelected = currentFilterPerson === p.name;
            return (
              <div
                key={p.name}
                className={`group rounded-xl transition flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onFilterPerson(p.name)}
                  className="flex-1 text-left px-3 py-2.5 text-xs font-medium flex justify-between items-center"
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className={`font-bold text-sm ${isSelected ? 'text-white' : p.netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    Rs. {Math.abs(p.netBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onGeneratePDF(p.name)}
                  title="Generate PDF Report"
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    isSelected
                      ? 'bg-white/20 hover:bg-white/30'
                      : 'bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePerson(p.name)}
                  title="Delete all records for this person"
                  className={`mr-1.5 p-1.5 rounded-lg transition shrink-0 ${
                    isSelected
                      ? 'bg-white/20 hover:bg-white/30'
                      : 'bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900/70 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


