import { useState, useEffect, useCallback } from 'react';
import type { LedgerEntry } from '@/types';

const STORAGE_KEY = 'nexora_ledger_entries';

function loadFromStorage(): LedgerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>(() => loadFromStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((entry: Omit<LedgerEntry, 'id'>) => {
    setEntries(prev => [...prev, { ...entry, id: Date.now().toString() + Math.random().toString(36).slice(2, 7) }]);
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<LedgerEntry>) => {
    setEntries(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const importEntries = useCallback((data: LedgerEntry[]) => {
    setEntries(data);
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry, importEntries };
}
