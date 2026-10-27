import React from 'react';
import { ShieldAlert, Bell, Search, Sparkles, Volume2, VolumeX, Plus, HelpCircle } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/mockPatients';

interface HeaderProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onOpenOrderModal: () => void;
  onOpenSearchModal: () => void;
  onOpenGuideModal: () => void;
  activePatientName: string;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  criticalAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  onOpenOrderModal,
  onOpenSearchModal,
  onOpenGuideModal,
  isAudioMuted,
  onToggleAudio,
  criticalAlertCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Triage Overview' },
    { id: 'patient', label: 'Patient Telemetry' },
    { id: 'ai-hub', label: 'AI Diagnostic Hub' },
    { id: 'ward-grid', label: 'ICU Monitor Grid' },
    { id: 'imaging-pacs', label: 'PACS Imaging' },
    { id: 'orders', label: 'Clinical Orders' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3">
      <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title (single text element wordmark) */}
        <button
          onClick={() => onNavigate('overview')}
          className="text-lg font-bold tracking-tight text-[#006194] hover:text-[#004b73] transition-colors whitespace-nowrap text-left"
        >
          Clinical Intelligence
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors whitespace-nowrap text-sm py-1 relative ${
                  isActive
                    ? 'text-[#006194] font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006194] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + clinical utilities */}
        <div className="flex items-center gap-2.5">
          {/* Guide / What is this Button */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#006194] border border-sky-200 text-xs font-semibold transition-colors"
            title="What is this? - Platform Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">What is this?</span>
          </button>

          {/* Quick Search Hotkey Trigger */}
          <button
            onClick={onOpenSearchModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/80 text-xs text-slate-500 transition-colors border border-slate-200/60"
            title="Search Patients or Labs (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600">Search...</span>
            <kbd className="px-1 py-0.5 text-[10px] bg-white rounded border border-slate-300 font-mono text-slate-500">⌘K</kbd>
          </button>

          {/* Audio Chime Mute */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center justify-center ${
              !isAudioMuted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isAudioMuted ? 'Telemetry Chimes Muted' : 'Live Cardiac Chime Active'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Primary Action 1: Stat Order Button */}
          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Stat Order</span>
          </button>

          {/* Doctor Profile Mini Lockup */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={DOCTOR_PROFILE.avatarUrl}
              alt={DOCTOR_PROFILE.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">Dr. S. Chen</div>
              <div className="text-[10px] text-slate-500 leading-tight">Attending MD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-2.5 pb-0.5 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-3 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              activeScreen === item.id
                ? 'bg-[#006194] text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
