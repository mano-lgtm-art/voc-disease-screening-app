import React from 'react';
import { 
  Activity, 
  BrainCircuit, 
  LayoutGrid, 
  Image as ImageIcon, 
  FileText, 
  AlertTriangle,
  Heart,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Patient } from '../types/clinical';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const primaryNav = [
    { id: 'overview', label: 'Triage Overview', icon: Activity, badge: null },
    { id: 'patient', label: 'Patient Telemetry', icon: Heart, badge: null },
    { id: 'ai-hub', label: 'AI Diagnostic Hub', icon: BrainCircuit, badge: 'High Acuity' },
    { id: 'ward-grid', label: 'ICU Monitor Grid', icon: LayoutGrid, badge: '12 Beds' },
    { id: 'imaging-pacs', label: 'PACS Imaging', icon: ImageIcon, badge: null },
    { id: 'orders', label: 'Clinical Orders', icon: FileText, badge: '5 Active' },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-md h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      {/* Primary Navigation Section */}
      <div className="p-3 border-b border-slate-200/60">
        <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase px-2 mb-2">
          Clinical Workspace
        </div>
        <div className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#006194] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Patient Telemetry Switcher Rail */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Active Patients ({patients.length})
          </span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Live Stream
          </span>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
          {patients.map((pt) => {
            const isSelected = pt.id === selectedPatientId;
            const isCritical = pt.acuityLevel === 'critical';
            const isWarning = pt.acuityLevel === 'warning';

            return (
              <button
                key={pt.id}
                onClick={() => {
                  onSelectPatient(pt.id);
                  if (activeScreen === 'overview' || activeScreen === 'ward-grid') {
                    // Let user inspect patient
                  }
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs relative ${
                  isSelected
                    ? 'bg-sky-50/70 border-sky-400/60 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCritical
                          ? 'bg-rose-500 animate-pulse-live'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="font-semibold text-slate-900 truncate max-w-[100px]">
                      {pt.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 font-medium">
                    {pt.bed}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500 font-mono">
                  <span>HR: <strong className="text-slate-800">{pt.vitals.heartRate}</strong></span>
                  <span>BP: <strong className="text-slate-800">{pt.vitals.bloodPressureSys}/{pt.vitals.bloodPressureDia}</strong></span>
                  <span>SOFA: <strong className={isCritical ? 'text-rose-600' : 'text-slate-700'}>{pt.acuityScore}</strong></span>
                </div>

                <div className="text-[10px] text-slate-400 truncate mt-1">
                  {pt.primaryDiagnosis}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>HIPAA Verified</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">LATENCY 4ms</span>
      </div>
    </aside>
  );
};
