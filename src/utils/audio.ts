/**
 * Lightweight Web Audio utility for Tunnel Studio sound test.
 * Pure sine chime with warm harmonic decay.
 */
let audioCtx: AudioContext | null = null;

export function playStudioChime(frequency: number = 440) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // Fundamental oscillator
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Warm harmonic overtone
    const oscHarmonic = audioCtx.createOscillator();
    const gainHarmonic = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(frequency * 2, now);

    // Envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    gainHarmonic.gain.setValueAtTime(0.001, now);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.09, now + 0.03);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    oscHarmonic.connect(gainHarmonic);
    gain.connect(audioCtx.destination);
    gainHarmonic.connect(audioCtx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 1.25);
    oscHarmonic.stop(now + 0.85);

    return true;
  } catch (err) {
    console.warn('Audio play error:', err);
    return false;
  }
}
