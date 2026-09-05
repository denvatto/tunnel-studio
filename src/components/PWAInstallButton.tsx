import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Check, Share, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA
  if (isInstalled) {
    return (
      <div
        id="pwa-installed-badge"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-500 transition-all cursor-pointer"
        >
          <Share className="w-3.5 h-3.5 text-amber-400" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div
            id="pwa-ios-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#12131a] p-6 shadow-2xl text-neutral-200">
              <button
                id="pwa-ios-modal-close"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700">
                  <span className="font-bold text-amber-400">TS</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Install Tunnel Studio</h3>
                  <p className="text-xs text-neutral-400">Add to your iOS Home Screen</p>
                </div>
              </div>

              <ol className="space-y-3 text-xs text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-semibold text-[11px]">
                    1
                  </span>
                  <span>Tap the <strong>Share</strong> button in Safari toolbar.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-semibold text-[11px]">
                    2
                  </span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center font-semibold text-[11px]">
                    3
                  </span>
                  <span>Launch Tunnel Studio directly like a native app.</span>
                </li>
              </ol>

              <button
                id="pwa-ios-modal-dismiss"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 py-2.5 text-xs font-medium text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      id="pwa-ready-badge"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 bg-neutral-900/60 border border-neutral-800"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse"></span>
      <span>PWA Ready</span>
    </div>
  );
};
