// Web Audio API Synthesizer for gentle clinical telemetry pulse sound
let audioCtx: AudioContext | null = null;
let isAudioMuted = true;

export function setTelemetryMuted(muted: boolean) {
  isAudioMuted = muted;
  if (!muted && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    } catch {
      // Audio context not supported or restricted
    }
  }
  if (!muted && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function isTelemetryMuted() {
  return isAudioMuted;
}

export function playHeartbeatTone(pitchHz = 880, durationMs = 60) {
  if (isAudioMuted || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitchHz, audioCtx.currentTime);

    // Soft attack, smooth decay
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000);
  } catch {
    // Ignore audio errors
  }
}
