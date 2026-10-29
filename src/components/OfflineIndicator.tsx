import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 text-black px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md border border-amber-400 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-black" />
      <span>Modo Offline: Visualizando catálogo desde caché local</span>
    </div>
  );
};
