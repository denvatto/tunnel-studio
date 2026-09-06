import React from 'react';
import { Sliders, Sparkles, Music, Waves, Radio, Plus } from 'lucide-react';
import { CustomInstrument } from '../types';
import { useTheme } from '../context/ThemeContext';

interface InstrumentNavProps {
  currentInstrumentId: string;
  onSelectInstrument: (instrumentId: string) => void;
  customInstruments: CustomInstrument[];
  onOpenMore: () => void;
}

export const InstrumentNav: React.FC<InstrumentNavProps> = ({
  currentInstrumentId,
  onSelectInstrument,
  customInstruments,
  onOpenMore,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Only display instruments pinned to nav (inNav === true)
  const navCustomInstruments = customInstruments.filter((i) => i.inNav);

  return (
    <nav
      id="studio-instrument-nav"
      aria-label="Instrument Presets"
      className={`relative z-20 w-full border-t flex-shrink-0 transition-colors ${
        isDark
          ? 'bg-[#0b0c13]/95 border-neutral-800/80'
          : 'bg-white/95 border-neutral-200 shadow-sm'
      }`}
    >
      <div className="w-full max-w-xl mx-auto px-4 py-2 flex items-center justify-start gap-2 overflow-x-auto no-scrollbar">
        {/* 1. Default Instrument (Always present) */}
        <button
          id="instrument-select-default"
          type="button"
          onClick={() => onSelectInstrument('default')}
          className={`flex-1 min-w-[70px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
            currentInstrumentId === 'default'
              ? isDark
                ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                : 'bg-amber-500 text-white font-bold shadow-sm ring-1 ring-amber-400'
              : isDark
              ? 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
          aria-label="Select Default instrument"
          aria-current={currentInstrumentId === 'default' ? 'true' : undefined}
        >
          <Waves
            className={`w-4 h-4 transition-transform ${
              currentInstrumentId === 'default' ? 'scale-110' : 'opacity-75'
            }`}
          />
          <span className="text-[11px] tracking-tight whitespace-nowrap mt-0.5 font-medium">
            Default
          </span>
        </button>

        {/* 2. Custom User Instruments added to Nav */}
        {navCustomInstruments.map((inst) => {
          const isSelected = currentInstrumentId === inst.id;
          return (
            <button
              key={inst.id}
              id={`instrument-select-${inst.id}`}
              type="button"
              onClick={() => onSelectInstrument(inst.id)}
              className={`flex-1 min-w-[70px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
                isSelected
                  ? isDark
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-amber-500 text-white font-bold shadow-sm ring-1 ring-amber-400'
                  : isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              aria-label={`Select ${inst.name} instrument`}
              aria-current={isSelected ? 'true' : undefined}
            >
              <Music
                className={`w-4 h-4 transition-transform ${
                  isSelected ? 'scale-110' : 'opacity-75'
                }`}
              />
              <span className="text-[11px] tracking-tight whitespace-nowrap mt-0.5 font-medium max-w-[80px] truncate">
                {inst.name}
              </span>
            </button>
          );
        })}

        {/* 3. "More" Button (Opens Instrument Creator Overlay) */}
        <button
          id="instrument-more-btn"
          type="button"
          onClick={onOpenMore}
          className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border transition-all cursor-pointer touch-manipulation active:scale-95 ${
            isDark
              ? 'border-neutral-800 text-neutral-300 hover:border-amber-400/50 hover:text-amber-400 bg-neutral-900/40'
              : 'border-neutral-200 text-neutral-600 hover:border-amber-400 hover:text-amber-600 bg-neutral-50'
          }`}
          aria-label="Open Instrument Creator Overlay"
          title="Create and Manage Custom Instruments"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">More</span>
        </button>
      </div>
    </nav>
  );
};
