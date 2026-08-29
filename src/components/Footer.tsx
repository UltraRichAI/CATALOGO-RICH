import React from 'react';
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, Clock, Sparkles, Database, Lock } from 'lucide-react';
import { APP_CONFIG } from '../config/index.ts';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp.ts';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const waUrl = getGeneralWhatsAppUrl();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Activaciones Inmediatas</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Entrega rápida de tus cuentas Pro con soporte directo por WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Garantía 18 Meses</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Soporte y garantía total durante todo el periodo en Canva Pro y Gemini Pro.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Cuentas 100% Originales</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Acceso a funciones premium oficiales sin cortes ni interrupciones.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-emerald-400 font-extrabold text-xs">
                RP
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                RICH<span className="text-emerald-400 font-semibold">.PRO</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Catálogo oficial de suscripciones y licencias premium. Canva Pro 18 meses, Gemini Pro 18 meses, herramientas IA y suites de productividad con atención directa vía WhatsApp.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Clock className="w-4 h-4" />
              <span>{APP_CONFIG.supportHours}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/productos')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Catálogo Pro
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/categorias')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Categorías
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Panel Administrador</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Contacto Directo
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              ¿Deseas activar tu cuenta Pro o tienes preguntas antes de adquirirla?
            </p>
            <a
              id="footer-wa-direct-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RICH PRO. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Supabase Database & Realtime
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
