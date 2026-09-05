import React, { useState } from 'react';
import { Volume2, Music2, Disc3 } from 'lucide-react';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { playStudioChime } from './utils/audio';

const NOTES = [
  { note: 'C4', freq: 261.63 },
  { note: 'E4', freq: 329.63 },
  { note: 'G4', freq: 392.00 },
  { note: 'B4', freq: 493.88 },
  { note: 'C5', freq: 523.25 },
];

export default function App() {
  const [noteIndex, setNoteIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);

  const handleTestChime = () => {
    const current = NOTES[noteIndex];
    playStudioChime(current.freq);
    setLastPlayedNote(current.note);
    setIsPulsing(true);
    setNoteIndex((prev) => (prev + 1) % NOTES.length);

    setTimeout(() => {
      setIsPulsing(false);
    }, 550);
  };

  return (
    <div
      id="tunnel-studio-root"
      className="fixed inset-0 h-full h-dvh max-h-dvh w-full overflow-hidden bg-[#090a0f] text-neutral-100 flex flex-col justify-between select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]"
    >
      {/* Subtle atmospheric backdrops */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[90vw] max-w-[540px] h-[50dvh] bg-gradient-to-b from-indigo-950/25 via-amber-950/15 to-transparent rounded-full blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-[60vw] max-w-[360px] h-[40dvh] bg-amber-950/10 rounded-full blur-3xl" />

      {/* Top Header Bar */}
      <header
        id="studio-header"
        className="relative z-10 w-full max-w-xl mx-auto px-5 py-3.5 flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center shadow-inner">
            <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          </div>
          <span className="font-medium tracking-tight text-xs sm:text-sm text-neutral-200">
            Tunnel Studio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </header>

      {/* Center Main Stage (Fits dynamically within viewport) */}
      <main
        id="studio-main"
        className="relative z-10 w-full max-w-sm mx-auto px-6 flex flex-col items-center justify-center text-center flex-1 my-auto"
      >
        {/* Animated Acoustic Tunnel Motif (Scales for small screens) */}
        <div
          id="acoustic-tunnel-visual"
          className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-52 sm:h-52 mb-6 sm:mb-8 flex items-center justify-center cursor-pointer group touch-manipulation flex-shrink-0"
          onClick={handleTestChime}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTestChime();
            }
          }}
          aria-label="Sound check chime"
        >
          {/* Ring 4 (Outer) */}
          <div
            className={`absolute inset-0 rounded-full border border-sky-500/20 transition-all duration-700 ease-out ${
              isPulsing
                ? 'scale-110 border-sky-400/60 shadow-[0_0_24px_rgba(56,189,248,0.25)]'
                : 'scale-100 group-hover:border-sky-500/40'
            }`}
          />

          {/* Ring 3 */}
          <div
            className={`absolute inset-3 xs:inset-4 rounded-full border border-indigo-500/25 transition-all duration-500 ease-out ${
              isPulsing
                ? 'scale-108 border-indigo-400/70 shadow-[0_0_18px_rgba(99,102,241,0.25)]'
                : 'scale-100 group-hover:border-indigo-500/45'
            }`}
          />

          {/* Ring 2 */}
          <div
            className={`absolute inset-6 xs:inset-8 rounded-full border border-purple-500/30 transition-all duration-300 ease-out ${
              isPulsing
                ? 'scale-105 border-purple-400/80 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                : 'scale-100 group-hover:border-purple-500/50'
            }`}
          />

          {/* Ring 1 (Inner) */}
          <div
            className={`absolute inset-9 xs:inset-12 rounded-full border border-amber-500/40 transition-all duration-200 ease-out ${
              isPulsing
                ? 'scale-102 border-amber-400/90 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'scale-100 group-hover:border-amber-500/60'
            }`}
          />

          {/* Center Sound Trigger Core */}
          <div
            className={`relative w-14 h-14 xs:w-16 xs:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex flex-col items-center justify-center shadow-lg transition-transform duration-150 active:scale-90 ${
              isPulsing ? 'scale-90' : 'group-hover:scale-105'
            }`}
          >
            <Volume2 className="w-5 h-5 text-stone-950" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
              {lastPlayedNote || 'Test'}
            </span>
          </div>

          <span className="absolute -bottom-6 text-[10px] font-mono text-neutral-500 group-hover:text-amber-400/80 transition-colors">
            Tap to test tone
          </span>
        </div>

        {/* Title & Identity */}
        <h1
          id="studio-title"
          className="text-3xl xs:text-4xl sm:text-5xl font-light tracking-tight text-white mb-2"
        >
          Tunnel Studio
        </h1>

        <p
          id="studio-tagline"
          className="text-xs xs:text-sm font-medium tracking-widest uppercase text-amber-400/90 mb-3"
        >
          Music Maker
        </p>

        <p
          id="studio-description"
          className="text-xs xs:text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed mb-6"
        >
          A simple, distraction-free environment for mobile music creation.
        </p>

        {/* Simple Interactive Chime Trigger */}
        <button
          id="sound-check-button"
          onClick={handleTestChime}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer touch-manipulation"
        >
          <Music2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Play Tone ({NOTES[noteIndex].note})</span>
        </button>
      </main>

      {/* Bottom Status Bar (Fixed inside viewport) */}
      <footer
        id="studio-footer"
        className="relative z-10 w-full max-w-xl mx-auto px-5 py-3 flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-900/80 flex-shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
          <span>Fullscreen PWA</span>
        </div>
        <div className="font-mono text-[10px] text-neutral-600">
          Ready
        </div>
      </footer>

      {/* Offline Toast */}
      <OfflineIndicator />
    </div>
  );
}
