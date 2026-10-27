import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  User, 
  ArrowRight, 
  Wind, 
  Key,
  CheckCircle2,
  HeartPulse,
  Wifi,
  Download
} from 'lucide-react';
import { PatientUser } from '../types/screening';
import { DEMO_PATIENTS, loginPatient, registerPatient } from '../utils/authStorage';

interface PatientLoginPageProps {
  onLoginSuccess: (patient: PatientUser) => void;
}

export const PatientLoginPage: React.FC<PatientLoginPageProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [username, setUsername] = useState('eleanor_vance');
  const [password, setPassword] = useState('password123');

  // Sign Up inputs
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>(45);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Please enter your Patient Username.');
      return;
    }

    const patient = loginPatient(username, password);
    if (patient) {
      onLoginSuccess(patient);
    } else {
      setError(`No patient account found for username "${username}". You can click "Create Account" below or use the quick demo patient buttons.`);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newUsername.trim() || !newName.trim()) {
      setError('Please provide your Username and Full Name.');
      return;
    }

    const patient = registerPatient(
      newUsername,
      newName,
      Number(newAge) || 40,
      newGender,
      newPassword
    );
    onLoginSuccess(patient);
  };

  const handleQuickDemo = (demo: typeof DEMO_PATIENTS[0]) => {
    const patient = loginPatient(demo.username, demo.password);
    if (patient) {
      onLoginSuccess(patient);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#eff6ff] to-[#f0fdfa] flex flex-col justify-between py-8 px-4 sm:px-6 antialiased">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand & Home Health Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#006194] to-[#0d9488] text-white shadow-md shadow-sky-500/20 mb-1">
            <Wind className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#006194] tracking-tight">
            AI-Based Human Disease Screening
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Personal At-Home Volatile Organic Compound (VOC) Breath Biosensor Portal
          </p>
          <div className="pt-1">
            <a
              href="/disease-screening-app.zip"
              download="disease-screening-app.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#006194] border border-sky-200 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project (.ZIP for Localhost)</span>
            </a>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-5">
          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'signin'
                  ? 'bg-white text-[#006194] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'signup'
                  ? 'bg-white text-[#006194] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>New Patient Sign Up</span>
            </button>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Private & Isolated Testing:</strong> Your home breath tests and disease risk results are stored strictly in your private patient account. No other person can see your data.
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {tab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Patient Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. eleanor_vance"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] shadow-2xs text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] shadow-2xs text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#006194] to-[#0d9488] hover:from-[#004b73] hover:to-[#0b7a70] active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Home Screening Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Choose Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. john_doe"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value) || '')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#006194] hover:bg-[#004b73] active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register Patient Account & Start</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Logins for Fast Review */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Or 1-Click Demo Patient Accounts:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DEMO_PATIENTS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemo(demo)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#006194] bg-slate-50/70 hover:bg-white text-left transition-all group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-[#006194]">
                    {demo.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    @{demo.username} · {demo.gender}, {demo.age}y
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Device Status Pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span>Home Biosensor Link: Standby Ready</span>
        </div>
      </div>

      <footer className="text-center text-[11px] text-slate-400 py-2">
        Patient At-Home Breath Biosensing Portal · Private Local Storage
      </footer>
    </div>
  );
};
