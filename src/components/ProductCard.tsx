import React from 'react';
import { ShoppingBag, Eye, Tag, Sparkles, Plus, Check, MessageCircle } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { getProductWhatsAppUrl } from '../utils/whatsapp.ts';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

interface ProductCardProps {
  product: Product;
  onViewDetail: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
}) => {
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();
  const waUrl = getProductWhatsAppUrl(product);

  const hasOffer = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasOffer
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    showToast(`"${product.name}" agregado al carrito`, 'success');
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetail(product.id)}
      className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Image & Badges Container */}
      <div className="aspect-square w-full bg-slate-900/5 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center p-2">
        {/* Subtle blurred backdrop to complement flyers/banners */}
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-110 pointer-events-none select-none"
          referrerPolicy="no-referrer"
        />

        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-2xs"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20 pointer-events-none">
          {product.badge && (
            <span className="inline-flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs border border-slate-800">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {product.badge}
            </span>
          )}
          {product.duration && (
            <span className="inline-flex items-center gap-1 bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              {product.duration}
            </span>
          )}
          {hasOffer && (
            <span className="inline-flex items-center gap-1 bg-rose-500/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              <Tag className="w-3 h-3" />
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick view button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
          aria-label="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Category Tag on Image */}
        {product.category && (
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-emerald-600 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {hasOffer && (
              <span className="text-[11px] text-slate-400 line-through font-medium">
                {formatCurrency(product.comparePrice!)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className={`w-full py-2 px-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isInCart(product.id)
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isInCart(product.id) ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>En Carrito</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Al Carrito</span>
                </>
              )}
            </button>

            <a
              id={`btn-wa-card-${product.id}`}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current opacity-80" />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
