/**
 * Procedural Tactical Sound Effects Engine (Web Audio API)
 * 100% Offline, synthesized in-memory without external audio assets.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('ai_logix_sound_enabled') !== 'false';
};

export const setSoundEnabled = (enabled) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ai_logix_sound_enabled', enabled ? 'true' : 'false');
  }
};

/**
 * Tactical Crisis Alert (Emergency Mode Activation)
 * Two-tone alert beep: 780 Hz -> 600 Hz
 */
export const playCrisisAlert = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.setValueAtTime(600, now + 0.15);
    osc.frequency.setValueAtTime(780, now + 0.3);
    osc.frequency.setValueAtTime(600, now + 0.45);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    console.debug('Audio playback blocked or unavailable', e);
  }
};

/**
 * Drone Sortie / Dispatch Launch Confirmation Chirp
 * Ascending frequency sweep (440 -> 880 -> 1320 Hz)
 */
export const playDispatchChirp = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.debug('Audio dispatch chirp skipped', e);
  }
};

/**
 * Route Optimized / Success Chime
 */
export const playSuccessChime = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  } catch (e) {
    console.debug('Audio success chime skipped', e);
  }
};
