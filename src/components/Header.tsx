import { Download, Upload, Sun, Moon, Zap } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export function Header({ theme, onToggleTheme, onExport, onImport }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
            <Zap className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight group-hover:text-blue-400 transition">NEXORA LEDGER</h1>
            <p className="text-xs text-slate-400">Person-wise Smart Ledger System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={onExport}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition shadow-sm cursor-pointer active:scale-95 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={e => {
                if (e.target.files?.[0]) onImport(e.target.files[0]);
                e.target.value = '';
              }}
            />
          </label>
          <button
            onClick={onToggleTheme}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition transform active:scale-95 flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}


