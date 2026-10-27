import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplet, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  BrainCircuit, 
  FilePlus, 
  ShieldAlert,
  Calendar,
  User,
  Share2
} from 'lucide-react';
import { Patient } from '../../types/clinical';
import { LiveWaveformMonitor } from '../LiveWaveformMonitor';

interface PatientTelemetryViewProps {
  patient: Patient;
  onNavigate: (screen: string) => void;
  onOpenOrderModal: () => void;
}

export const PatientTelemetryView: React.FC<PatientTelemetryViewProps> = ({
  patient,
  onNavigate,
  onOpenOrderModal,
}) => {
  const [trendTimeframe, setTrendTimeframe] = useState<'4h' | '12h' | '24h'>('12h');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // Synthetic longitudinal 12h trend data points based on baseline
  const trendPoints = [
    { time: '22:00', hr: 78, map: 74, spo2: 97, lactate: 1.8 },
    { time: '00:00', hr: 82, map: 72, spo2: 97, lactate: 2.1 },
    { time: '02:00', hr: 86, map: 69, spo2: 96, lactate: 2.4 },
    { time: '04:00', hr: 92, map: 68, spo2: 96, lactate: 2.7 },
    { time: '06:00', hr: 98, map: 66, spo2: 95, lactate: 3.0 },
    { time: '08:00', hr: 101, map: 64, spo2: 95, lactate: 3.2 },
    { time: '10:00', hr: patient.vitals.heartRate, map: patient.vitals.meanArterialPressure, spo2: patient.vitals.spo2, lactate: 3.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Master Demographics Card */}
      <div className="glass-panel-1 rounded-xl p-5 border-l-4 border-l-[#006194]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {patient.avatarUrl ? (
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl shrink-0">
                {patient.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {patient.bed}
                </span>
                <span className="font-mono text-xs text-slate-500">{patient.mrn}</span>
                <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                  {patient.codeStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                <span>{patient.age} years old · {patient.gender}</span>
                <span aria-hidden="true">·</span>
                <span>{patient.ward}</span>
                <span aria-hidden="true">·</span>
                <span>Admitted: {patient.admissionTime}</span>
                <span aria-hidden="true">·</span>
                <span>Attending: <strong>{patient.attendingPhysician}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-slate-700">Diagnosis:</span>
                <span className="text-slate-900 font-medium">{patient.primaryDiagnosis}</span>
                {patient.allergies.length > 0 && (
                  <span className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                    Allergies: {patient.allergies.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('ai-hub')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Diagnostic Hub</span>
            </button>
            <button
              onClick={() => onNavigate('imaging-pacs')}
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              View PACS Scans
            </button>
            <button
              onClick={onOpenOrderModal}
              className="px-3.5 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white text-xs font-semibold transition-colors"
            >
              + Stat Order
            </button>
          </div>
        </div>
      </div>

      {/* High-Acuity Biometric Number Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Heart Rate */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Heart Rate</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {patient.vitals.heartRate}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">bpm (Sinus)</div>
        </div>

        {/* Arterial BP */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Art BP (MAP)</div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
            {patient.vitals.bloodPressureSys}/{patient.vitals.bloodPressureDia}
          </div>
          <div className="text-[10px] text-rose-600 font-mono font-semibold">MAP: {patient.vitals.meanArterialPressure} mmHg</div>
        </div>

        {/* SpO2 */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SpO₂</div>
          <div className="text-2xl font-bold font-mono text-cyan-600 mt-1 tabular-nums">
            {patient.vitals.spo2}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono">PI: {patient.vitals.perfusionIndex}%</div>
        </div>

        {/* Respiration */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resp / EtCO₂</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {patient.vitals.respRate}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">EtCO₂: {patient.vitals.etco2} mmHg</div>
        </div>

        {/* Core Temperature */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Temperature</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {patient.vitals.temperature}°C
          </div>
          <div className="text-[10px] text-amber-600 font-mono">Febrile Spike</div>
        </div>

        {/* Cardiac Index */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Cardiac Index</div>
          <div className="text-2xl font-bold font-mono text-teal-700 mt-1 tabular-nums">
            {patient.vitals.cardiacIndex}
          </div>
          <div className="text-[10px] text-teal-700 font-mono">L/min/m² (Hyper)</div>
        </div>

        {/* Stroke Volume Variation */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SVV</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {patient.vitals.strokeVolumeVariation}%
          </div>
          <div className="text-[10px] text-amber-600 font-mono">Fluid Sensitive</div>
        </div>

        {/* Central Venous Pressure */}
        <div className="glass-panel-1 rounded-xl p-3 text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">CVP</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {patient.vitals.centralVenousPressure}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">mmHg (Optimal)</div>
        </div>
      </div>

      {/* Real-Time Continuous 4-Channel Waveform Monitor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-live" />
            <h2 className="text-base font-bold text-slate-900">
              Continuous Multi-Channel Telemetry Stream
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Direct Cathode Sweep · Sweep Active
          </div>
        </div>

        <LiveWaveformMonitor
          vitals={patient.vitals}
          patientName={patient.name}
          bed={patient.bed}
        />
      </div>

      {/* Longitudinal 12-Hour Hemodynamic Trend & Lab Biomarkers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 12-Hour Hemodynamic Trend Chart */}
        <div className="glass-panel-1 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Longitudinal Hemodynamic Trend
                </h3>
                <p className="text-xs text-slate-500">
                  Mean Arterial Pressure vs. Heart Rate & Lactate Kinetics
                </p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-md text-xs font-medium">
                {(['4h', '12h', '24h'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrendTimeframe(t)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      trendTimeframe === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Trend Plot */}
            <div className="relative mt-4 h-52 w-full">
              <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                {/* Horizontal reference threshold lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#fee2e2" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Critical MAP 65 threshold marker */}
                <text x="5" y="126" fill="#ef4444" fontSize="9" fontWeight="600" fontFamily="monospace">
                  TARGET MAP 65 mmHg THRESHOLD
                </text>

                {/* MAP Trend Line (Red/Coral) */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trendPoints
                    .map((pt, i) => `${(i / (trendPoints.length - 1)) * 480 + 10},${180 - (pt.map - 40) * 2.8}`)
                    .join(' ')}
                />

                {/* Heart Rate Trend Line (Emerald) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trendPoints
                    .map((pt, i) => `${(i / (trendPoints.length - 1)) * 480 + 10},${180 - (pt.hr - 50) * 1.8}`)
                    .join(' ')}
                />

                {/* Interactive Points */}
                {trendPoints.map((pt, i) => {
                  const x = (i / (trendPoints.length - 1)) * 480 + 10;
                  const yMap = 180 - (pt.map - 40) * 2.8;
                  const isHovered = hoveredTrendIndex === i;

                  return (
                    <g key={pt.time} onMouseEnter={() => setHoveredTrendIndex(i)} onMouseLeave={() => setHoveredTrendIndex(null)} className="cursor-pointer">
                      <circle cx={x} cy={yMap} r={isHovered ? 5 : 3.5} fill="#ef4444" />
                      {/* Vertical axis time labels */}
                      <text x={x} y="175" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {pt.time}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover HUD Tooltip */}
              {hoveredTrendIndex !== null && (
                <div className="absolute top-2 right-2 bg-slate-900/90 text-white rounded p-2 text-xs font-mono shadow-md border border-slate-700 pointer-events-none">
                  <div>Time: {trendPoints[hoveredTrendIndex].time}</div>
                  <div className="text-red-400">MAP: {trendPoints[hoveredTrendIndex].map} mmHg</div>
                  <div className="text-emerald-400">HR: {trendPoints[hoveredTrendIndex].hr} bpm</div>
                  <div className="text-amber-400">Lactate: {trendPoints[hoveredTrendIndex].lactate} mmol/L</div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-rose-500 rounded-full" />
                <span>MAP (Hypotension trajectory)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span>Heart Rate (Compensatory tachycardia)</span>
              </div>
            </div>
            <span className="font-mono text-[11px]">Updated 2m ago</span>
          </div>
        </div>

        {/* Tabular Laboratory Biomarkers & Threshold Monitoring */}
        <div className="glass-panel-1 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Diagnostic Laboratory Biomarkers
              </h3>
              <p className="text-xs text-slate-500">
                Threshold limits with kinetic trajectory indicators
              </p>
            </div>
            <button
              onClick={onOpenOrderModal}
              className="text-xs font-semibold text-[#006194] hover:underline"
            >
              + Order Stat Lab
            </button>
          </div>

          <div className="mt-2 divide-y divide-slate-100">
            {patient.labs.map((lab) => {
              const isCrit = lab.status === 'critical';
              const isCaution = lab.status === 'caution';

              return (
                <div key={lab.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-[140px]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{lab.name}</span>
                      {lab.trend === 'rising' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                      ) : lab.trend === 'falling' ? (
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Ref: {lab.referenceLow} - {lab.referenceHigh} {lab.unit}
                    </div>
                  </div>

                  {/* Visual Range Bar */}
                  <div className="hidden sm:block flex-1 max-w-[120px]">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${
                          isCrit ? 'bg-rose-500' : isCaution ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(15, (lab.value / (lab.referenceHigh * 1.5)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Numeric Value & Badge */}
                  <div className="text-right">
                    <div className="font-bold font-mono text-sm tabular-nums text-slate-900">
                      <span className={isCrit ? 'text-rose-600' : isCaution ? 'text-amber-700' : 'text-slate-900'}>
                        {lab.value}
                      </span>{' '}
                      <span className="text-[10px] text-slate-500 font-normal">{lab.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {lab.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
