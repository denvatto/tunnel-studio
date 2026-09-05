import React, { useState } from 'react';
import { Volume2, Disc3 } from 'lucide-react';
import { StudioMenu } from './components/StudioMenu';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SoundTimeline } from './components/SoundTimeline';
import { playStudioChime } from './utils/audio';
import { TimelineBlock } from './types';
import { useTheme } from './context/ThemeContext';

const NOTES = [
  { note: 'C4', freq: 261.63 },
  { note: 'E4', freq: 329.63 },
  { note: 'G4', freq: 392.00 },
  { note: 'B4', freq: 493.88 },
  { note: 'C5', freq: 523.25 },
];

export default function App() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TimelineBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const triggerSound = (noteObj: { note: string; freq: number }) => {
    // 1. Play synthesized studio chime
    playStudioChime(noteObj.freq);
    setLastPlayedNote(noteObj.note);
    setIsPulsing(true);

    // 2. Place note block on timeline canvas at next sequential step
    const nextStep = blocks.length + 1;
    const newBlock: TimelineBlock = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: nextStep,
      note: noteObj.note,
      freq: noteObj.freq,
    };

    setBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(newBlock.id);

    setTimeout(() => {
      setIsPulsing(false);
    }, 450);

    setTimeout(() => {
      setActiveBlockId((current) => (current === newBlock.id ? null : current));
    }, 600);
  };

  const handleTunnelClick = () => {
    const noteObj = NOTES[selectedNoteIndex];
    triggerSound(noteObj);
    // Cycle to next musical note for natural melody composition
    setSelectedNoteIndex((prev) => (prev + 1) % NOTES.length);
  };

  const handleClearTimeline = () => {
    setBlocks([]);
    setActiveBlockId(null);
  };

  return (
    <div
      id="tunnel-studio-root"
      className={`fixed inset-0 h-full h-dvh max-h-dvh w-full overflow-hidden flex flex-col justify-between select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-colors duration-300 ${
        isDark ? 'bg-[#090a0f] text-neutral-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Ambient background atmosphere */}
      {isDark ? (
        <>
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[90vw] max-w-[540px] h-[45dvh] bg-gradient-to-b from-indigo-950/25 via-amber-950/15 to-transparent rounded-full blur-3xl opacity-70" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-[60vw] max-w-[360px] h-[35dvh] bg-amber-950/10 rounded-full blur-3xl" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[90vw] max-w-[540px] h-[45dvh] bg-gradient-to-b from-amber-200/25 via-orange-100/30 to-transparent rounded-full blur-3xl opacity-60" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-[60vw] max-w-[360px] h-[35dvh] bg-amber-100/40 rounded-full blur-3xl" />
        </>
      )}

      {/* Top Header Bar */}
      <header
        id="studio-header"
        className="relative z-10 w-full max-w-xl mx-auto px-5 py-2.5 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-inner border ${
              isDark
                ? 'bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border-amber-500/30'
                : 'bg-gradient-to-br from-amber-400/20 to-orange-400/20 border-amber-400/40'
            }`}
          >
            <Disc3
              className={`w-3.5 h-3.5 animate-spin-slow ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}
            />
          </div>
          <span
            className={`font-medium tracking-tight text-xs sm:text-sm ${
              isDark ? 'text-neutral-200' : 'text-slate-800'
            }`}
          >
            Tunnel Studio
          </span>
        </div>

        {/* Top-Right Menu button with PWA install & color scheme switcher */}
        <StudioMenu />
      </header>

      {/* Center Main Stage */}
      <main
        id="studio-main"
        className="relative z-10 w-full max-w-sm mx-auto px-4 flex flex-col items-center justify-center text-center flex-1 my-auto overflow-hidden py-1"
      >
        {/* Animated Acoustic Tunnel Graphic */}
        <div
          id="acoustic-tunnel-visual"
          className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-48 sm:h-48 mb-4 flex items-center justify-center cursor-pointer group touch-manipulation flex-shrink-0"
          onClick={handleTunnelClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTunnelClick();
            }
          }}
          aria-label="Sound trigger tunnel"
        >
          {/* Ring 4 (Outer) */}
          <div
            className={`absolute inset-0 rounded-full border transition-all duration-700 ease-out ${
              isDark ? 'border-sky-500/20' : 'border-sky-600/25'
            } ${
              isPulsing
                ? 'scale-110 border-sky-400/70 shadow-[0_0_24px_rgba(56,189,248,0.25)]'
                : isDark
                ? 'scale-100 group-hover:border-sky-500/40'
                : 'scale-100 group-hover:border-sky-600/45'
            }`}
          />

          {/* Ring 3 */}
          <div
            className={`absolute inset-3 xs:inset-4 rounded-full border transition-all duration-500 ease-out ${
              isDark ? 'border-indigo-500/25' : 'border-indigo-600/30'
            } ${
              isPulsing
                ? 'scale-108 border-indigo-400/80 shadow-[0_0_18px_rgba(99,102,241,0.25)]'
                : isDark
                ? 'scale-100 group-hover:border-indigo-500/45'
                : 'scale-100 group-hover:border-indigo-600/50'
            }`}
          />

          {/* Ring 2 */}
          <div
            className={`absolute inset-6 xs:inset-8 rounded-full border transition-all duration-300 ease-out ${
              isDark ? 'border-purple-500/30' : 'border-purple-600/35'
            } ${
              isPulsing
                ? 'scale-105 border-purple-400/85 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                : isDark
                ? 'scale-100 group-hover:border-purple-500/50'
                : 'scale-100 group-hover:border-purple-600/55'
            }`}
          />

          {/* Ring 1 (Inner) */}
          <div
            className={`absolute inset-9 xs:inset-12 rounded-full border transition-all duration-200 ease-out ${
              isDark ? 'border-amber-500/40' : 'border-amber-600/45'
            } ${
              isPulsing
                ? 'scale-102 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : isDark
                ? 'scale-100 group-hover:border-amber-500/60'
                : 'scale-100 group-hover:border-amber-600/65'
            }`}
          />

          {/* Center Sound Core */}
          <div
            className={`relative w-12 h-12 xs:w-14 xs:h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex flex-col items-center justify-center shadow-lg transition-transform duration-150 active:scale-90 ${
              isPulsing ? 'scale-90' : 'group-hover:scale-105'
            }`}
          >
            <Volume2 className="w-4 h-4 text-stone-950" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
              {lastPlayedNote || NOTES[selectedNoteIndex].note}
            </span>
          </div>

          <span
            className={`absolute -bottom-5 text-[9px] font-mono transition-colors ${
              isDark
                ? 'text-neutral-500 group-hover:text-amber-400/80'
                : 'text-neutral-400 group-hover:text-amber-600'
            }`}
          >
            Tap to play & place on timeline
          </span>
        </div>

        {/* Minimal Title */}
        <h1
          id="studio-title"
          className={`text-2xl xs:text-3xl font-light tracking-tight mb-1 ${
            isDark ? 'text-white' : 'text-slate-900 font-normal'
          }`}
        >
          Tunnel Studio
        </h1>

        <p
          id="studio-tagline"
          className={`text-[10px] xs:text-xs font-medium tracking-widest uppercase mb-3 ${
            isDark ? 'text-amber-400/90' : 'text-amber-600 font-semibold'
          }`}
        >
          Music Maker
        </p>

        {/* Simple Note Pad Selector */}
        <div
          id="note-pad-row"
          className="flex items-center justify-center gap-1.5 xs:gap-2 mb-2 w-full"
        >
          {NOTES.map((item, idx) => (
            <button
              key={item.note}
              id={`note-trigger-${item.note}`}
              onClick={() => {
                setSelectedNoteIndex(idx);
                triggerSound(item);
              }}
              className={`px-2.5 py-1.5 xs:px-3 xs:py-2 rounded-lg text-xs font-mono transition-all active:scale-90 cursor-pointer touch-manipulation ${
                lastPlayedNote === item.note && isPulsing
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                  : isDark
                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-amber-500/40 hover:text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 shadow-sm hover:border-amber-400 hover:text-amber-600'
              }`}
            >
              {item.note}
            </button>
          ))}
        </div>
      </main>

      {/* Musical Timeline Canvas */}
      <SoundTimeline
        blocks={blocks}
        onClear={handleClearTimeline}
        activeBlockId={activeBlockId}
      />

      {/* Bottom Status Bar */}
      <footer
        id="studio-footer"
        className={`relative z-10 w-full max-w-xl mx-auto px-5 py-2.5 flex items-center justify-between text-[10px] border-t flex-shrink-0 transition-colors ${
          isDark
            ? 'border-neutral-900/80 text-neutral-500'
            : 'border-neutral-200 text-neutral-400'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
          <span>Fullscreen PWA</span>
        </div>
        <div
          className={`font-mono text-[10px] ${
            isDark ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {blocks.length} {blocks.length === 1 ? 'step' : 'steps'} on canvas
        </div>
      </footer>

      {/* Offline Toast */}
      <OfflineIndicator />
    </div>
  );
}
