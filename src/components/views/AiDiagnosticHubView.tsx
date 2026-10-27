import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  FileCheck, 
  Stethoscope, 
  Sliders, 
  Send,
  Zap,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Patient, ClinicalOrder } from '../../types/clinical';

interface AiDiagnosticHubViewProps {
  patient: Patient;
  onAuthorizeOrder: (order: Partial<ClinicalOrder>) => void;
  onNavigate: (screen: string) => void;
}

export const AiDiagnosticHubView: React.FC<AiDiagnosticHubViewProps> = ({
  patient,
  onAuthorizeOrder,
  onNavigate,
}) => {
  const [selectedDifferentialId, setSelectedDifferentialId] = useState<string>(
    patient.aiDifferentials[0]?.id || ''
  );
  const [targetMap, setTargetMap] = useState<number>(65);
  const [authorizedActionIds, setAuthorizedActionIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedDiff =
    patient.aiDifferentials.find((d) => d.id === selectedDifferentialId) ||
    patient.aiDifferentials[0];

  const handleExecuteAction = (action: { id: string; action: string; type: string; detail: string; dosage?: string }) => {
    // Add to authorized set
    setAuthorizedActionIds((prev) => new Set([...prev, action.id]));

    // Dispatch order to global store
    onAuthorizeOrder({
      patientId: patient.id,
      patientName: patient.name,
      bed: patient.bed,
      title: action.action,
      type: action.type === 'Medication' ? 'Medication' : action.type === 'Diagnostics' ? 'Stat Lab' : 'Nursing Procedure',
      priority: 'STAT',
      status: 'Authorized',
      orderedBy: 'Dr. Sarah Chen, MD (AI Protocol Guided)',
      instructions: action.detail + (action.dosage ? ` Dosage: ${action.dosage}` : ''),
    });

    setToastMessage(`Authorized Order: "${action.action}" dispatched to ICU pharmacy & nurse station.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-teal-500/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
            <BrainCircuit className="w-4 h-4" />
            <span>ALGORITHMIC CLINICAL DECISION SUPPORT · LEVEL 1 TRAUMA PROTOCOL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Algorithmic AI Diagnosis & Diagnostic Recommendation Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continuous Bayesian synthesis of real-time hemodynamics, lab kinetics, and post-surgical telemetry for {patient.name} ({patient.bed})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('patient')}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Review Waveforms
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-3 py-1.5 rounded-lg bg-[#006194] text-white text-xs font-semibold hover:bg-[#004b73] transition-colors"
          >
            View Active Orders
          </button>
        </div>
      </div>

      {/* SIGNATURE COMPONENT: AI Diagnosis & Diagnostic Recommendation Card */}
      <div
        className="rounded-2xl bg-[#f0fdfa]/70 backdrop-blur-md p-6 border border-slate-200 shadow-sm relative overflow-hidden"
        style={{
          borderTop: '4px solid transparent',
          borderImage: 'linear-gradient(90deg, #0284C7, #0D9488) 1',
        }}
      >
        {/* Top Header & Confidence Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-teal-900/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse-live" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Primary Algorithmic Hypothesis
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs text-slate-500">{selectedDiff?.icdCode}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedDiff?.condition}
            </h2>
          </div>

          {/* Clinical Confidence Metric Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/90 border border-teal-200/80 rounded-full px-4 py-1.5 shadow-2xs flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Confidence:</span>
              <span className="text-lg font-bold font-mono text-teal-800 tabular-nums">
                {selectedDiff?.confidence}%
              </span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase bg-teal-50 px-2 py-0.5 rounded-full">
                High Acuity
              </span>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              {selectedDiff?.urgency} ACTION
            </span>
          </div>
        </div>

        {/* Pathophysiological Rationale & Key Telemetry Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-5">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Clinical Rationale & Mechanism
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-teal-100">
              {selectedDiff?.rationale}
            </p>

            {/* Key Drivers List */}
            <div className="mt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Empirical Telemetry Evidence Drivers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDiff?.keyDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-white/70 border border-teal-100 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Hemodynamic Target Titration Console */}
          <div className="bg-white/80 rounded-xl p-4 border border-teal-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#006194]" />
                  Vasopressor MAP Goal
                </span>
                <span className="font-mono text-sm font-bold text-[#006194]">
                  {targetMap} mmHg
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Current MAP: <strong className="text-rose-600">{patient.vitals.meanArterialPressure} mmHg</strong> (Deficit: {targetMap - patient.vitals.meanArterialPressure} mmHg)
              </p>

              {/* Interactive Target MAP Slider */}
              <div className="mt-4">
                <input
                  type="range"
                  min="60"
                  max="80"
                  step="1"
                  value={targetMap}
                  onChange={(e) => setTargetMap(Number(e.target.value))}
                  className="w-full accent-[#006194] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>60 (Renal minimum)</span>
                  <span>65 (Surviving Sepsis)</span>
                  <span>75 (Neuro target)</span>
                </div>
              </div>

              {/* Dynamic titration prompt */}
              <div className="mt-4 p-2.5 rounded bg-sky-50 text-[11px] text-slate-700 border border-sky-100">
                <strong>Recommended Titration:</strong> Escalate Norepinephrine by 0.04 mcg/kg/min every 5m until MAP reaches {targetMap} mmHg.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Physiological Model:</span>
              <span className="font-mono text-teal-800 font-semibold">SVRI Optimization</span>
            </div>
          </div>
        </div>

        {/* Actionable Clinical Recommendation Matrix */}
        <div className="mt-2 pt-5 border-t border-teal-900/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Actionable Clinical Interventions (1-Click Clinician Authorization)
            </h3>
            <span className="text-[11px] text-slate-500">
              Orders transmitted directly to ICU EHR & Pyxis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDiff?.recommendedActions.map((action) => {
              const isAuthorized = authorizedActionIds.has(action.id);

              return (
                <div
                  key={action.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isAuthorized
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white/90 border-slate-200/90 hover:border-teal-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">
                        {action.type}
                      </span>
                      {action.dosage && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {action.dosage}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-1">
                      {action.action}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {action.detail}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isAuthorized ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Order Authorized & Dispatched</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExecuteAction(action)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-2xs"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Authorize Clinical Order</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinician Attestation & Digital Verification Footer */}
        <div className="mt-6 pt-4 border-t border-teal-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Attestation: Dr. Sarah Chen, MD, FCCM (Attending Intensivist)</span>
          </div>
          <div className="font-mono text-[11px]">
            Model: Clinical-Bayesian-Triage v4 · Audit Ref: #9901-CTICU
          </div>
        </div>
      </div>

      {/* Differential Diagnoses Tree / Multi-Hypothesis Comparison */}
      <div className="glass-panel-1 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Pathophysiological Differential Hierarchy
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Select alternative hypothesis to inspect underlying rationale and evidence breakdown
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patient.aiDifferentials.map((diff) => {
            const isSelected = diff.id === selectedDifferentialId;

            return (
              <button
                key={diff.id}
                onClick={() => setSelectedDifferentialId(diff.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/80 border-[#006194] ring-2 ring-[#006194]/20 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-medium">{diff.icdCode}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {diff.confidence}%
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-2">
                    {diff.condition}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    {diff.rationale}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${
                      diff.urgency === 'Immediate'
                        ? 'text-rose-600'
                        : diff.urgency === 'Urgent'
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {diff.urgency} Action
                  </span>
                  <span className="text-[#006194] font-medium flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
