import { useState, useRef, useEffect } from 'react';
import type { LedgerEntry, EntryType } from '@/types';

interface EntryFormProps {
  lockedPerson: string | null;
  onLockPerson: (name: string) => void;
  onUnlockPerson: () => void;
  onSubmit: (entry: Omit<LedgerEntry, 'id'>) => void;
  editingEntry: LedgerEntry | null;
  onCancelEdit: () => void;
  allPersons: string[];
}

export function EntryForm({
  lockedPerson,
  onLockPerson,
  onUnlockPerson,
  onSubmit,
  editingEntry,
  onCancelEdit,
  allPersons,
}: EntryFormProps) {
  const [person, setPerson] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<EntryType>('given');
  const [amount, setAmount] = useState('');
  const [ghost, setGhost] = useState('');
  const personRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingEntry) {
      setPerson(editingEntry.person);
      setDate(editingEntry.date);
      setType(editingEntry.type);
      setAmount(String(editingEntry.amount));
    }
  }, [editingEntry]);

  useEffect(() => {
    if (lockedPerson) {
      setPerson(lockedPerson);
    }
  }, [lockedPerson]);

  function handlePersonInput(val: string) {
    setPerson(val);
    if (!val) {
      setGhost('');
      return;
    }
    const match = allPersons.find(p => p.toLowerCase().startsWith(val.toLowerCase()));
    if (match && match.toLowerCase() !== val.toLowerCase()) {
      setGhost(val + match.slice(val.length));
    } else {
      setGhost('');
    }
  }

  function handlePersonKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['Tab', 'ArrowRight', 'ArrowDown', 'Enter'].includes(e.key) && ghost) {
      e.preventDefault();
      setPerson(ghost);
      setGhost('');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const personName = lockedPerson || person.trim();
    if (!personName) return;
    const capitalizedName = personName.charAt(0).toUpperCase() + personName.slice(1);
    onSubmit({ person: capitalizedName, date, type, amount: parseFloat(amount) });
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    if (!lockedPerson) onLockPerson(capitalizedName);
  }

  function handleCancel() {
    setPerson('');
    setAmount('');
    setType('given');
    setDate(new Date().toISOString().split('T')[0]);
    onCancelEdit();
    onUnlockPerson();
    personRef.current?.focus();
  }

  const isEditing = !!editingEntry;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
        <span>New Entry</span>
        <span
          className={`text-xs font-normal px-2.5 py-1 rounded-full ${
            isEditing
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {isEditing ? 'Editing' : 'Adding'}
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Person Name
          </label>
          <div className="relative bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
            {ghost && !lockedPerson && (
              <div className="absolute inset-0 flex items-center px-3 text-sm text-slate-400 pointer-events-none whitespace-pre overflow-hidden">
                {ghost}
              </div>
            )}
            <input
              ref={personRef}
              type="text"
              value={person}
              onChange={e => handlePersonInput(e.target.value)}
              onKeyDown={handlePersonKeyDown}
              disabled={!!lockedPerson}
              required
              placeholder="Type name..."
              className={`relative z-10 w-full px-3 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none border-none rounded-xl bg-transparent ${
                lockedPerson ? 'cursor-not-allowed' : ''
              }`}
            />
          </div>
          {lockedPerson && (
            <div className="mt-2 flex items-center justify-between bg-blue-50 dark:bg-blue-950/50 p-2 rounded-lg border border-blue-100 dark:border-blue-900">
              <span className="text-xs font-medium text-blue-900 dark:text-blue-200 truncate">
                Active Person: {lockedPerson}
              </span>
              <button
                type="button"
                onClick={() => {
                  onUnlockPerson();
                  setPerson('');
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-blue-200 dark:border-blue-800"
              >
                Change
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="entryType"
              value="given"
              checked={type === 'given'}
              onChange={() => setType('given')}
              className="peer sr-only"
            />
            <div className="text-center py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 transition shadow-sm">
              Given (Debit)
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="entryType"
              value="taken"
              checked={type === 'taken'}
              onChange={() => setType('taken')}
              className="peer sr-only"
            />
            <div className="text-center py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 peer-checked:bg-rose-600 peer-checked:text-white peer-checked:border-rose-600 transition shadow-sm">
              Taken (Credit)
            </div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Amount (Rs)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm active:scale-95"
          >
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-3 rounded-xl transition text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
