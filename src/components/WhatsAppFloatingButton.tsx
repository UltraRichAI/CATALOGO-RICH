import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp.ts';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const waUrl = getGeneralWhatsAppUrl();

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-6 right-6 z-40 flex items-end gap-3 flex-col"
    >
      {showTooltip && (
        <div
          id="wa-floating-tooltip"
          className="relative bg-[#0f1019]/95 text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl border border-white/10 max-w-[220px] flex items-start justify-between gap-2 animate-bounce duration-1000 backdrop-blur-md"
        >
          <div>
            <p className="font-bold text-violet-400">¿Tienes dudas?</p>
            <p className="text-slate-400 text-[11px] leading-snug">
              Escríbenos directamente a WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white transition-colors shrink-0 -mt-1 -mr-1 cursor-pointer"
            aria-label="Cerrar tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        id="btn-whatsapp-floating"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] border border-violet-400/40 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-violet-500/30"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </div>
  );
};
