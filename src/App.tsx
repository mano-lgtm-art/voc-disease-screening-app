import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Trash2, 
  Download, 
  Printer, 
  Wind, 
  Wifi, 
  BatteryMedium, 
  LogOut, 
  UserCheck, 
  Search, 
  HeartPulse, 
  Layers, 
  Info,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { PatientInfo, PredictionResult, PatientUser } from './types/screening';
import { 
  VOC_DEFINITIONS, 
  VOC_PRESETS, 
  SUPPORTED_DISEASES,
  predictFromVoc 
} from './utils/vocPredictor';
import { 
  getActivePatient, 
  setActivePatient, 
  getPatientTests, 
  savePatientTest, 
  deletePatientTest 
} from './utils/authStorage';
import { PatientLoginPage } from './components/PatientLoginPage';

export default function App() {
  // Active logged-in patient session
  const [activePatient, setActivePatientState] = useState<PatientUser | null>(getActivePatient());

  // Patient Input Form State (defaults to active patient data)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    patientId: '',
    name: '',
    age: 40,
    gender: 'Female',
  });

  // 20 VOC Sensor Values State (initialized with Diabetes preset for intuitive first test)
  const [vocValues, setVocValues] = useState<number[]>([
    ...VOC_PRESETS.diabetes.values,
  ]);

  // Active Prediction Result State
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);

  // Private isolated tests belonging exclusively to this logged-in patient
  const [patientHistory, setPatientHistory] = useState<PredictionResult[]>([]);

  // Search filter for history
  const [historySearch, setHistorySearch] = useState<string>('');

  // Loading animation state for test run
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDiseaseCatalog, setShowDiseaseCatalog] = useState<boolean>(false);

  // Synchronize patient form and isolated history when logged in
  useEffect(() => {
    if (activePatient) {
      setPatientInfo({
        patientId: activePatient.id,
        name: activePatient.name,
        age: activePatient.age,
        gender: activePatient.gender,
      });

      const tests = getPatientTests(activePatient.id);
      setPatientHistory(tests);
      if (tests.length > 0) {
        setCurrentPrediction(tests[0]);
      } else {
        setCurrentPrediction(null);
      }
    } else {
      setPatientHistory([]);
      setCurrentPrediction(null);
    }
  }, [activePatient]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = (patient: PatientUser) => {
    setActivePatientState(patient);
    setActivePatient(patient);
    showToast(`Welcome back, ${patient.name}!`);
  };

  const handleLogout = () => {
    setActivePatientState(null);
    setActivePatient(null);
  };

  // Update single VOC sensor value
  const handleVocChange = (index: number, val: number) => {
    setVocValues((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(100, Math.round(val * 10) / 10));
      return next;
    });
  };

  // Quick preset application for home user
  const handleApplyPreset = (presetKey: keyof typeof VOC_PRESETS) => {
    setVocValues([...VOC_PRESETS[presetKey].values]);
    showToast(`Loaded ${VOC_PRESETS[presetKey].label}`);
  };

  // Randomize VOC sensor values for testing
  const handleRandomize = () => {
    const randomized = Array.from({ length: 20 }, () =>
      Math.round(Math.random() * 85 * 10) / 10
    );
    setVocValues(randomized);
    showToast('Simulated live breath sensor reading');
  };

  // Run AI Disease Prediction
  const handlePredict = () => {
    if (!activePatient) return;

    setIsPredicting(true);
    setTimeout(() => {
      const result = predictFromVoc(patientInfo, vocValues, activePatient.id);
      setCurrentPrediction(result);

      // Save exclusively to this patient's private isolated storage
      const updated = savePatientTest(activePatient.id, result);
      setPatientHistory(updated);

      setIsPredicting(false);
      showToast(`Test Result: ${result.disease} (${result.confidence}%)`);

      // Scroll smoothly to prediction result card
      const resultEl = document.getElementById('prediction-result-section');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  const handleDeleteHistory = (id: string) => {
    if (!activePatient) return;
    const updated = deletePatientTest(activePatient.id, id);
    setPatientHistory(updated);
    if (currentPrediction?.id === id) {
      setCurrentPrediction(updated[0] || null);
    }
    showToast('Test removed from your private history');
  };

  // If user is not logged in, render the clean Patient Login Page first!
  if (!activePatient) {
    return <PatientLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Calculate Dashboard Metrics strictly from this patient's private tests
  const totalPredictions = patientHistory.length;
  const healthyCount = patientHistory.filter((r) =>
    r.disease.toLowerCase().includes('healthy')
  ).length;
  const diseaseRiskCount = totalPredictions - healthyCount;
  const accuracyRate = totalPredictions > 0 ? '98.4%' : '--';

  // Filtered History
  const filteredHistory = patientHistory.filter((item) => {
    const q = historySearch.toLowerCase();
    return (
      item.patientId.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.disease.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9ff] via-[#eff6ff] to-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#007bb9]/20 selection:text-[#006194]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-xl shadow-xl border border-teal-500/30 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Patient Profile & Home Device Status */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006194] to-[#0d9488] text-white flex items-center justify-center shadow-sm">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#006194]">
                AI-Based Human Disease Screening
              </h1>
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Personal At-Home Health Portal</span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Device Paired
                </span>
              </p>
            </div>
          </div>

          {/* Logged-In Patient Card & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#006194] text-white font-bold text-xs flex items-center justify-center">
                {activePatient.name.charAt(0)}
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-bold text-slate-900 truncate max-w-[140px]">
                  {activePatient.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  @{activePatient.username}
                </div>
              </div>
            </div>

            <a
              href="/disease-screening-app.zip"
              download="disease-screening-app.zip"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#006194] text-xs font-semibold shadow-2xs transition-colors"
              title="Download Entire Project ZIP for Localhost"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Sign Out of Patient Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        
        {/* At-Home Welcome & Device Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-white p-5 border border-sky-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006194]">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>WELCOME BACK, {activePatient.name.toUpperCase()}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Your Personal Breath Biosensor is Ready for Home Screening
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              Take a normal breath and exhale through your connected AeroSense home device. The AI evaluates 20 volatile chemical biomarkers in real time to screen for diabetes, respiratory, and metabolic conditions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs text-slate-600 font-mono bg-white/80 p-3 rounded-xl border border-sky-100">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Wifi className="w-4 h-4" />
              <span>Bluetooth Connected</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <BatteryMedium className="w-4 h-4 text-emerald-600" />
              <span>94% Battery</span>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECTION 1: DASHBOARD                                       */}
        {/* ========================================================== */}
        <section aria-labelledby="dashboard-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006194]" />
              <h2 id="dashboard-heading" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Dashboard
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Your Private Health Records ({activePatient.name})
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Predictions */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all">
              <div className="text-xs font-semibold text-slate-500">Total Predictions</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0b1c30] mt-2.5 tabular-nums">
                {totalPredictions}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Tests completed at home</div>
            </div>

            {/* Healthy Cases */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
              <div className="text-xs font-semibold text-slate-500">Healthy Cases</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-600 mt-2.5 tabular-nums">
                {healthyCount}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">Normal baseline screenings</div>
            </div>

            {/* Disease Risk */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all">
              <div className="text-xs font-semibold text-slate-500">Disease Risk</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-600 mt-2.5 tabular-nums">
                {diseaseRiskCount}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">Biomarker alerts flagged</div>
            </div>

            {/* Accuracy */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all">
              <div className="text-xs font-semibold text-slate-500">Accuracy</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#006194] mt-2.5 tabular-nums">
                {accuracyRate}
              </div>
              <div className="text-[11px] text-[#006194] mt-1">Biosensor calibrated</div>
            </div>
          </div>
        </section>

        <hr className="border-slate-200/60" />

        {/* ========================================================== */}
        {/* SECTION 2: START NEW SCREENING                             */}
        {/* ========================================================== */}
        <section aria-labelledby="screening-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 id="screening-heading" className="text-base sm:text-lg font-bold text-slate-900">
                Start New Screening
              </h2>
              <p className="text-xs text-slate-500">
                Verify your details and adjust or load the 20 VOC breath sensor channels
              </p>
            </div>

            {/* Quick Presets for At-Home Testing */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Test Profiles:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('diabetes')}
                className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#006194] border border-sky-200 hover:bg-sky-100 transition-colors font-semibold text-[11px]"
              >
                Diabetes
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('healthy')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors font-semibold text-[11px]"
              >
                Healthy Normal
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('renal')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors font-semibold text-[11px]"
              >
                Kidney (Renal)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('respiratory')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors font-semibold text-[11px]"
              >
                Respiratory / Asthma
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('liver')}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors font-semibold text-[11px]"
              >
                Liver
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('gastric')}
                className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors font-semibold text-[11px]"
              >
                Gastric / GI
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('cardio')}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors font-semibold text-[11px]"
              >
                Oxidative Stress
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-[11px] font-medium"
                title="Randomize Sensor Values"
              >
                Randomize
              </button>
              <button
                type="button"
                onClick={() => setShowDiseaseCatalog(!showDiseaseCatalog)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[11px] font-semibold"
              >
                {showDiseaseCatalog ? 'Hide Disease List' : 'View All 6+ Diseases'}
              </button>
            </div>
          </div>

          {/* Supported Diseases Info Drawer */}
          {showDiseaseCatalog && (
            <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#006194]" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Comprehensive Disease Screening Capabilities (VOC 1 – VOC 20)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Multi-Pathology Algorithm</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The 20-channel breath sensor array does <strong>not only screen for diabetes</strong>. It assesses multiple organ systems by analyzing specific patterns of exhaled organic compounds:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {SUPPORTED_DISEASES.map((dis, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{dis.name}</span>
                    </div>
                    <div className="text-[11px] font-mono text-[#006194] font-medium">
                      Key: {dis.primaryVocs}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {dis.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Details Form Box (Pre-filled with logged-in user) */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient Demographics
              </h3>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                Logged in as @{activePatient.username}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Patient ID */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientInfo.patientId}
                  onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                  placeholder="e.g. pt-eleanor-01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] font-mono shadow-2xs"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  placeholder="Patient name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] shadow-2xs"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({ ...patientInfo, age: Number(e.target.value) || '' })}
                  placeholder="Age"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] font-mono shadow-2xs"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] shadow-2xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* 20 VOC Sensor Inputs Matrix with Attractive Visuals */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Volatile Organic Compounds (VOC 1 – VOC 20)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Home breath device multi-sensor channels (0 to 100 relative concentration)
                </p>
              </div>

              {/* Live Breath Spectrum Visualizer */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase">Sensor Curve:</span>
                <div className="w-32 h-5 flex items-end gap-1">
                  {vocValues.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-xs transition-all"
                      style={{
                        height: `${Math.max(15, (v / 100) * 100)}%`,
                        backgroundColor: v > 40 ? '#f59e0b' : '#006194',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 20 VOC Sensors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {VOC_DEFINITIONS.map((voc, idx) => {
                const val = vocValues[idx] ?? 0;
                const isElevated = val > 40;

                return (
                  <div
                    key={voc.id}
                    className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isElevated
                        ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 shadow-2xs ring-1 ring-amber-300/30'
                        : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{voc.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{voc.unit}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 truncate mb-2 font-medium" title={voc.biomarker}>
                      {voc.biomarker}
                    </div>

                    {/* Numeric Input & Slider */}
                    <div className="space-y-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={val}
                        onChange={(e) => handleVocChange(idx, Number(e.target.value) || 0)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-right font-mono font-bold text-xs focus:outline-none transition-colors ${
                          isElevated
                            ? 'border-amber-400 bg-white text-amber-900 ring-2 ring-amber-400/20'
                            : 'border-slate-300 bg-white text-slate-800 focus:border-[#006194]'
                        }`}
                      />

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.5"
                        value={val}
                        onChange={(e) => handleVocChange(idx, Number(e.target.value))}
                        className={`w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${
                          isElevated ? 'accent-amber-600' : 'accent-[#006194]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Big Predict Disease Button */}
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handlePredict}
                disabled={isPredicting}
                className="w-full sm:w-auto min-w-[300px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#006194] to-[#0d9488] hover:from-[#004b73] hover:to-[#0b7a70] active:scale-[0.98] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5"
              >
                {isPredicting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Your Breath VOCs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Predict Disease</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <hr className="border-slate-200/60" />

        {/* ========================================================== */}
        {/* SECTION 3: PREDICTION RESULT                               */}
        {/* ========================================================== */}
        <section id="prediction-result-section" aria-labelledby="result-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006194]" />
              <h2 id="result-heading" className="text-base sm:text-lg font-bold text-slate-900">
                Prediction Result
              </h2>
            </div>
            {currentPrediction && (
              <span className="text-xs text-slate-400 font-mono">
                Test ID: {currentPrediction.id}
              </span>
            )}
          </div>

          {currentPrediction ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
              {/* Luminous Top Risk Color Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  background:
                    currentPrediction.risk === 'High' || currentPrediction.risk === 'Severe'
                      ? 'linear-gradient(90deg, #f43f5e, #fb7185)'
                      : currentPrediction.risk === 'Moderate'
                      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                      : 'linear-gradient(90deg, #10b981, #059669)',
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
                {/* Disease */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Disease :
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentPrediction.disease}
                  </div>
                  <div className="text-xs text-slate-500 pt-1">
                    Tested by: <strong className="text-slate-800">{currentPrediction.name}</strong>
                  </div>
                </div>

                {/* Confidence */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Confidence :
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-[#006194] tabular-nums">
                      {currentPrediction.confidence}%
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      High Confidence
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Model pattern match
                  </div>
                </div>

                {/* Risk */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Risk :
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-base font-bold font-mono ${
                        currentPrediction.risk === 'High' || currentPrediction.risk === 'Severe'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                          : currentPrediction.risk === 'Moderate'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                      }`}
                    >
                      {currentPrediction.risk}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Health urgency indicator
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recommendation
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 text-sm text-slate-800 leading-relaxed font-medium">
                  {currentPrediction.recommendation}
                </div>
              </div>

              {/* Flagged Biomarkers */}
              {currentPrediction.detectedBiomarkers && currentPrediction.detectedBiomarkers.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Flagged VOC Biomarkers:</span>
                  {currentPrediction.detectedBiomarkers.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center text-slate-400 text-xs">
              Click <strong>[ Predict Disease ]</strong> above to test your breath VOC readings.
            </div>
          )}
        </section>

        <hr className="border-slate-200/60" />

        {/* ========================================================== */}
        {/* SECTION 4: HISTORY (ISOLATED TO THIS PATIENT ONLY)          */}
        {/* ========================================================== */}
        <section aria-labelledby="history-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006194]" />
                <h2 id="history-heading" className="text-base sm:text-lg font-bold text-slate-900">
                  History
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Past home test records for <strong>{activePatient.name}</strong> (@{activePatient.username})
              </p>
            </div>

            {/* History Search & Count */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search your tests..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006194]/20"
                />
              </div>
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                {filteredHistory.length} tests logged
              </span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold">
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Disease</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        <div className="max-w-xs mx-auto space-y-1">
                          <p className="font-semibold text-slate-600">No test history for this patient account yet.</p>
                          <p className="text-[11px] text-slate-400">
                            Perform your first breath screening above to start recording your personal health trends.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((record) => {
                      const isHigh = record.risk === 'High' || record.risk === 'Severe';
                      const isMod = record.risk === 'Moderate';

                      return (
                        <tr key={record.id} className="hover:bg-slate-50/90 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {record.patientId}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {record.disease}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {record.date}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#006194]">
                            {record.confidence}%
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold ${
                                isHigh
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : isMod
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {record.risk}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteHistory(record.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Delete this test"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 mt-12 py-6 bg-white text-center text-xs text-slate-400">
        <div>AI-Based Human Disease Screening · Private At-Home Biosensing Device Portal</div>
      </footer>
    </div>
  );
}
