import React, { useState } from 'react';
import {
  X,
  Plus,
  Volume2,
  Trash2,
  Sliders,
  Check,
  Music,
  Waves,
  Activity,
  Sparkles,
} from 'lucide-react';
import { CustomInstrument, WaveformType, HarmonicType } from '../types';
import { playInstrumentSound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface InstrumentCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInstruments: CustomInstrument[];
  onSaveInstrument: (instrument: CustomInstrument) => void;
  onToggleNav: (id: string, inNav: boolean) => void;
  onDeleteInstrument: (id: string) => void;
  onSelectInstrument: (id: string) => void;
  currentInstrumentId: string;
}

const WAVEFORM_OPTIONS: { type: WaveformType; label: string; desc: string }[] = [
  { type: 'sine', label: 'Sine', desc: 'Pure, smooth, gentle' },
  { type: 'triangle', label: 'Triangle', desc: 'Warm, mellow body' },
  { type: 'square', label: 'Square', desc: 'Hollow, buzzy, 8-bit' },
  { type: 'sawtooth', label: 'Sawtooth', desc: 'Bright, sharp, analog' },
];

const HARMONIC_OPTIONS: { type: HarmonicType; label: string; desc: string }[] = [
  { type: 'none', label: 'None', desc: 'Pure single oscillator' },
  { type: 'sub', label: 'Sub (-1 Octave)', desc: 'Heavy sub-bass body' },
  { type: 'octave', label: 'Octave (+1)', desc: 'Bright bell shimmer' },
  { type: 'fifth', label: 'Fifth (+7 Semitones)', desc: 'Chordal overtone' },
  { type: 'detune', label: 'Detune Chorus', desc: 'Thick analog beating' },
];

