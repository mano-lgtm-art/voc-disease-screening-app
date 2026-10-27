import React, { useState, useEffect } from 'react';
import { Search, X, User, Heart, Activity, ArrowRight } from 'lucide-react';
import { Patient } from '../types/clinical';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (screen: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = patients.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.bed.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.primaryDiagnosis.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search patients by name, bed (e.g. ICU-04), MRN, or condition..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No clinical records matching "{query}"
            </div>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPatient(p.id);
                  onNavigate('patient');
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group text-xs border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#006194] flex items-center justify-center font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="font-mono text-slate-500 font-medium">({p.bed})</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.mrn}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] truncate max-w-md">
                      {p.primaryDiagnosis}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#006194] transition-colors">
                  <span className="text-[11px] font-mono">HR: {p.vitals.heartRate}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal footer shortcut guide */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigation Quick Jump</span>
          <div className="flex items-center gap-2">
            <span>Esc to exit</span>
            <span>·</span>
            <span>Enter to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
