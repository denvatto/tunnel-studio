import { CustomInstrument } from '../types';

const STORAGE_KEY = 'tunnel_studio_custom_instruments';

export const DEFAULT_INSTRUMENT: CustomInstrument = {
  id: 'default',
  name: 'Default',
  waveform: 'sine',
  attack: 0.02,
  decay: 0.85,
  filterCutoff: 6500,
  filterResonance: 1.0,
  harmonic: 'none',
  harmonicVolume: 0,
  inNav: true,
  createdAt: 0,
};

/**
 * Loads custom instruments created by the user from localStorage
 */
export function loadCustomInstruments(): CustomInstrument[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Failed to load custom instruments:', err);
    return [];
  }
}

/**
 * Persists the user's custom instruments
 */
export function saveCustomInstruments(instruments: CustomInstrument[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(instruments));
  } catch (err) {
    console.warn('Failed to save custom instruments:', err);
  }
}

/**
 * Finds an instrument by ID from custom list or falls back to default
 */
export function findInstrumentById(
  id: string,
  customList: CustomInstrument[] = []
): CustomInstrument {
  if (id === 'default') return DEFAULT_INSTRUMENT;
  const found = customList.find((inst) => inst.id === id);
  if (found) return found;

  // Fallback for previous legacy preset names
  if (id === 'chime') {
    return {
      id: 'chime',
      name: 'Chime',
      waveform: 'sine',
      attack: 0.02,
      decay: 1.2,
      filterCutoff: 7000,
      filterResonance: 1.2,
      harmonic: 'octave',
      harmonicVolume: 0.35,
      inNav: false,
      createdAt: 0,
    };
  }
  if (id === 'keys') {
    return {
      id: 'keys',
      name: 'Keys',
      waveform: 'sine',
      attack: 0.015,
      decay: 0.9,
      filterCutoff: 3000,
      filterResonance: 1.0,
      harmonic: 'octave',
      harmonicVolume: 0.2,
      inNav: false,
      createdAt: 0,
    };
  }
  if (id === 'synth') {
    return {
      id: 'synth',
      name: 'Synth',
      waveform: 'sawtooth',
      attack: 0.02,
      decay: 0.75,
      filterCutoff: 2400,
      filterResonance: 4.0,
      harmonic: 'detune',
      harmonicVolume: 0.4,
      inNav: false,
      createdAt: 0,
    };
  }
  if (id === 'bass') {
    return {
      id: 'bass',
      name: 'Bass',
      waveform: 'triangle',
      attack: 0.01,
      decay: 0.8,
      filterCutoff: 1200,
      filterResonance: 1.2,
      harmonic: 'sub',
      harmonicVolume: 0.5,
      inNav: false,
      createdAt: 0,
    };
  }

  return DEFAULT_INSTRUMENT;
}
