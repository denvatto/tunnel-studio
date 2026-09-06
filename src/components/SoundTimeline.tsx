import React, { useEffect, useRef, useState } from 'react';
import { TimelineBlock, InstrumentType } from '../types';
import { Play, Square, Trash2, SlidersHorizontal } from 'lucide-react';
import { playInstrumentSound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface SoundTimelineProps {
  blocks: TimelineBlock[];
  onClear: () => void;
  onRemoveBlock?: (id: string) => void;
  activeBlockId?: string | null;
  currentInstrument?: InstrumentType;
}

export const SoundTimeline: React.FC<SoundTimelineProps> = ({
  blocks,
  onClear,
  activeBlockId,
  currentInstrument = 'chime',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayheadStep, setCurrentPlayheadStep] = useState<number | null>(null);
  const playIntervalRef = useRef<number | null>(null);

  // Auto scroll to the newest block when added
  useEffect(() => {
    if (trackRef.current && blocks.length > 0) {
      trackRef.current.scrollTo({
        left: trackRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [blocks.length]);

  // Clean up playback interval on unmount or blocks change
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  const handlePlayTimeline = () => {
    if (blocks.length === 0) return;

    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
      setCurrentPlayheadStep(null);
      return;
    }

    setIsPlaying(true);
    let index = 0;

    // Trigger first block immediately
    setCurrentPlayheadStep(blocks[0].step);
    playInstrumentSound(blocks[0].freq, blocks[0].instrument || currentInstrument);

    playIntervalRef.current = window.setInterval(() => {
      index += 1;
      if (index < blocks.length) {
        setCurrentPlayheadStep(blocks[index].step);
        playInstrumentSound(blocks[index].freq, blocks[index].instrument || currentInstrument);
      } else {
        if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        setIsPlaying(false);
        setCurrentPlayheadStep(null);
      }
    }, 320); // 320ms per musical step
  };

  return (
    <section
      id="timeline-canvas-container"
      className="w-full max-w-xl mx-auto px-4 py-2 flex flex-col flex-shrink-0"
      aria-label="Timeline Canvas"
    >
      {/* Timeline Controls Bar */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}
          />
          <span
            className={`font-mono uppercase text-[10px] tracking-wider font-semibold ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}
          >
            Timeline Canvas
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600'
            }`}
          >
            {blocks.length} {blocks.length === 1 ? 'step' : 'steps'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {blocks.length > 0 && (
            <>
              <button
                id="timeline-play-button"
                onClick={handlePlayTimeline}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all active:scale-95 cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : isDark
                    ? 'bg-neutral-900 border border-neutral-800 text-amber-400 hover:border-amber-500/50 hover:bg-neutral-800'
                    : 'bg-neutral-100 border border-neutral-200 text-amber-700 hover:bg-neutral-200/80'
                }`}
                aria-label={isPlaying ? 'Stop playback' : 'Play timeline'}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                id="clear-timeline-canvas-button"
                onClick={() => {
                  if (isPlaying && playIntervalRef.current) {
                    clearInterval(playIntervalRef.current);
                    setIsPlaying(false);
                    setCurrentPlayheadStep(null);
                  }
                  onClear();
                }}
                className={`flex items-center gap-1 text-[10px] font-mono transition-colors px-2 py-1 rounded cursor-pointer ${
                  isDark
                    ? 'text-neutral-500 hover:text-rose-400 hover:bg-neutral-900'
                    : 'text-neutral-400 hover:text-rose-600 hover:bg-neutral-100'
                }`}
                title="Clear canvas"
                aria-label="Clear timeline canvas"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Timeline Canvas Board */}
      <div
        id="timeline-canvas-board"
        ref={trackRef}
        className={`w-full overflow-x-auto overflow-y-hidden rounded-xl p-2.5 no-scrollbar scroll-smooth relative shadow-inner border transition-colors ${
          isDark
            ? 'bg-[#0e1017] border-neutral-800/80 shadow-black/40'
            : 'bg-white border-neutral-200 shadow-neutral-100'
        }`}
      >
        {blocks.length === 0 ? (
          <div
            id="timeline-canvas-empty"
            className="h-16 flex flex-col items-center justify-center text-center text-[11px] font-mono gap-1"
          >
            <div
              className={`flex items-center gap-1.5 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-amber-400' : 'bg-amber-500'
                }`}
              />
              <span>Canvas empty</span>
            </div>
            <span
              className={`text-[10px] ${
                isDark ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
              Trigger sounds above to place note blocks on this timeline
            </span>
          </div>
        ) : (
          <div className="relative flex flex-col min-w-max">
            {/* Timeline Ruler (Steps) */}
            <div
              className={`flex items-center gap-2 mb-1.5 pb-1 border-b ${
                isDark ? 'border-neutral-800/60' : 'border-neutral-200'
              }`}
            >
              {blocks.map((block) => (
                <div
                  key={`ruler-${block.id}`}
                  className={`w-12 text-center text-[9px] font-mono ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  {String(block.step).padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Timeline Sound Blocks Track */}
            <div className="relative flex items-center gap-2 py-1">
              {/* Center lane */}
              <div
                className={`absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 pointer-events-none ${
                  isDark ? 'bg-neutral-800/80' : 'bg-neutral-200'
                }`}
              />

              {blocks.map((block) => {
                const isStepActive =
                  currentPlayheadStep === block.step || activeBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    id={`timeline-block-${block.id}`}
                    className="relative z-10 flex flex-col items-center"
                  >
                    {/* Sound Block on Canvas */}
                    <button
                      onClick={() => {
                        playInstrumentSound(block.freq, block.instrument || currentInstrument);
                        setCurrentPlayheadStep(block.step);
                        setTimeout(() => setCurrentPlayheadStep(null), 400);
                      }}
                      className={`w-12 h-11 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer touch-manipulation relative overflow-hidden ${
                        isStepActive
                          ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-300 text-stone-950 font-bold shadow-[0_0_14px_rgba(245,158,11,0.5)] scale-105'
                          : isDark
                          ? 'bg-neutral-900/95 border-neutral-800 text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-800/90'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-amber-500 hover:bg-amber-50/50 shadow-sm'
                      }`}
                      title={`Audition step ${block.step} (${block.note})`}
                      aria-label={`Step ${block.step} ${block.note}`}
                    >
                      {/* Top active indicator line */}
                      {isStepActive && (
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-white shadow-sm" />
                      )}

                      <span
                        className={`text-xs font-mono font-bold tracking-tight ${
                          isStepActive
                            ? 'text-stone-950'
                            : isDark
                            ? 'text-amber-400'
                            : 'text-amber-700'
                        }`}
                      >
                        {block.note}
                      </span>
                      <span
                        className={`text-[8px] font-mono leading-none mt-0.5 ${
                          isStepActive
                            ? 'text-stone-900 font-semibold'
                            : isDark
                            ? 'text-neutral-500'
                            : 'text-neutral-400'
                        }`}
                      >
                        {Math.round(block.freq)}Hz
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
