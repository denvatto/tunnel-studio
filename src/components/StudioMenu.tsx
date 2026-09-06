import React, { useState, useRef, useEffect } from 'react';
import { Menu, Minus, Moon, Sun, Download, Check, Share, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTheme } from '../context/ThemeContext';

export const StudioMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { theme, setTheme } = useTheme();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const isDark = theme === 'dark';

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowIOSGuide(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
      setIsOpen(false);
    } else if (isIOS) {
      setShowIOSGuide(true);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Dedicated Menu Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        id="studio-menu-button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer touch-manipulation active:scale-95 border ${
          isOpen
            ? isDark
              ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.45)]'
              : 'bg-amber-500 text-white border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
            : isDark
            ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-700 hover:bg-neutral-800 shadow-sm'
            : 'bg-white border-neutral-300 text-neutral-800 hover:text-neutral-950 hover:border-neutral-400 hover:bg-neutral-50 shadow-sm'
        }`}
        aria-label={isOpen ? 'Close studio menu' : 'Open studio menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <Minus className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <Menu className="w-5 h-5 stroke-[2]" />
        )}
      </button>

      {/* Dimmed backdrop for edge-to-edge overlay */}
      {isOpen && (
        <div
          id="menu-backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Edge-to-Edge Menu Overlay */}
      {isOpen && (
        <div
          ref={panelRef}
          id="studio-menu-edge-to-edge-overlay"
          className={`fixed inset-x-0 top-0 pt-[calc(56px+env(safe-area-inset-top,0px))] z-40 w-full border-b shadow-2xl transition-all duration-200 ease-out animate-in slide-in-from-top-4 ${
            isDark
              ? 'bg-[#0f111a]/98 border-neutral-800 text-neutral-100 shadow-black/80'
              : 'bg-white/98 border-neutral-200 text-neutral-900 shadow-neutral-300/60'
          }`}
        >
          {/* Inner content wrapper with responsive width constraint */}
          <div className="w-full max-w-xl mx-auto px-5 pt-3 pb-5">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-500/20">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest opacity-60">
                Studio Settings
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                {theme.toUpperCase()} MODE
              </span>
            </div>

            {/* Menu Options Grid (Edge-to-edge two-column or stacked) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Color Scheme Switcher */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 opacity-80">
                  Color Scheme
                </label>
                <div
                  className={`grid grid-cols-2 p-1 rounded-xl border ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800/90'
                      : 'bg-neutral-100 border-neutral-200'
                  }`}
                >
                  <button
                    type="button"
                    id="theme-select-dark"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme('dark');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation active:scale-95 ${
                      isDark
                        ? 'bg-amber-400 text-stone-950 shadow-sm ring-1 ring-amber-300/50'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </button>

                  <button
                    type="button"
                    id="theme-select-light"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTheme('light');
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer touch-manipulation active:scale-95 ${
                      !isDark
                        ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400/50'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </button>
                </div>
              </div>

              {/* 2. PWA Application Controls */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 opacity-80">
                  Application
                </label>

                {isInstalled ? (
                  <div
                    id="menu-pwa-installed-badge"
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs h-[42px] ${
                      isDark
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-xs">Installed on Device</span>
                      <span className="text-[10px] opacity-75">Standalone PWA active</span>
                    </div>
                  </div>
                ) : isInstallable ? (
                  <button
                    type="button"
                    id="menu-pwa-install-button"
                    onClick={handleInstallClick}
                    className="w-full h-[42px] flex items-center justify-center gap-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Tunnel Studio</span>
                  </button>
                ) : isIOS ? (
                  <button
                    type="button"
                    id="menu-pwa-ios-button"
                    onClick={handleInstallClick}
                    className={`w-full h-[42px] flex items-center justify-between px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Share className="w-3.5 h-3.5 text-amber-500" />
                      <span>Add to Home Screen</span>
                    </div>
                    <Smartphone className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ) : (
                  <div
                    id="menu-pwa-ready-status"
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs h-[42px] ${
                      isDark
                        ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-xs">PWA Ready</span>
                      <span className="text-[10px] opacity-75">Install via browser options</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div
          id="pwa-ios-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div
            className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? 'bg-[#12141d] border-neutral-800 text-neutral-200'
                : 'bg-white border-neutral-200 text-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <span className="font-bold text-amber-400">TS</span>
              </div>
              <div>
                <h3 className="text-base font-semibold">Install Tunnel Studio</h3>
                <p className="text-xs opacity-60">Add to your iOS Home Screen</p>
              </div>
            </div>

            <ol className="space-y-3 text-xs opacity-90">
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[11px]">
                  1
                </span>
                <span>Tap the <strong>Share</strong> button in Safari toolbar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[11px]">
                  2
                </span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[11px]">
                  3
                </span>
                <span>Launch Tunnel Studio directly like a native app.</span>
              </li>
            </ol>

            <button
              type="button"
              id="pwa-ios-modal-dismiss"
              onClick={() => setShowIOSGuide(false)}
              className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
