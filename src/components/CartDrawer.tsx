import React from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { formatCurrency } from '../utils/formatters.ts';
import { getCartWhatsAppUrl } from '../utils/whatsapp.ts';

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

  if (!isCartOpen) return null;

  const waCheckoutUrl = getCartWhatsAppUrl(items);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end transition-opacity duration-300"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#0c0d15] border-l border-white/10 h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0e0f18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.3)] border border-violet-400/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">Mi Pedido</h2>
                <span className="bg-white/10 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-white/10">
                  {totalItems} items
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consulta y cotización por WhatsApp
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
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/10">
          {items.length === 0 ? (
            <div id="cart-empty-state" className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 text-violet-400 border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Tu lista está vacía</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                Explora el catálogo y agrega productos para consultar disponibilidad por WhatsApp.
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
                <span>Explorar Productos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Artículos en lista</span>
                <button
                  type="button"
                  id="btn-clear-cart"
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar lista
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  id={`cart-item-${product.id}`}
                  className="pt-3 pb-3 flex items-center gap-3.5"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-contain p-1 bg-[#08080d] border border-white/10 shrink-0 shadow-2xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs font-bold text-violet-400 mt-0.5">
                      {formatCurrency(product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
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

                      <span className="text-xs text-slate-400 font-medium">
                        Subtotal: {formatCurrency(product.price * quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with WhatsApp checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-[#0e0f18] border-t border-white/10 space-y-4">
            {/* Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-white text-base pt-2 border-t border-white/10">
                <span>Total Estimado:</span>
                <span className="text-xl font-extrabold text-violet-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Main Action WhatsApp Submit */}
            <a
              id="btn-whatsapp-cart-checkout"
              href={waCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] border border-violet-400/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Pedir por WhatsApp</span>
            </a>

            <p className="text-[11px] text-center text-slate-400 leading-relaxed">
              Al hacer clic, se abrirá WhatsApp con el detalle estructurado para coordinar pago y entrega directamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
