import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Pause, Play, Maximize2, Minimize2, Sliders, Activity } from 'lucide-react';
import { playHeartbeatTone, isTelemetryMuted, setTelemetryMuted } from '../utils/audioTelemetry';
import { VitalsTelemetry } from '../types/clinical';

interface LiveWaveformMonitorProps {
  vitals: VitalsTelemetry;
  patientName: string;
  bed: string;
}

export const LiveWaveformMonitor: React.FC<LiveWaveformMonitorProps> = ({ vitals, patientName, bed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [sweepSpeed, setSweepSpeed] = useState<25 | 50>(25);
  const [selectedLead, setSelectedLead] = useState<'II' | 'V1' | 'V5' | 'aVR'>('II');
  const [muted, setMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation and state refs to avoid tearing
  const animFrameIdRef = useRef<number | null>(null);
  const cursorXRef = useRef<number>(0);
  const ecgPhaseRef = useRef<number>(0);
  const respPhaseRef = useRef<number>(0);
  const lastSoundBeatRef = useRef<number>(0);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setTelemetryMuted(nextMuted);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const resizeObserver = new ResizeObserver(() => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      width = canvas.width;
      height = canvas.height;
      ctx.scale(dpr, dpr);
    });

    resizeObserver.observe(canvas);

    // ECG wave math: returns y displacement from baseline (-1 to +1)
    const getEcgDisplacement = (phase: number) => {
      // P wave around 0.15 - 0.25
      // QRS around 0.38 - 0.45 (sharp down, high peak, sharp dip)
      // T wave around 0.55 - 0.75
      const p = phase % 1.0;
      if (p > 0.12 && p < 0.22) {
        // P wave
        return Math.sin((p - 0.12) / 0.10 * Math.PI) * 0.15;
      }
      if (p >= 0.37 && p < 0.39) {
        // Q dip
        return -0.15;
      }
      if (p >= 0.39 && p < 0.43) {
        // R peak
        return 0.95;
      }
      if (p >= 0.43 && p < 0.46) {
        // S dip
        return -0.35;
      }
      if (p >= 0.55 && p < 0.72) {
        // T wave
        return Math.sin((p - 0.55) / 0.17 * Math.PI) * 0.25;
      }
      return 0.02 * (Math.sin(p * 20)); // tiny baseline noise
    };

    // SpO2 Plethysmograph waveform: systolic upstroke, dicrotic notch, diastolic runoff
    const getPlethDisplacement = (phase: number) => {
      const p = (phase + 0.18) % 1.0; // slight transit delay behind ECG
      if (p < 0.25) {
        // rapid systolic rise
        return Math.sin((p / 0.25) * (Math.PI / 2));
      }
      if (p < 0.42) {
        // initial descent to dicrotic notch
        return 1 - (p - 0.25) * 2.2;
      }
      if (p < 0.50) {
        // dicrotic wave rebound
        return 0.63 + Math.sin(((p - 0.42) / 0.08) * Math.PI) * 0.08;
      }
      // diastolic run-off
      return 0.63 * Math.exp(-(p - 0.50) * 3.5);
    };

    // ArtBP Waveform (similar to pleth but higher pressure curve)
    const getArtBpDisplacement = (phase: number) => {
      const p = (phase + 0.14) % 1.0;
      if (p < 0.20) {
        return Math.sin((p / 0.20) * (Math.PI / 2));
      }
      if (p < 0.38) {
        return 1 - (p - 0.20) * 2.5;
      }
      if (p < 0.46) {
        return 0.55 + Math.sin(((p - 0.38) / 0.08) * Math.PI) * 0.09;
      }
      return 0.55 * Math.exp(-(p - 0.46) * 3.2);
    };

    // Capnography (EtCO2): alveolar plateau square wave
    const getEtco2Displacement = (phase: number) => {
      const p = phase % 1.0;
      if (p < 0.35) {
        // Inhalation (baseline near 0)
        return 0.04;
      }
      if (p < 0.42) {
        // Exhalation upstroke
        return (p - 0.35) / 0.07;
      }
      if (p < 0.85) {
        // Alveolar plateau with slight upward tilt
        return 0.85 + (p - 0.42) * 0.25;
      }
      // Rapid inspiration washout
      return Math.max(0.04, 1.0 - (p - 0.85) / 0.10);
    };

    // Render loop
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      const rect = canvas.getBoundingClientRect();
      const cssWidth = rect.width;
      const cssHeight = rect.height;

      if (!isFrozen) {
        // Pixels advanced per frame based on sweep speed
        // 25mm/s corresponds to approx 100px/s on standard screens
        const speedMultiplier = sweepSpeed === 50 ? 2 : 1;
        const stepPixels = Math.max(1.2, dt * 110 * speedMultiplier);

        const currentX = cursorXRef.current;
        const nextX = (currentX + stepPixels) % cssWidth;

        // Erase beam zone ahead of cursor (erases 14px ahead for clean phosphor sweep)
        const eraseWidth = 18;
        ctx.fillStyle = '#06111f';
        ctx.fillRect(currentX, 0, eraseWidth, cssHeight);

        // Draw faint medical grid in erased bar
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = 0; y < cssHeight; y += 20) {
          ctx.moveTo(currentX, y);
          ctx.lineTo(currentX + eraseWidth, y);
        }
        ctx.stroke();

        // Calculate phases
        const hr = vitals.heartRate || 75;
        const cardiacCycleFreq = hr / 60; // Hz
        const prevEcgPhase = ecgPhaseRef.current;
        const nextEcgPhase = prevEcgPhase + dt * cardiacCycleFreq;
        ecgPhaseRef.current = nextEcgPhase;

        // Check if R-wave happened for audio beep
        const prevCycleIndex = Math.floor(prevEcgPhase - 0.40);
        const nextCycleIndex = Math.floor(nextEcgPhase - 0.40);
        if (nextCycleIndex > prevCycleIndex && now - lastSoundBeatRef.current > 400) {
          lastSoundBeatRef.current = now;
          playHeartbeatTone(880 + (vitals.spo2 - 95) * 15, 65);
        }

        const rr = vitals.respRate || 18;
        const respCycleFreq = rr / 60; // Hz
        respPhaseRef.current = respPhaseRef.current + dt * respCycleFreq;

        // Partition screen into 4 distinct vertical channels:
        // Ch1: ECG (0% to 32% height)
        // Ch2: Pleth (33% to 56% height)
        // Ch3: ArtBP (57% to 78% height)
        // Ch4: EtCO2 (79% to 100% height)

        const h1 = cssHeight * 0.32;
        const h2 = cssHeight * 0.23;
        const h3 = cssHeight * 0.22;
        const h4 = cssHeight * 0.23;

        const base1 = h1 * 0.58;
        const base2 = cssHeight * 0.33 + h2 * 0.85;
        const base3 = cssHeight * 0.56 + h3 * 0.82;
        const base4 = cssHeight * 0.78 + h4 * 0.85;

        // Channel 1: ECG Waveform
        const yEcgPrev = base1 - getEcgDisplacement(prevEcgPhase) * (h1 * 0.48);
        const yEcgNext = base1 - getEcgDisplacement(nextEcgPhase) * (h1 * 0.48);

        ctx.strokeStyle = '#00f0b5'; // Phosphor Green-Teal
        ctx.lineWidth = 2.0;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(currentX, yEcgPrev);
        ctx.lineTo(nextX < currentX ? cssWidth : nextX, yEcgNext);
        ctx.stroke();

        // Channel 2: SpO2 Pleth
        const yPlethPrev = base2 - getPlethDisplacement(prevEcgPhase) * (h2 * 0.72);
        const yPlethNext = base2 - getPlethDisplacement(nextEcgPhase) * (h2 * 0.72);

        ctx.strokeStyle = '#00c6ff'; // Azure Cyan
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(currentX, yPlethPrev);
        ctx.lineTo(nextX < currentX ? cssWidth : nextX, yPlethNext);
        ctx.stroke();

        // Channel 3: ArtBP
        const yArtPrev = base3 - getArtBpDisplacement(prevEcgPhase) * (h3 * 0.70);
        const yArtNext = base3 - getArtBpDisplacement(nextEcgPhase) * (h3 * 0.70);

        ctx.strokeStyle = '#ff5b79'; // High-vis Coral Red
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(currentX, yArtPrev);
        ctx.lineTo(nextX < currentX ? cssWidth : nextX, yArtNext);
        ctx.stroke();

        // Channel 4: Capnography EtCO2
        const yRespPrev = base4 - getEtco2Displacement(respPhaseRef.current - dt * respCycleFreq) * (h4 * 0.70);
        const yRespNext = base4 - getEtco2Displacement(respPhaseRef.current) * (h4 * 0.70);

        ctx.strokeStyle = '#facc15'; // Amber Yellow
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(currentX, yRespPrev);
        ctx.lineTo(nextX < currentX ? cssWidth : nextX, yRespNext);
        ctx.stroke();

        // Advance cursor position
        cursorXRef.current = nextX;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    // Initial background wipe
    ctx.fillStyle = '#06111f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [sweepSpeed, isFrozen, vitals, selectedLead, muted]);

  return (
    <div className={`relative flex flex-col rounded-xl overflow-hidden border border-slate-700/60 shadow-lg bg-[#06111f] transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50' : 'w-full'}`}>
      {/* Top Telemetry Header Ribbon */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a192f] border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-live" />
            <span className="font-semibold text-white tracking-wide">{bed}</span>
            <span className="text-slate-400">·</span>
            <span className="font-medium text-slate-200">{patientName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 text-[11px] text-cyan-300 font-mono">
            <span>LEAD {selectedLead}</span>
            <span className="text-slate-500">·</span>
            <span>1 mV = 10mm</span>
          </div>

          {isFrozen && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-wider">
              FREEZE BUFFER
            </span>
          )}
        </div>

        {/* Telemetry Action Affordances */}
        <div className="flex items-center gap-2">
          {/* Lead Selector */}
          <div className="hidden md:flex items-center gap-1 p-0.5 bg-slate-900 rounded border border-slate-800">
            {(['II', 'V1', 'V5', 'aVR'] as const).map((lead) => (
              <button
                key={lead}
                onClick={() => setSelectedLead(lead)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                  selectedLead === lead ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lead}
              </button>
            ))}
          </div>

          {/* Sweep Speed Selector */}
          <button
            onClick={() => setSweepSpeed(sweepSpeed === 25 ? 50 : 25)}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono flex items-center gap-1"
            title="Toggle Sweep Speed"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>{sweepSpeed} mm/s</span>
          </button>

          {/* Audio Chime Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded transition-colors ${
              muted ? 'text-slate-400 hover:text-slate-200 bg-slate-800' : 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
            }`}
            title={muted ? 'Enable Cardiac Tone' : 'Mute Cardiac Tone'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Freeze Frame Button */}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`p-1.5 rounded transition-colors ${
              isFrozen ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isFrozen ? 'Resume Live Telemetry' : 'Freeze Waveform'}
          >
            {isFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Maximize */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isExpanded ? 'Minimize' : 'Full Screen Monitor'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas & Lateral Channel Indicators Layout */}
      <div className="relative flex-1 min-h-[360px] md:min-h-[420px] bg-[#06111f] ecg-dark-grid-bg">
        {/* Dynamic Channel Labels & High-Acuity Metrics Overlay on Right */}
        <div className="absolute right-0 top-0 bottom-0 w-36 sm:w-44 bg-[#081527]/85 backdrop-blur-sm border-l border-slate-800/80 p-3 flex flex-col justify-between pointer-events-none select-none z-10">
          {/* ECG Lead II Metric */}
          <div className="border-b border-slate-800/70 pb-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              <span>ECG II</span>
              <span className="text-[10px] text-slate-400 font-mono">BPM</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {vitals.heartRate}
              </span>
              <span className="text-[10px] text-emerald-500/80">LIVE</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{vitals.rhythm}</div>
          </div>

          {/* SpO2 Pleth Metric */}
          <div className="border-b border-slate-800/70 py-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              <span>SpO₂</span>
              <span className="text-[10px] text-slate-400 font-mono">%</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                {vitals.spo2}
              </span>
              <span className="text-[10px] text-cyan-300/80 font-mono">PI: {vitals.perfusionIndex}%</span>
            </div>
            <div className="text-[10px] text-slate-400">Plethysmograph</div>
          </div>

          {/* ArtBP Metric */}
          <div className="border-b border-slate-800/70 py-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
              <span>ART BP</span>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                {vitals.bloodPressureSys}/{vitals.bloodPressureDia}
              </span>
              <span className="text-xs font-mono text-rose-300 font-semibold">({vitals.meanArterialPressure})</span>
            </div>
            <div className="text-[10px] text-slate-400">MAP Target &gt; 65</div>
          </div>

          {/* EtCO2 Metric */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              <span>EtCO₂ / RESP</span>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                {vitals.etco2}
              </span>
              <span className="text-xs font-mono text-amber-300">RR: {vitals.respRate}</span>
            </div>
            <div className="text-[10px] text-slate-400">Capnography</div>
          </div>
        </div>

        {/* Channel Labels on Left */}
        <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between pointer-events-none select-none text-[10px] font-mono z-10">
          <div className="text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/20">
            II · 1mV · 25mm/s
          </div>
          <div className="text-cyan-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/20">
            PLETH · GAIN 1.0
          </div>
          <div className="text-rose-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-rose-500/20">
            ART · 0 - 200 mmHg
          </div>
          <div className="text-amber-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-amber-500/20">
            EtCO₂ · 0 - 50 mmHg
          </div>
        </div>

        {/* The Live HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Bottom Micro Status Bar */}
      <div className="px-4 py-1.5 bg-[#071322] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span>Telemetry Station: <strong>METRO-ICU-CENTRAL</strong></span>
          <span className="text-slate-600">|</span>
          <span>Sample Rate: <strong className="text-slate-300">500 Hz Continuous</strong></span>
          <span className="text-slate-600">|</span>
          <span>Filter: <strong className="text-slate-300">0.5 - 40 Hz Diagnostic</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Synchronized (0 packet loss)</span>
        </div>
      </div>
    </div>
  );
};
