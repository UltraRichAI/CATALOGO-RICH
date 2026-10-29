import React from 'react';
import { ShieldCheck, Zap, TrendingDown, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { PAYMENT_METHODS } from '../data/paymentMethods.ts';

interface PaymentAndSavingsBannerProps {
  onExploreCatalog?: () => void;
}

export const PaymentAndSavingsBanner: React.FC<PaymentAndSavingsBannerProps> = ({
  onExploreCatalog,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#101221] via-[#131527] to-[#0c0d16] border border-violet-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Value Proposition & Real Savings */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ahorra hasta un 85% en tus suscripciones</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Cuentas Pro oficiales sin pagar en dólares ni suscripciones automáticas
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Olvídate de afiliar tarjetas de crédito internacionales o pagar tarifas mensuales exorbitantes. En RICH PRO recibes acceso oficial a tu propio correo con activación en minutos y garantía total.
            </p>

            {/* Micro value badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Activación &lt; 5 min</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantía de reposición</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Tu correo oficial</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Methods Grid with immediate Peruvian focus */}
          <div className="lg:col-span-5 bg-[#0a0b12]/90 border border-white/10 rounded-2xl p-5 shadow-inner space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-violet-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Métodos de Pago Aceptados
                </h4>
              </div>
              <span className="text-[10px] font-bold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/30">
                100% Verificado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${method.color}`} />
                      <span className="text-xs font-black text-white">{method.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {method.subtitle}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Envías tu constancia por WhatsApp y listo</span>
              {onExploreCatalog && (
                <button
                  type="button"
                  onClick={onExploreCatalog}
                  className="text-violet-400 hover:text-violet-300 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Ver cuentas</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
