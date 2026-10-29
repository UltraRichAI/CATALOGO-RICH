import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { formatCurrency } from '../utils/formatters.ts';
import { getCartWhatsAppUrl } from '../utils/whatsapp.ts';
import { PAYMENT_METHODS } from '../data/paymentMethods.ts';
import { APP_CONFIG } from '../config/index.ts';

interface CartDrawerProps {
  onNavigateToCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCatalog }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
  } = useCart();

  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('yape');

  if (!isCartOpen) return null;

  // Calculadora de Ahorro Total (RICH PRO vs. Precios Oficiales)
  const totalOfficialPrice = items.reduce((acc, item) => {
    const regular = item.product.comparePrice && item.product.comparePrice > item.product.price
      ? item.product.comparePrice
      : item.product.price;
    return acc + regular * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, totalOfficialPrice - totalAmount);
  const savingsPercent = totalOfficialPrice > 0 ? Math.round((totalSavings / totalOfficialPrice) * 100) : 0;

  const currentPayment = PAYMENT_METHODS.find((m) => m.id === selectedPaymentId) || PAYMENT_METHODS[0];
  const waCheckoutUrl = getCartWhatsAppUrl(items, undefined, currentPayment.name);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end transition-opacity duration-300"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#0c0d15] border-l border-white/10 h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e0f18]">
          <div className="flex items-center gap-3">
            <img
              src={APP_CONFIG.logoUrl}
              alt="OG. RICH Logo"
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">Mi Pedido</h2>
                <span className="bg-white/10 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-white/10">
                  {totalItems} {totalItems === 1 ? 'cuenta' : 'cuentas'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Activación y entrega directa por WhatsApp
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List / Empty state */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/10 space-y-3">
          {items.length === 0 ? (
            <div id="cart-empty-state" className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 text-violet-400 border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Tu lista está vacía</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                Explora el catálogo y agrega tus suscripciones favoritas para consultar y activar al instante.
              </p>
              <button
                type="button"
                id="btn-empty-cart-catalog"
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigateToCatalog();
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-violet-400/30 cursor-pointer"
              >
                <span>Explorar Cuentas Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Top Bar with Clear Cart */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cuentas seleccionadas ({totalItems})
                </span>
                <button
                  type="button"
                  id="btn-clear-cart"
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar lista
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                {items.map(({ product, quantity }) => {
                  const hasUnitSavings = product.comparePrice && product.comparePrice > product.price;
                  const unitSavings = hasUnitSavings ? (product.comparePrice! - product.price) * quantity : 0;

                  return (
                    <div
                      key={product.id}
                      id={`cart-item-${product.id}`}
                      className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3.5 relative group hover:border-violet-500/20 transition-all"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-contain p-1 bg-[#08080d] border border-white/10 shrink-0 shadow-2xs"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            title={product.name}
                            className="font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug"
                          >
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-violet-400">
                            {formatCurrency(product.price * quantity)}
                          </span>
                          {hasUnitSavings && (
                            <span className="text-[10px] text-slate-500 line-through">
                              {formatCurrency(product.comparePrice! * quantity)}
                            </span>
                          )}
                          {hasUnitSavings && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                              Ahorras {formatCurrency(unitSavings)}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <div className="flex items-center border border-white/10 rounded-lg bg-[#08080d] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-[11px] text-slate-400 font-medium">
                            {formatCurrency(product.price)} c/u
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CALCULADORA DE AHORRO REAL (Rich Banner) */}
              {totalSavings > 0 && (
                <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0b1a13] to-teal-950/60 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 text-base shrink-0">
                        🔥
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <span>Ahorras {formatCurrency(totalSavings)} con RICH PRO</span>
                        </div>
                        <p className="text-[11px] text-emerald-300/90 leading-tight mt-0.5">
                          {savingsPercent}% de descuento respecto a las suscripciones oficiales
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 bg-emerald-500 text-black font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                      -{savingsPercent}%
                    </span>
                  </div>
                </div>
              )}

              {/* SELECTOR INTERACTIVO DE MÉTODO DE PAGO */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                    <span>¿Cómo prefieres pagar?</span>
                  </label>
                  <span className="text-[10px] text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-500/30 font-semibold">
                    Selecciona uno
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedPaymentId === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPaymentId(method.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-violet-950/70 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)] ring-1 ring-violet-400'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <div className="flex items-center gap-1.5">
                            {/* Color Dot / Icon Indicator */}
                            <span
                              className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${method.color} shadow-xs`}
                            />
                            <span className="font-bold text-xs text-white">
                              {method.name}
                            </span>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                          )}
                        </div>

                        <span className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                          {method.subtitle}
                        </span>

                        {method.badge && (
                          <div className="mt-1.5">
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                                method.badgeColor || 'bg-white/10 text-white border-white/20'
                              }`}
                            >
                              {method.badge}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Micro reassurance message */}
                <div className="bg-white/[0.02] rounded-xl p-2.5 border border-white/5 flex items-center gap-2 text-[11px] text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    Activación inmediata por WhatsApp tras validar tu comprobante de {currentPayment.name}.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with WhatsApp checkout & calculations */}
        {items.length > 0 && (
          <div className="p-5 bg-[#0e0f18] border-t border-white/10 space-y-3.5">
            {/* Price Breakdown */}
            <div className="space-y-1.5">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Precio Regular Oficial:</span>
                  <span className="line-through text-slate-500 font-semibold">
                    {formatCurrency(totalOfficialPrice)}
                  </span>
                </div>
              )}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
                  <span>Ahorro RICH PRO:</span>
                  <span>-{formatCurrency(totalSavings)} ({savingsPercent}%)</span>
                </div>
              )}
              <div className="flex items-center justify-between font-bold text-white text-base pt-2 border-t border-white/10">
                <div className="flex flex-col">
                  <span>Total a pagar:</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Pago vía {currentPayment.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-violet-400 tracking-tight">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Action WhatsApp Submit */}
            <a
              id="btn-whatsapp-cart-checkout"
              href={waCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.4)] border border-violet-400/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Pedir por WhatsApp ({currentPayment.name})</span>
            </a>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Garantía Total
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Entrega en minutos
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-400" />
                Soporte 24/7
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
