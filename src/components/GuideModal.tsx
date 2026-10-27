import React from 'react';
import { 
  X, 
  HelpCircle, 
  Activity, 
  Heart, 
  BrainCircuit, 
  LayoutGrid, 
  Image as ImageIcon, 
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const features = [
    {
      screen: 'overview',
      title: '1. Triage Overview',
      icon: Activity,
      desc: 'The master operational dashboard for hospital intensivists. It monitors ICU bed occupancy (18/20 beds), rates patient severity using clinical SOFA scores, and ranks patients in an interactive priority queue.',
      tryAction: 'Switch patient filters between Critical, Guarded, and Stable.',
    },
    {
      screen: 'patient',
      title: '2. Patient Telemetry',
      icon: Heart,
      desc: 'High-acuity bedside monitor with 4 live sweep waveforms (ECG Lead II, SpO₂ Plethysmograph, Arterial Blood Pressure, and EtCO₂ Capnography). Displays live vital numbers and blood lab test trends.',
      tryAction: 'Toggle sweep speed (25 vs 50 mm/s), Freeze the waveform, or enable sound.',
    },
    {
      screen: 'ai-hub',
      title: '3. AI Diagnostic Hub',
      icon: BrainCircuit,
      desc: 'An AI-driven diagnostic engine that synthesizes hemodynamics and lab tests to hypothesize root causes (e.g., Postoperative Vasoplegic Syndrome at 94.2% confidence).',
      tryAction: 'Slide the Vasopressor MAP target slider and click "Authorize Clinical Order".',
    },
    {
      screen: 'ward-grid',
      title: '4. ICU Monitor Grid',
      icon: LayoutGrid,
      desc: 'A hospital control room view showing 12 patient beds simultaneously with mini-ECG monitors, bed status, and alarm silencer controls.',
      tryAction: 'Click any bed card to inspect that patient directly.',
    },
    {
      screen: 'imaging-pacs',
      title: '5. PACS Imaging Workstation',
      icon: ImageIcon,
      desc: 'A medical scanner tool displaying real high-res Chest CT Angiogram scans and 4-Chamber Cardiac Cine MRI scans.',
      tryAction: 'Adjust the slice slider, change window presets (Lung/Bone), or click the Caliper to measure lesions.',
    },
    {
      screen: 'orders',
      title: '6. Clinical Orders Console',
      icon: FileText,
      desc: 'Live emergency medication, STAT lab, and procedural order tracking. Doctors can dispatch, review, and sign orders.',
      tryAction: 'Click "Mark Administered" or create a new STAT order.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006194] text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                What is the Clinical Intelligence Platform?
              </h3>
              <p className="text-xs text-slate-500">
                A hospital ICU monitoring & algorithmic triage system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-slate-800 leading-relaxed">
            <p className="font-semibold text-sm text-[#006194] mb-1">
              Plain English Summary:
            </p>
            This application is an <strong>executive-grade hospital ICU (Intensive Care Unit) platform</strong> built for critical care doctors, nurses, and hospital directors. It simulates what medical professionals see on their monitors: tracking patients' heartbeats in real-time, detecting sudden complications before they worsen, and using an AI assistant to recommend life-saving medication dosages and tests.
          </div>

          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pt-1">
            Explore The 6 Modules:
          </h4>

          <div className="space-y-2.5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.screen}
                  className="p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#006194]" />
                      <span>{f.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {f.desc}
                    </p>
                    <div className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                      <span>✨ Try:</span> {f.tryAction}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate(f.screen);
                      onClose();
                    }}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white font-semibold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Tip: Press <strong>⌘K</strong> or <strong>Ctrl+K</strong> anytime to search patients.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors text-xs"
          >
            Got it, explore!
          </button>
        </div>
      </div>
    </div>
  );
};
