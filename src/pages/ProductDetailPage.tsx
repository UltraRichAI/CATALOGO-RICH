import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Share2,
  Check,
  Tag,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  Plus,
  Minus,
} from 'lucide-react';
import type { Product } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { getProductWhatsAppUrl } from '../utils/whatsapp.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { APP_CONFIG } from '../config/index.ts';

interface ProductDetailPageProps {
  productId: string;
  products: Product[];
  isLoading: boolean;
  onNavigate: (route: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  isLoading,
  onNavigate,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === productId);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-white/10 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-white/10 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-6 bg-white/10 rounded w-1/4" />
            <div className="h-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Producto no encontrado</h2>
        <p className="text-sm text-slate-400">
          El producto solicitado no existe o fue despublicado del catálogo.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/productos')}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer border border-violet-400/30 shadow-lg"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const hasOffer = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasOffer
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const waUrl = getProductWhatsAppUrl(product);

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`Se agregaron ${quantity} unidad(es) de "${product.name}" al carrito`, 'success');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | ${APP_CONFIG.storeName}`,
          text: `Mira este producto en el catálogo: ${product.name} a ${formatCurrency(product.price)}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Enlace copiado al portapapeles', 'info');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast('No se pudo copiar el enlace', 'error');
    }
  };

  // Related products in same category
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.active &&
        (p.categoryId === product.categoryId || p.category === product.category)
    )
    .slice(0, 4);

  return (
    <div id="product-detail-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="detail-back-btn"
          onClick={() => onNavigate('/productos')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <button
          type="button"
          id="btn-share-product"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-300">¡Enlace Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </>
          )}
        </button>
      </div>

      {/* Main Product Showcase Card */}
      <div className="bg-[#10111d]/90 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Product Image Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] bg-[#0a0b12] rounded-2xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center p-3 sm:p-5">
            {/* Ambient blurred backdrop so any flyer/banner ratio blends seamlessly */}
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110 pointer-events-none select-none"
              referrerPolicy="no-referrer"
            />

            {/* Main crisp full-view image (never cropped or distorted) */}
            <img
              id="product-detail-main-image"
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="relative z-10 w-auto h-auto max-w-full max-h-[480px] object-contain rounded-xl shadow-md transition-all duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges - positioned cleanly with translucent backdrop */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20 pointer-events-none">
              {product.featured && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-violet-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Destacado
                </span>
              )}
              {hasOffer && (
                <span className="inline-flex items-center gap-1 bg-rose-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-rose-500/30">
                  <Tag className="w-3.5 h-3.5" />
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Info & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category tag & duration badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-950/60 border border-violet-500/30 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>
              )}
              {product.duration && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-indigo-200 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {product.duration}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Pricing block */}
            <div className="p-4 rounded-2xl bg-[#0a0b12] border border-white/10 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-400 tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {hasOffer && (
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base text-slate-500 line-through font-semibold">
                    {formatCurrency(product.comparePrice!)}
                  </span>
                  <span className="text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    Ahorras {formatCurrency(product.comparePrice! - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* University Student Discount Notice */}
            {(product.name.toLowerCase().includes('canva') || product.badge?.toLowerCase().includes('universitario')) && (
              <div className="bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-violet-950/60 border border-violet-500/30 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs text-lg">
                  🎓
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-extrabold text-white">
                      Descuento Especial Alumnos Universitarios
                    </h4>
                    <span className="text-[11px] font-black bg-violet-600 text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      S/ 5.00
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Precio exclusivo con activación a tu correo. Válido para estudiantes y universitarios. Escríbenos a WhatsApp para recibir tu acceso directo en minutos.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Descripción del producto
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Quantity & Action Controls */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-xl bg-[#0a0b12] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-white min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                id="btn-detail-add-cart"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-violet-400/40 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isInCart(product.id) ? 'Agregar más al carrito' : 'Agregar al carrito'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Consultation Button */}
            <a
              id="btn-detail-wa-inquiry"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.4)] border border-violet-400/30 transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Pedir por WhatsApp ({product.price === 5 ? 'S/ 5.00' : formatCurrency(product.price)})</span>
            </a>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Activación digital inmediata</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Garantía {product.duration ? product.duration : 'Total'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Productos Relacionados
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Otros artículos de la categoría {product.category || 'similar'} que te podrían interesar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onViewDetail={(id) => {
                  onNavigate(`/productos/${id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
