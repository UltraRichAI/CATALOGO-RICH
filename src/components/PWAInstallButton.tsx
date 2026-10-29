import React, { useState } from 'react';
import { Download, Smartphone, X, Sparkles, Check, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running standalone or dismissed, don't show
  if (isInstalled || isDismissed) {
    return null;
  }

  // Variant Header (Compact button in navbar)
  if (variant === 'header') {
    if (isInstallable) {
      return (
        <button
          type="button"
          onClick={install}
          id="btn-pwa-install-header"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)] border border-violet-400/30 transition-all cursor-pointer animate-pulse"
          title="Instalar RICH PRO en tu celular o PC"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      );
    }

    if (isIOS) {
      return (
        <>
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            id="btn-pwa-install-ios-header"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer"
            title="Instalar RICH PRO en iPhone/iPad"
          >
            <Smartphone className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Instalar en iPhone</span>
          </button>

          {showIOSGuide && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
              onClick={() => setShowIOSGuide(false)}
            >
              <div
                className="w-full max-w-sm rounded-2xl bg-[#10111d] border border-violet-500/30 p-6 shadow-2xl space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Instalar en iPhone / iPad</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIOSGuide(false)}
                    className="text-slate-400 hover:text-white p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                      1
                    </span>
                    <p>
                      Abre este catálogo en <strong>Safari</strong> y pulsa el botón{' '}
                      <strong className="inline-flex items-center gap-1 text-violet-300">
                        <Share className="w-3 h-3" /> Compartir
                      </strong>{' '}
                      en la barra inferior.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                      2
                    </span>
                    <p>
                      Desliza hacia abajo en el menú y selecciona{' '}
                      <strong className="text-white">"Agregar a Inicio"</strong> (Add to Home Screen).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                      3
                    </span>
                    <p>
                      ¡Listo! Tendrás el icono de <strong>RICH PRO</strong> en tu pantalla de inicio para acceder en 1 toque.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
        </>
      );
    }

    return null;
  }

  // Variant Banner (Eye-catching floating bar at bottom of mobile screen or in-page)
  return (
    <>
      <div
        id="pwa-install-banner"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#121324]/95 backdrop-blur-md border border-violet-500/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 animate-slide-up"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md border border-violet-400/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Instala la App RICH PRO</span>
              <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded border border-violet-500/30">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              Accede al catálogo y ofertas directamente desde tu inicio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isInstallable ? (
            <button
              type="button"
              onClick={install}
              className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          ) : isIOS ? (
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Cómo instalar
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#10111d] border border-violet-500/30 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Instalar en iPhone / iPad</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </span>
                <p>
                  Abre este catálogo en <strong>Safari</strong> y pulsa el botón{' '}
                  <strong className="inline-flex items-center gap-1 text-violet-300">
                    <Share className="w-3 h-3" /> Compartir
                  </strong>{' '}
                  en la barra inferior.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </span>
                <p>
                  Desliza hacia abajo en el menú y selecciona{' '}
                  <strong className="text-white">"Agregar a Inicio"</strong> (Add to Home Screen).
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                  3
                </span>
                <p>
                  ¡Listo! Tendrás el icono de <strong>RICH PRO</strong> en tu pantalla de inicio para acceder en 1 toque.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
