import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Users, 
  Bed, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Eye, 
  BrainCircuit, 
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Patient } from '../../types/clinical';

interface ExecutiveOverviewViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (screen: string) => void;
  onOpenOrderModal: () => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  patients,
  onSelectPatient,
  onNavigate,
  onOpenOrderModal,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter((pt) => {
    const matchesFilter = filterMode === 'all' || pt.acuityLevel === filterMode;
    const matchesSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.mrn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const criticalCount = patients.filter((p) => p.acuityLevel === 'critical').length;
  const warningCount = patients.filter((p) => p.acuityLevel === 'warning').length;
  const nominalCount = patients.filter((p) => p.acuityLevel === 'nominal').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
            Executive Clinical Overview & Predictive Triage
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Metropolitan Critical Care Network</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Biometric Stream</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">All Telemetry Stations Synchronized</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ward-grid')}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap"
          >
            Open 12-Bed Central Wall
          </button>
          <button
            onClick={onOpenOrderModal}
            className="px-4 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            + Create Clinical Order
          </button>
        </div>
      </div>

      {/* High-Acuity Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: ICU Bed Occupancy */}
        <div className="glass-panel-1 rounded-xl p-5 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>ICU Bed Occupancy</span>
            <Bed className="w-4 h-4 text-[#006194]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#0b1c30] font-mono tabular-nums">18 / 20</span>
            <span className="text-xs font-semibold text-amber-600">90% Capacity</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>2 Resuscitation Beds Open</span>
            <span className="text-emerald-700">Surge Ready</span>
          </div>
        </div>

        {/* Metric 2: Critical Acuity Patients */}
        <div className="glass-panel-1 rounded-xl p-5 border-rose-200/50 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Critical Acuity Patients</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse-live" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-rose-600 font-mono tabular-nums">{criticalCount}</span>
            <span className="text-xs text-rose-600 font-medium">SOFA &gt; 9.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Continuous Vasopressors / ARDS</span>
            <span className="text-rose-600 font-medium">Requires Stat Review</span>
          </div>
        </div>

        {/* Metric 3: Predictive Sepsis / Shock Alerts */}
        <div className="glass-panel-1 rounded-xl p-5 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Algorithmic Triage Alerts</span>
            <BrainCircuit className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#0b1c30] font-mono tabular-nums">3</span>
            <span className="text-xs text-teal-700 font-medium">94.2% Peak Confidence</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>Vasoplegic Syndrome Detected</span>
            <span className="text-teal-700">Action Available</span>
          </div>
        </div>

        {/* Metric 4: Average Ward Mean Arterial Pressure */}
        <div className="glass-panel-1 rounded-xl p-5 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Ward Hemodynamic Stability</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#0b1c30] font-mono tabular-nums">82</span>
            <span className="text-xs font-mono text-slate-500">MAP mmHg avg</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
            <span>1 patient below 65 target</span>
            <span className="text-amber-700 font-medium">ICU-04 Vance</span>
          </div>
        </div>
      </div>

      {/* Featured Clinical Intervention Spotlight (Eleanor Vance Alert) */}
      <div className="rounded-xl border border-sky-600/30 bg-gradient-to-r from-sky-50/90 via-teal-50/70 to-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006194]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-live" />
              <span>HIGH-ACUITY TRIAGE PRIORITY · BED ICU-04</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-600">ELEANOR VANCE (68F)</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Acute Vasoplegic Syndrome: Systemic Hypotension with Hyperdynamic Cardiac Index
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              Real-time telemetry detects MAP 65 mmHg on escalating Norepinephrine (0.08 mcg/kg/min), rising lactate (3.4 mmol/L), and elevated stroke volume variation (15%). Algorithmic diagnostic confidence is 94.2%.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onSelectPatient('pt-001');
                onNavigate('ai-hub');
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Review AI Recommendation</span>
            </button>
            <button
              onClick={() => {
                onSelectPatient('pt-001');
                onNavigate('patient');
              }}
              className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors whitespace-nowrap"
            >
              Inspect Waveforms
            </button>
          </div>
        </div>
      </div>

      {/* Main Patient Triage & Telemetry Table */}
      <div className="glass-panel-1 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Real-Time Patient Triage Queue
            </h3>
            <p className="text-xs text-slate-500">
              Sorted by predictive clinical acuity and vital instability
            </p>
          </div>

          {/* Interactive Filter Segmented Control & Search Input */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter patient or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white/90 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194]"
              />
            </div>

            {/* Segmented Filter Control */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({patients.length})
              </button>
              <button
                onClick={() => setFilterMode('critical')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'critical'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setFilterMode('warning')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'warning'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                Guarded ({warningCount})
              </button>
              <button
                onClick={() => setFilterMode('nominal')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filterMode === 'nominal'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Stable ({nominalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-semibold">
                <th className="py-3 px-3">Bed / MRN</th>
                <th className="py-3 px-3">Patient Name</th>
                <th className="py-3 px-3">Primary Diagnosis</th>
                <th className="py-3 px-3">Acuity (SOFA)</th>
                <th className="py-3 px-3">Heart Rate</th>
                <th className="py-3 px-3">Blood Pressure (MAP)</th>
                <th className="py-3 px-3">SpO₂</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredPatients.map((pt) => {
                const isCritical = pt.acuityLevel === 'critical';
                const isWarning = pt.acuityLevel === 'warning';

                return (
                  <tr
                    key={pt.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-900">
                      <div>{pt.bed}</div>
                      <div className="text-[10px] text-slate-400">{pt.mrn}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{pt.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        {pt.age}y {pt.gender} · {pt.ward}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                      {pt.primaryDiagnosis}
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`font-bold tabular-nums px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {pt.acuityScore}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono tabular-nums">
                      <span className={pt.vitals.heartRate > 100 ? 'text-rose-600 font-semibold' : 'text-slate-800'}>
                        {pt.vitals.heartRate} bpm
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono tabular-nums">
                      <span className="text-slate-900 font-medium">
                        {pt.vitals.bloodPressureSys}/{pt.vitals.bloodPressureDia}
                      </span>{' '}
                      <span className={pt.vitals.meanArterialPressure < 65 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                        ({pt.vitals.meanArterialPressure})
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono tabular-nums">
                      <span className={pt.vitals.spo2 < 93 ? 'text-amber-600 font-bold' : 'text-slate-800'}>
                        {pt.vitals.spo2}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
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
                        <span className="capitalize font-medium text-slate-700">
                          {isCritical ? 'Critical' : isWarning ? 'Guarded' : 'Nominal'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectPatient(pt.id);
                            onNavigate('patient');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                          title="Inspect Telemetry"
                        >
                          Telemetry
                        </button>
                        <button
                          onClick={() => {
                            onSelectPatient(pt.id);
                            onNavigate('ai-hub');
                          }}
                          className="px-2.5 py-1 rounded bg-[#006194] hover:bg-[#004b73] text-white font-medium transition-colors"
                          title="View AI Diagnosis"
                        >
                          AI Triage
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
