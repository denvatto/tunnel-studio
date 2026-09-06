export type WaveformType = 'sine' | 'triangle' | 'square' | 'sawtooth';
export type HarmonicType = 'none' | 'sub' | 'octave' | 'fifth' | 'detune';

export interface CustomInstrument {
  id: string;
  name: string;
  waveform: WaveformType;
  attack: number;           // Seconds (0.005 to 0.8)
  decay: number;            // Seconds (0.1 to 2.5)
  filterCutoff: number;     // Hz (200 to 8000)
  filterResonance: number;  // Q factor (0.5 to 8.0)
  harmonic: HarmonicType;   // None, sub-octave, octave, fifth, detune
  harmonicVolume: number;   // 0.0 to 1.0
  inNav: boolean;           // Pinned to bottom navigation bar
  createdAt: number;
}

export type InstrumentType = string;

export interface TimelineBlock {
  id: string;
  step: number;
  note: string;
  freq: number;
  instrument?: string;
}

export interface InstrumentOption {
  id: string;
  name: string;
  label?: string;
}
