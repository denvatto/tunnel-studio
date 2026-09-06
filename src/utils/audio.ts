import { CustomInstrument } from '../types';
import { DEFAULT_INSTRUMENT, findInstrumentById, loadCustomInstruments } from './instrumentStorage';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes an instrument note based on Web Audio API primitives:
 * - OscillatorNode (waveform: sine, triangle, square, sawtooth)
 * - GainNode (ADSR attack and decay envelope)
 * - BiquadFilterNode (lowpass cutoff & resonance Q)
 * - Secondary Harmonic Layer (sub-octave, octave, fifth, or chorus detuning)
 */
export function playInstrumentSound(
  frequency: number = 440,
  instrumentOrId: string | CustomInstrument = 'default',
  customList?: CustomInstrument[]
): boolean {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    let inst: CustomInstrument = DEFAULT_INSTRUMENT;

    if (typeof instrumentOrId === 'object' && instrumentOrId !== null) {
      inst = instrumentOrId;
    } else if (typeof instrumentOrId === 'string') {
      const list = customList || loadCustomInstruments();
      inst = findInstrumentById(instrumentOrId, list);
    }

    // 1. Primary Oscillator Primitive
    const osc1 = ctx.createOscillator();
    osc1.type = inst.waveform;
    osc1.frequency.setValueAtTime(frequency, now);

    // 2. Filter Primitive (BiquadFilterNode lowpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.max(100, Math.min(18000, inst.filterCutoff || 6000));
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(Math.max(0.1, Math.min(20, inst.filterResonance || 1.0)), now);

    // 3. Amplitude Envelope Primitive (GainNode)
    const voiceGain = ctx.createGain();
    const peakGain = 0.32;
    const attack = Math.max(0.005, inst.attack || 0.02);
    const decay = Math.max(0.05, inst.decay || 0.8);

    voiceGain.gain.setValueAtTime(0.0001, now);
    voiceGain.gain.exponentialRampToValueAtTime(peakGain, now + attack);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

    osc1.connect(filter);

    // 4. Secondary Harmonic Oscillator Layer (if configured)
    let osc2: OscillatorNode | null = null;
    let harmGain: GainNode | null = null;

    if (inst.harmonic && inst.harmonic !== 'none' && (inst.harmonicVolume || 0) > 0) {
      osc2 = ctx.createOscillator();
      harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime((inst.harmonicVolume || 0.3) * 0.26, now);

      if (inst.harmonic === 'sub') {
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency / 2, now);
      } else if (inst.harmonic === 'octave') {
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(frequency * 2, now);
      } else if (inst.harmonic === 'fifth') {
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(frequency * 1.5, now);
      } else if (inst.harmonic === 'detune') {
        osc2.type = inst.waveform;
        osc2.frequency.setValueAtTime(frequency, now);
        osc2.detune.setValueAtTime(10, now); // 10 cents detune for chorus
      }

      osc2.connect(harmGain);
      harmGain.connect(filter);
    }

    filter.connect(voiceGain);
    voiceGain.connect(ctx.destination);

    const totalDuration = attack + decay + 0.05;
    osc1.start(now);
    osc1.stop(now + totalDuration);

    if (osc2) {
      osc2.start(now);
      osc2.stop(now + totalDuration);
    }

    return true;
  } catch (err) {
    console.warn('Audio synthesis error:', err);
    return false;
  }
}

export function playStudioChime(frequency: number = 440) {
  return playInstrumentSound(frequency, 'default');
}
