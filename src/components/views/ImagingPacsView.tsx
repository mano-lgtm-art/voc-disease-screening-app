import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Sun, 
  Contrast, 
  Layers, 
  Maximize2, 
  Ruler, 
  Save, 
  CheckCircle2,
  FileText,
  Eye,
  Sliders
} from 'lucide-react';
import { Patient } from '../../types/clinical';

interface ImagingPacsViewProps {
  patient: Patient;
}

export const ImagingPacsView: React.FC<ImagingPacsViewProps> = ({ patient }) => {
  const [activeScan, setActiveScan] = useState<'ct' | 'mri'>('ct');
  const [windowPreset, setWindowPreset] = useState<'lung' | 'softTissue' | 'bone'>('lung');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [currentSlice, setCurrentSlice] = useState<number>(48);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurementMm, setMeasurementMm] = useState<number | null>(null);

  // Physician Radiology Note
  const [physicianNote, setPhysicianNote] = useState<string>(
    'CT Chest Angiogram confirms bilateral dependent atelectasis without evidence of gross pulmonary embolism. Cardiac chambers show hyperdynamic left ventricular contractility consistent with vasoplegic vasodilation.'
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const ctScanUrl = '/src/assets/images/medical_chest_ct_scan_1791304654606.jpg';
  const mriScanUrl = '/src/assets/images/medical_cardiac_mri_1791304671995.jpg';

  const handleMeasureClick = () => {
    setIsMeasuring(!isMeasuring);
    if (!isMeasuring) {
      setMeasurementMm(18.4); // Caliper mock calculation
    } else {
      setMeasurementMm(null);
    }
  };

  const handleSaveNote = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Diagnostic PACS Workstation & Imaging Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            DICOM High-Resolution Multislice Viewer · {patient.name} ({patient.mrn}) · Bed {patient.bed}
          </p>
        </div>

        {/* Scan Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setActiveScan('ct');
              setCurrentSlice(48);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeScan === 'ct'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CT Chest Angiography (128 Slices)
          </button>
          <button
            onClick={() => {
              setActiveScan('mri');
              setCurrentSlice(16);
            }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeScan === 'mri'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cardiac Cine MRI (4-Chamber)
          </button>
        </div>
      </div>

      {/* Main PACS Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: The Interactive PACS Viewport */}
        <div className="lg:col-span-2 rounded-2xl bg-[#030712] border border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-xl text-slate-300">
          {/* Top PACS HUD Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-semibold">
                {activeScan === 'ct' ? 'SERIES: CTA-PULMONARY-ANGIO' : 'SERIES: CARDIAC-CINE-EF'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-400">
                SLICE {currentSlice} / {activeScan === 'ct' ? '128' : '32'}
              </span>
            </div>

            {/* Window Presets */}
            <div className="flex items-center gap-1">
              {(['lung', 'softTissue', 'bone'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setWindowPreset(preset)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors ${
                    windowPreset === preset
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Viewport Canvas Frame */}
          <div className="relative my-4 aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-slate-900 select-none group">
            {/* The Diagnostic Medical Image */}
            <img
              src={activeScan === 'ct' ? ctScanUrl : mriScanUrl}
              alt="Medical Scan DICOM"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain transition-transform duration-150"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                filter: `${isInverted ? 'invert(100%)' : 'none'} brightness(${brightness}%) contrast(${
                  windowPreset === 'bone' ? '150%' : windowPreset === 'lung' ? '120%' : '100%'
                })`,
              }}
            />

            {/* Orientation Anatomical Markers */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-slate-400 font-bold bg-black/60 px-2 py-0.5 rounded">
              A (ANTERIOR)
            </span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-slate-400 font-bold bg-black/60 px-2 py-0.5 rounded">
              P (POSTERIOR)
            </span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 font-bold bg-black/60 px-2 py-0.5 rounded">
              R (RIGHT)
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 font-bold bg-black/60 px-2 py-0.5 rounded">
              L (LEFT)
            </span>

            {/* Caliper Measurement Marker Overlay */}
            {measurementMm !== null && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative border-b-2 border-emerald-400 w-32 flex items-center justify-center">
                  <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-300 font-bold mb-6">
                    CALIPER: {measurementMm} mm
                  </span>
                </div>
              </div>
            )}

            {/* Bottom-left metadata overlay */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-black/70 p-2 rounded backdrop-blur-xs leading-tight">
              <div>KV: 120 · mA: 280</div>
              <div>THICKNESS: 1.25 mm</div>
              <div>MATRIX: 512 × 512</div>
            </div>
          </div>

          {/* Bottom Interactive Toolbar & Slice Scrubber */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            {/* Slice Scrubber */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-slate-400 text-[11px]">SLICE</span>
              <input
                type="range"
                min="1"
                max={activeScan === 'ct' ? 128 : 32}
                value={currentSlice}
                onChange={(e) => setCurrentSlice(Number(e.target.value))}
                className="flex-1 accent-cyan-500 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 text-[11px]">{currentSlice}</span>
            </div>

            {/* Tool buttons */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setBrightness((b) => (b >= 140 ? 80 : b + 20))}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Adjust Brightness"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsInverted(!isInverted)}
                  className={`p-1.5 rounded transition-colors ${
                    isInverted ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Invert Grayscale"
                >
                  <Contrast className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleMeasureClick}
                  className={`p-1.5 rounded transition-colors flex items-center gap-1 text-[11px] font-mono ${
                    measurementMm !== null
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Measure Distance"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Caliper</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                ZOOM: {zoomLevel}% · BRIGHTNESS: {brightness}%
              </div>
            </div>
          </div>
        </div>

        {/* Right 1-Column: Diagnostic Radiology Interpretation & Attending Documentation */}
        <div className="glass-panel-1 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#006194]">
                <FileText className="w-4 h-4" />
                <span>OFFICIAL RADIOLOGY PRE-READ</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Diagnostic Impression & Report
              </h2>
            </div>

            {/* Formal Report findings */}
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">PULMONARY VASCULATURE:</span>
                Main pulmonary artery caliber is within normal limits (26 mm). No filling defects identified within main, lobar, or segmental pulmonary arterial branches. Negative for acute pulmonary embolism.
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">CARDIAC & MEDIASTINUM:</span>
                Mild cardiomegaly. Median sternotomy wires intact. Mild bibasilar compressive atelectasis, left greater than right, typical of post-cardiopulmonary bypass. No pericardial effusion.
              </div>
            </div>

            {/* Editable Attending Intensivist Addendum */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Attending Intensivist Clinical Synthesis:
              </label>
              <textarea
                rows={4}
                value={physicianNote}
                onChange={(e) => setPhysicianNote(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] leading-relaxed"
                placeholder="Enter clinical notes..."
              />
            </div>
          </div>

          {/* Save & Sign Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Signed by Dr. Sarah Chen, MD
            </span>
            <button
              onClick={handleSaveNote}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006194] hover:bg-[#004b73] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Attested to EHR' : 'Sign & Transmit Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