export const InstrumentCreatorModal: React.FC<InstrumentCreatorModalProps> = ({
  isOpen,
  onClose,
  customInstruments,
  onSaveInstrument,
  onToggleNav,
  onDeleteInstrument,
  onSelectInstrument,
  currentInstrumentId,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isCreating, setIsCreating] = useState(false);

  // Form states for primitive attributes
  const [name, setName] = useState('');
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [attack, setAttack] = useState<number>(0.02);
  const [decay, setDecay] = useState<number>(0.85);
  const [filterCutoff, setFilterCutoff] = useState<number>(5000);
  const [filterResonance, setFilterResonance] = useState<number>(1.2);
  const [harmonic, setHarmonic] = useState<HarmonicType>('none');
  const [harmonicVolume, setHarmonicVolume] = useState<number>(0.35);
  const [addToNav, setAddToNav] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentDraft: CustomInstrument = {
    id: 'draft',
    name: name.trim() || 'Custom Instrument',
    waveform,
    attack,
    decay,
    filterCutoff,
    filterResonance,
    harmonic,
    harmonicVolume,
    inNav: addToNav,
    createdAt: Date.now(),
  };

  const handleTestDraftSound = () => {
    playInstrumentSound(440, currentDraft);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `Custom ${waveform.toUpperCase()}`;
    const newInst: CustomInstrument = {
      ...currentDraft,
      id: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: finalName,
      inNav: addToNav,
    };

    onSaveInstrument(newInst);
    setIsCreating(false);
    // Reset form
    setName('');
    setWaveform('sine');
    setAttack(0.02);
    setDecay(0.85);
    setFilterCutoff(5000);
    setFilterResonance(1.2);
    setHarmonic('none');
    setHarmonicVolume(0.35);
  };

  return (
    <div
      id="instrument-creator-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="instrument-creator-sheet"
        className={`w-full max-w-xl rounded-t-2xl sm:rounded-2xl border max-h-[90vh] flex flex-col shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#10121d] border-neutral-800 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-500/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm tracking-tight">Instrument Studio</h2>
              <p className="text-[11px] text-neutral-400">
                Design custom instruments from Web Audio primitives
              </p>
            </div>
          </div>
          <button
            id="close-instrument-creator-btn"
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: User's Instrument List */}
          <section id="user-instruments-list-section">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Your Instruments
                </span>
                <span
                  className={`text-[11px] px-2 py-0.2 rounded-full font-mono ${
                    isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {customInstruments.length}
                </span>
              </div>

              {!isCreating && (
                <button
                  id="open-create-instrument-btn"
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {customInstruments.length === 0 ? (
              <div
                id="empty-instruments-prompt"
                className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 ${
                  isDark
                    ? 'bg-neutral-900/40 border-neutral-800/80 text-neutral-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">No custom instruments yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-0.5">
                    Web Audio provides raw primitives (waves, envelopes, and filters).
                    Build and name your own recipe to add to the navigation bar!
                  </p>
                </div>
                {!isCreating && (
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="mt-1 flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Instrument</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {customInstruments.map((inst) => {
                  const isSelected = currentInstrumentId === inst.id;
                  return (
                    <div
                      key={inst.id}
                      id={`user-instrument-item-${inst.id}`}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-950/20 border-amber-500/80 ring-1 ring-amber-500/50'
                            : 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400'
                          : isDark
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                      }`}
                    >
                      {/* Instrument Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectInstrument(inst.id)}
                          className="text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs truncate group-hover:text-amber-500 transition-colors">
                              {inst.name}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
                                isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {inst.waveform}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate mt-0.5 font-mono">
                            {inst.filterCutoff}Hz • {Math.round(inst.attack * 1000)}ms atk •{' '}
                            {inst.decay}s dec
                          </div>
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Audition Note */}
                        <button
                          type="button"
                          onClick={() => playInstrumentSound(440, inst)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-700'
                              : 'bg-neutral-100 text-neutral-700 hover:text-amber-600 hover:bg-neutral-200'
                          }`}
                          title="Audition Tone"
                          aria-label={`Audition ${inst.name}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Pin / Show in Nav Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleNav(inst.id, !inst.inNav)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                            inst.inNav
                              ? isDark
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isDark
                              ? 'text-neutral-400 hover:bg-neutral-800'
                              : 'text-neutral-500 hover:bg-neutral-100'
                          }`}
                          title={inst.inNav ? 'Visible in bottom nav' : 'Hidden from bottom nav'}
                        >
                          {inst.inNav ? 'In Nav' : '+ Nav'}
                        </button>

                        {/* Delete Instrument */}
                        <button
                          type="button"
                          onClick={() => onDeleteInstrument(inst.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer text-neutral-400 hover:text-rose-500 ${
                            isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                          }`}
                          title="Delete Instrument"
                          aria-label={`Delete ${inst.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 2: Creator Form (Expands right below the list) */}
          {isCreating && (
            <form
              id="instrument-creator-form"
              onSubmit={handleSave}
              className={`p-4 sm:p-5 rounded-2xl border space-y-4 animate-in slide-in-from-top-2 duration-200 ${
                isDark
                  ? 'bg-neutral-900/70 border-amber-500/30'
                  : 'bg-neutral-50/80 border-amber-400/50 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-xs tracking-tight">
                    Configure Web Audio Primitives
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* 1. Name */}
              <div>
                <label
                  htmlFor="instrument-name-input"
                  className="block text-xs font-medium mb-1.5 text-neutral-300"
                >
                  Instrument Name
                </label>
                <input
                  id="instrument-name-input"
                  type="text"
                  required
                  placeholder="e.g., Celestial Bells, Acid Lead, Sub Bass..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 focus:border-amber-400 text-white'
                      : 'bg-white border-neutral-300 focus:border-amber-500 text-neutral-900'
                  }`}
                />
              </div>

              {/* 2. Waveform Primitive */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    1. Oscillator Wave Shape (`OscillatorNode.type`)
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WAVEFORM_OPTIONS.map((opt) => {
                    const isSelected = waveform === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          setWaveform(opt.type);
                          playInstrumentSound(440, { ...currentDraft, waveform: opt.type });
                        }}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                              : 'bg-amber-500 text-white font-bold border-amber-600 shadow-sm'
                            : isDark
                            ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="text-xs font-semibold capitalize">{opt.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 leading-tight ${
                            isSelected
                              ? isDark
                                ? 'text-stone-800'
                                : 'text-amber-100'
                              : 'text-neutral-400'
                          }`}
                        >
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Attack & Decay Envelopes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">2. Attack Envelope</span>
                    <span className="font-mono text-amber-500">
                      {Math.round(attack * 1000)}ms
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.005"
                    max="0.5"
                    step="0.005"
                    value={attack}
                    onChange={(e) => setAttack(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                    <span>Percussive (5ms)</span>
                    <span>Swell (500ms)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">3. Decay Tail</span>
                    <span className="font-mono text-amber-500">{decay.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.05"
                    value={decay}
                    onChange={(e) => setDecay(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                    <span>Pluck (0.1s)</span>
                    <span>Ringing (2.5s)</span>
                  </div>
                </div>
              </div>

              {/* 4. Filter Cutoff & Resonance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">4. Lowpass Filter Cutoff</span>
                    <span className="font-mono text-amber-500">{filterCutoff}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="8000"
                    step="50"
                    value={filterCutoff}
                    onChange={(e) => setFilterCutoff(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                    <span>Warm / Muffled</span>
                    <span>Crisp / Open</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">5. Filter Resonance (Q)</span>
                    <span className="font-mono text-amber-500">{filterResonance.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="7.0"
                    step="0.1"
                    value={filterResonance}
                    onChange={(e) => setFilterResonance(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                    <span>Gentle (0.5)</span>
                    <span>Sharp Peak (7.0)</span>
                  </div>
                </div>
              </div>

              {/* 5. Harmonic Layer Primitive */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-neutral-300">
                  6. Harmonic Layer (Second Oscillator Primitive)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {HARMONIC_OPTIONS.map((h) => {
                    const isHarmSelected = harmonic === h.type;
                    return (
                      <button
                        key={h.type}
                        type="button"
                        onClick={() => {
                          setHarmonic(h.type);
                          playInstrumentSound(440, { ...currentDraft, harmonic: h.type });
                        }}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                          isHarmSelected
                            ? isDark
                              ? 'bg-amber-400 text-stone-950 font-bold border-amber-300'
                              : 'bg-amber-500 text-white font-bold border-amber-600'
                            : isDark
                            ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{h.label}</div>
                      </button>
                    );
                  })}
                </div>

                {harmonic !== 'none' && (
                  <div className="mt-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">Harmonic Layer Volume</span>
                      <span className="font-mono text-amber-500">
                        {Math.round(harmonicVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={harmonicVolume}
                      onChange={(e) => setHarmonicVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Add to Navigation Bar Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addToNav}
                    onChange={(e) => setAddToNav(e.target.checked)}
                    className="rounded accent-amber-500 cursor-pointer"
                  />
                  <span>Add this instrument to the bottom navigation bar</span>
                </label>
              </div>

              {/* Action Buttons: Preview & Save */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleTestDraftSound}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs border transition-colors cursor-pointer active:scale-95 ${
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Test Primitives Sound</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Add to Nav</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
