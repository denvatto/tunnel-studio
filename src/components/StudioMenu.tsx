import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Moon, Sun, Download, Check, Share, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTheme } from '../context/ThemeContext';

export const StudioMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { theme, setTheme } = useTheme();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowIOSGuide(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const isDark = theme === 'dark';

  return (
    <div className="relative">
      {/* Menu Trigger Button in Header */}
      <button
        ref={buttonRef}
        id="studio-menu-button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer touch-manipulation active:scale-95 border ${
          isDark
            ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800'
            : 'bg-white border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 shadow-sm'
        } ${isOpen ? (isDark ? 'border-amber-500/50 text-amber-400' : 'border-amber-500 text-amber-600') : ''}`}
        aria-label="Open studio menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Menu Dropdown Card */}
      {isOpen && (
        <div
          ref={menuRef}
          id="studio-menu-dropdown"
          className={`absolute right-0 mt-2 w-64 rounded-2xl p-4 shadow-2xl z-50 border backdrop-blur-md transition-all animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? 'bg-[#12141d]/95 border-neutral-800 text-neutral-200 shadow-black/60'
              : 'bg-white/95 border-neutral-200 text-neutral-800 shadow-neutral-300/50'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/20 mb-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono opacity-60">
              Studio Settings
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isDark
                  ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}
            >
              v1.0
            </span>
          </div>

          {/* Color Scheme Switcher */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium mb-2 opacity-80">
              Color Scheme
            </label>
            <div
              className={`grid grid-cols-2 p-1 rounded-xl border ${
                isDark
                  ? 'bg-neutral-950/80 border-neutral-800'
                  : 'bg-neutral-100 border-neutral-200'
              }`}
            >
              <button
                id="theme-select-dark"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isDark
                    ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>

              <button
                id="theme-select-light"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-amber-500 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px my-3 ${isDark ? 'bg-neutral-800/80' : 'bg-neutral-200'}`} />

          {/* PWA Install Area */}
          <div>
            <label className="block text-[11px] font-medium mb-2 opacity-80">
              Application
            </label>

            {isInstalled ? (
              <div
                id="menu-pwa-installed-badge"
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-emerald-950/40 border-emerald-500/25 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[11px]">Installed on Device</span>
                  <span className="text-[10px] opacity-75">Running in standalone mode</span>
                </div>
              </div>
            ) : isInstallable ? (
              <button
                id="menu-pwa-install-button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-semibold shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Tunnel Studio</span>
              </button>
            ) : isIOS ? (
              <button
                id="menu-pwa-ios-button"
                onClick={handleInstallClick}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-800'
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
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-medium text-[11px]">PWA Ready</span>
                  <span className="text-[10px] opacity-70">Install available via browser menu</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* iOS Install Instructions Modal */}
      {showIOSGuide && (
        <div
          id="pwa-ios-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
        >
          <div
            className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? 'bg-[#12141d] border-neutral-800 text-neutral-200'
                : 'bg-white border-neutral-200 text-neutral-800'
            }`}
          >
            <button
              id="pwa-ios-modal-close"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

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
              id="pwa-ios-modal-dismiss"
              onClick={() => setShowIOSGuide(false)}
              className={`mt-6 w-full rounded-xl py-2.5 text-xs font-semibold transition-colors ${
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
    </div>
  );
};
