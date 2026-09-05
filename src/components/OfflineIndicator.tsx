import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-amber-200 shadow-xl"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Cached in Tunnel Studio</span>
    </div>
  );
};
