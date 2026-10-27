import React, { useState } from 'react';
import { 
  Activity, 
  BellOff, 
  Eye, 
  Heart, 
  AlertTriangle, 
  Check, 
  Maximize2,
  VolumeX,
  Volume2,
  Bed
} from 'lucide-react';
import { Patient } from '../../types/clinical';

interface WardGridViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (screen: string) => void;
}

// Generate full 12-bed ICU grid by mapping patients to beds
export const WardGridView: React.FC<WardGridViewProps> = ({
  patients,
  onSelectPatient,
  onNavigate,
}) => {
  const [silencedBeds, setSilencedBeds] = useState<Set<string>>(new Set());
  const [selectedWardFilter, setSelectedWardFilter] = useState<'All' | 'Cardiothoracic' | 'Medical' | 'Surgical' | 'Neuro'>('All');

  // Full 12 beds layout
  const allBeds = Array.from({ length: 12 }, (_, i) => {
    const bedNumber = `ICU-${String(i + 1).padStart(2, '0')}`;
    const patient = patients.find((p) => p.bed === bedNumber);
    return {
      bedNumber,
      patient: patient || null,
      ward: i < 4 ? 'Cardiothoracic' : i < 8 ? 'Medical' : i < 10 ? 'Surgical' : 'Neuro',
    };
  });

  const toggleSilence = (bedNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSilencedBeds((prev) => {
      const next = new Set(prev);
      if (next.has(bedNumber)) {
        next.delete(bedNumber);
      } else {
        next.add(bedNumber);
      }
      return next;
    });
  };

  const filteredBeds = allBeds.filter((b) => {
    if (selectedWardFilter === 'All') return true;
    return b.ward === selectedWardFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Ward Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            ICU Central Monitor & Telemetry Wall
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time synchronized continuous biometric monitoring across 12 intensive care suites
          </p>
        </div>

        {/* Filter by unit */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          {(['All', 'Cardiothoracic', 'Medical', 'Surgical', 'Neuro'] as const).map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWardFilter(ward)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedWardFilter === ward
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </div>

      {/* 12-Bed Responsive Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredBeds.map(({ bedNumber, patient, ward }) => {
          if (!patient) {
            // Vacant / Cleaned Bed
            return (
              <div
                key={bedNumber}
                className="rounded-xl border border-dashed border-slate-300 p-5 bg-slate-50/50 flex flex-col justify-between min-h-[220px]"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono font-bold">{bedNumber}</span>
                  <span>{ward} ICU</span>
                </div>
                <div className="text-center py-6">
                  <Bed className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-500">Bed Sanitized & Ready</div>
                  <div className="text-[11px] text-slate-400">Telemetry Lead Disconnected</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    AVAILABLE FOR ADMIT
                  </span>
                </div>
              </div>
            );
          }

          const isCritical = patient.acuityLevel === 'critical';
          const isWarning = patient.acuityLevel === 'warning';
          const isSilenced = silencedBeds.has(bedNumber);

          return (
            <div
              key={bedNumber}
              onClick={() => {
                onSelectPatient(patient.id);
                onNavigate('patient');
              }}
              className={`rounded-xl border transition-all cursor-pointer p-4 bg-[#071322] text-slate-100 flex flex-col justify-between min-h-[240px] shadow-sm hover:ring-2 hover:ring-sky-500/40 relative overflow-hidden group ${
                isCritical
                  ? 'border-rose-500/60'
                  : isWarning
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Bed Header */}
              <div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCritical
                          ? 'bg-rose-500 animate-pulse-live'
                          : isWarning
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-mono font-bold text-white tracking-wide">{bedNumber}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[110px]">{patient.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => toggleSilence(bedNumber, e)}
                      className={`p-1 rounded text-[11px] transition-colors ${
                        isSilenced
                          ? 'bg-amber-500/30 text-amber-300'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isSilenced ? 'Alarm Silenced (3m)' : 'Silence Alarm'}
                    >
                      <BellOff className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      SOFA {patient.acuityScore}
                    </span>
                  </div>
                </div>

                {/* Primary Vitals Strip */}
                <div className="grid grid-cols-4 gap-2 py-3 text-center border-b border-slate-800/80">
                  <div>
                    <div className="text-[10px] uppercase text-emerald-400 font-semibold">HR</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                      {patient.vitals.heartRate}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase text-rose-400 font-semibold">BP (MAP)</div>
                    <div className="text-xs font-bold font-mono text-rose-400 tabular-nums mt-1">
                      {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
                    </div>
                    <div className="text-[10px] font-mono text-rose-300">({patient.vitals.meanArterialPressure})</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase text-cyan-400 font-semibold">SpO₂</div>
                    <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                      {patient.vitals.spo2}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase text-amber-400 font-semibold">RESP</div>
                    <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                      {patient.vitals.respRate}
                    </div>
                  </div>
                </div>

                {/* Mini Live ECG Sparkline Rhythm Canvas Simulation */}
                <div className="py-2.5 h-16 w-full relative ecg-dark-grid-bg rounded overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#00f0b5"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,20 20,20 25,18 28,23 35,20 40,20 42,24 45,5 48,32 51,20 60,20 68,14 74,20 90,20 100,20 105,18 108,23 115,20 120,20 122,24 125,5 128,32 131,20 140,20 148,14 154,20 170,20 180,20 185,18 188,23 195,20 200,20"
                    />
                  </svg>
                  {/* Subtle sweep glow line */}
                  <div className="absolute top-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-cyan-400/30 animate-[sweep-line_2.5s_linear_infinite]" />
                </div>
              </div>

              {/* Bed Footer Diagnosis */}
              <div className="pt-2 text-[11px] flex items-center justify-between text-slate-400">
                <span className="truncate max-w-[180px]">{patient.primaryDiagnosis}</span>
                <span className="text-cyan-400 group-hover:text-cyan-300 font-medium text-[10px] flex items-center gap-1">
                  Inspect <Maximize2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
