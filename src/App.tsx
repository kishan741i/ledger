import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { EntryForm } from '@/components/EntryForm';
import { PersonsDirectory } from '@/components/PersonsDirectory';
import { SummaryStats } from '@/components/SummaryStats';
import { TransactionsTable } from '@/components/TransactionsTable';
import { useLedger } from '@/hooks/useLedger';
import { useTheme } from '@/hooks/useTheme';
import { generatePersonReport, generateFullReport } from '@/utils/pdfReport';
import type { LedgerEntry, PersonSummary } from '@/types';

function App() {
  const { entries, addEntry, updateEntry, deleteEntry, importEntries } = useLedger();
  const { theme, toggleTheme } = useTheme();

  const [lockedPerson, setLockedPerson] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [currentFilterPerson, setCurrentFilterPerson] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const allPersons = useMemo(() => {
    const persons = [...new Set(entries.map(item => item.person.trim()))];
    return persons.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'accent' }));
  }, [entries]);

  const personSummaries: PersonSummary[] = useMemo(() => {
    return allPersons.map(name => {
      const personEntries = entries.filter(i => i.person.toLowerCase() === name.toLowerCase());
      const totalGiven = personEntries.filter(i => i.type === 'given').reduce((s, i) => s + i.amount, 0);
      const totalTaken = personEntries.filter(i => i.type === 'taken').reduce((s, i) => s + i.amount, 0);
      return {
        name,
        totalGiven,
        totalTaken,
        netBalance: totalGiven - totalTaken,
        entryCount: personEntries.length,
      };
    });
  }, [allPersons, entries]);

  const currentPersonSummary = useMemo(() => {
    if (!currentFilterPerson) return null;
    return personSummaries.find(p => p.name.toLowerCase() === currentFilterPerson.toLowerCase()) ?? null;
  }, [currentFilterPerson, personSummaries]);

  const totals = useMemo(() => {
    const totalGiven = entries.filter(i => i.type === 'given').reduce((s, i) => s + i.amount, 0);
    const totalTaken = entries.filter(i => i.type === 'taken').reduce((s, i) => s + i.amount, 0);
    return { totalGiven, totalTaken, netBalance: totalGiven - totalTaken };
  }, [entries]);

  const handleLockPerson = useCallback((name: string) => {
    setLockedPerson(name);
  }, []);

  const handleUnlockPerson = useCallback(() => {
    setLockedPerson(null);
  }, []);

  const handleSubmit = useCallback(
    (entry: Omit<LedgerEntry, 'id'>) => {
      if (editingEntry) {
        updateEntry(editingEntry.id, entry);
        setEditingEntry(null);
      } else {
        addEntry(entry);
      }
    },
    [editingEntry, updateEntry, addEntry],
  );

  const handleEdit = useCallback((entry: LedgerEntry) => {
    setEditingEntry(entry);
    setLockedPerson(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingEntry(null);
  }, []);

  const handleFilterPerson = useCallback((name: string) => {
    setCurrentFilterPerson(name);
    setLockedPerson(name);
  }, []);

  const handleShowAll = useCallback(() => {
    setCurrentFilterPerson(null);
    setLockedPerson(null);
    setSearch('');
  }, []);

  const handleGeneratePDF = useCallback(
    (personName: string) => {
      const personEntries = entries.filter(i => i.person.toLowerCase() === personName.toLowerCase());
      generatePersonReport(personName, personEntries);
    },
    [entries],
  );

  const handleGenerateFullPDF = useCallback(() => {
    generateFullReport(entries);
  }, [entries]);

  const handleDeletePerson = useCallback(
    (name: string) => {
      if (confirm(`Delete ALL transactions for ${name}? This cannot be undone.`)) {
        const toDelete = entries.filter(i => i.person.toLowerCase() === name.toLowerCase());
        toDelete.forEach(e => deleteEntry(e.id));
        if (currentFilterPerson?.toLowerCase() === name.toLowerCase()) {
          setCurrentFilterPerson(null);
          setLockedPerson(null);
        }
      }
    },
    [entries, deleteEntry, currentFilterPerson],
  );

  const handleExport = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `nexora_ledger_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [entries]);

  const handleImport = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed)) {
            importEntries(parsed);
            alert('Ledger data imported successfully!');
          } else {
            alert('Invalid JSON file format.');
          }
        } catch {
          alert('Error parsing JSON file.');
        }
      };
    },
    [importEntries],
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header theme={theme} onToggleTheme={toggleTheme} onExport={handleExport} onImport={handleImport} />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <EntryForm
            lockedPerson={lockedPerson}
            onLockPerson={handleLockPerson}
            onUnlockPerson={handleUnlockPerson}
            onSubmit={handleSubmit}
            editingEntry={editingEntry}
            onCancelEdit={handleCancelEdit}
            allPersons={allPersons}
          />
          <PersonsDirectory
            persons={personSummaries}
            currentFilterPerson={currentFilterPerson}
            onFilterPerson={handleFilterPerson}
            onGeneratePDF={handleGeneratePDF}
            onDeletePerson={handleDeletePerson}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SummaryStats
            stats={currentPersonSummary}
            totalGiven={totals.totalGiven}
            totalTaken={totals.totalTaken}
            netBalance={totals.netBalance}
          />
          <TransactionsTable
            entries={entries}
            currentFilterPerson={currentFilterPerson}
            onEdit={handleEdit}
            onDelete={deleteEntry}
            onFilterPerson={handleFilterPerson}
            onGeneratePDF={handleGeneratePDF}
            onGenerateFullPDF={handleGenerateFullPDF}
            onShowAll={handleShowAll}
            search={search}
            onSearchChange={setSearch}
          />
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
        Nexora Ledger &copy; 2026 &bull; Secure Local Storage Ledger
      </footer>
    </div>
  );
}

export default App;
