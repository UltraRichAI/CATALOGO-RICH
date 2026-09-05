import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  TrendingUp,
  Tag,
  Zap,
  Flame,
  GraduationCap,
  CheckCircle2,
  Clock,
  Star,
  Film,
} from 'lucide-react';
import type { Product, Category } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { CategoryCard } from '../components/CategoryCard.tsx';
import { ProductGridSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { HeroBackgroundVideo } from '../components/HeroBackgroundVideo.tsx';
import { APP_CONFIG } from '../config/index.ts';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp.ts';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  bestSellerIds?: string[];
  isLoading: boolean;
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  bestSellerIds = [],
  isLoading,
  onNavigate,
}) => {
  const waUrl = getGeneralWhatsAppUrl(
    `Hola ${APP_CONFIG.storeName}, deseo consultar sobre los productos destacados de su catálogo.`
  );

  const activeProducts = products.filter((p) => p.active);
  const activeCategories = categories.filter((c) => c.active);
  const featuredProducts = products.filter((p) => p.active && p.featured);

  // 1. Strictly resolve configured Best Seller Accounts ("CUENTAS MÁS VENDIDAS")
  // They stay STATIC and will NOT change or shift when new products are added to the catalog.
  let showcaseProducts: Product[] = [];
  if (bestSellerIds && bestSellerIds.length > 0) {
    const matched = bestSellerIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p && p.active));
    if (matched.length > 0) {
      showcaseProducts = matched.slice(0, 2);
    }
  }

  // Fallback if not configured yet
  if (showcaseProducts.length === 0) {
    const featured = products.filter((p) => p.active && p.featured);
    showcaseProducts = featured.length >= 2 ? featured.slice(0, 2) : activeProducts.slice(0, 2);
  }

  const minPrice = activeProducts.length > 0
    ? Math.min(...activeProducts.map((p) => p.price))
    : 5;

  // Dynamic hero headlines based on active catalog
  const heroTitle = activeProducts.length === 1
    ? activeProducts[0].name
    : activeProducts.length === 2
    ? `${activeProducts[0].name} & ${activeProducts[1].name}`
    : 'Cuentas Premium & Suscripciones Digitales';

  const heroSubtitle = activeProducts.length === 1
    ? (activeProducts[0].description || 'Acceso oficial con activación directa a tu correo personal.')
    : 'Todo lo que necesitas para crear, estudiar y trabajar al máximo nivel.';

  const heroOfferText = activeProducts.length === 1
    ? `${activeProducts[0].name} a solo ${APP_CONFIG.currencySymbol} ${activeProducts[0].price.toFixed(2)} · Garantía y soporte 24/7`
    : activeProducts.length === 2
    ? `${activeProducts[0].name} desde ${APP_CONFIG.currencySymbol} ${activeProducts[0].price.toFixed(2)} · ${activeProducts[1].name} desde ${APP_CONFIG.currencySymbol} ${activeProducts[1].price.toFixed(2)}`
    : `Suscripciones activas desde ${APP_CONFIG.currencySymbol} ${minPrice.toFixed(2)} · Entrega y activación en minutos`;

  return (
    <div id="home-page-container" className="space-y-12 sm:space-y-16 pb-16">
      {/* Eye-catching Announcement Top Bar */}
      <div className="bg-gradient-to-r from-violet-950/90 via-[#0e0e18] to-violet-950/90 border-b border-violet-500/20 text-white px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold tracking-wide text-center sm:text-left">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-300"></span>
            </span>
            <span className="inline-flex items-center gap-1 text-violet-300 font-extrabold uppercase">
              <Flame className="w-3.5 h-3.5 fill-current" />
              OFERTA ESTRELLA:
            </span>
            <span>
              {showcaseProducts.length >= 2 ? (
                <>
                  {showcaseProducts[0].name} a solo <strong className="text-violet-300 underline underline-offset-2">{APP_CONFIG.currencySymbol} {showcaseProducts[0].price.toFixed(2)}</strong> y {showcaseProducts[1].name} a <strong className="text-violet-300">{APP_CONFIG.currencySymbol} {showcaseProducts[1].price.toFixed(2)}</strong> con activación inmediata.
                </>
              ) : showcaseProducts.length === 1 ? (
                <>
                  {showcaseProducts[0].name} a solo <strong className="text-violet-300 underline underline-offset-2">{APP_CONFIG.currencySymbol} {showcaseProducts[0].price.toFixed(2)}</strong> con activación inmediata a tu correo.
                </>
              ) : (
                <>
                  Cuentas & Suscripciones Digitales con garantía y activación inmediata por WhatsApp.
                </>
              )}
            </span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 font-extrabold text-[11px] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-400/30 px-3 py-1 rounded-full transition-all shadow-[0_0_12px_rgba(139,92,246,0.3)] uppercase tracking-wider"
          >
            <MessageCircle className="w-3 h-3 text-white fill-current" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Hero Section with Video in the Background */}
      <HeroBackgroundVideo>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Block - Directly overlaid on the video without glass box */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-black/60 border border-white/20 text-violet-200 text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>RICH PRO • CUENTAS & SUSCRIPCIONES DIGITALES</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight [text-shadow:_0_3px_20px_rgb(0_0_0_/_95%)]">
                {heroTitle}
              </h1>
              <p className="text-base sm:text-lg font-bold text-violet-300 line-clamp-2 [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)]">
                {heroSubtitle}
              </p>
            </div>

            <p className="text-slate-100 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal [text-shadow:_0_2px_12px_rgb(0_0_0_/_95%)]">
              Herramientas premium de diseño, productividad e inteligencia artificial para estudiantes, creadores y profesionales. Accede a funciones avanzadas y ahorra dinero.
            </p>

            {/* University & Instant Activation Highlight Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-violet-500/40 text-left space-y-1 shadow-xl max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-violet-200 font-black text-xs sm:text-sm uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-violet-400" />
                <span>🎓 PRECIOS ESPECIALES & GARANTÍA TOTAL</span>
              </div>
              <p className="text-xs sm:text-sm text-violet-200 font-bold leading-relaxed">
                {heroOfferText}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                id="hero-btn-catalog"
                onClick={() => onNavigate('/productos')}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-black/60 hover:bg-black/80 text-white font-black tracking-wider uppercase text-xs sm:text-sm rounded-xl border border-white/30 hover:border-violet-400/80 shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>VER CATÁLOGO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-btn-wa"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.7)] border border-violet-400/60 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>COMPRAR POR WHATSAPP</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/20 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-violet-300 [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)]">
                  {APP_CONFIG.currencySymbol} {minPrice.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-200 font-bold [text-shadow:_0_2px_8px_rgb(0_0_0_/_90%)]">Desde / Mejor Precio</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1 [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)]">
                  <span>5 Min</span>
                  <Zap className="w-4 h-4 text-amber-400 fill-current" />
                </div>
                <div className="text-[11px] text-slate-200 font-bold [text-shadow:_0_2px_8px_rgb(0_0_0_/_90%)]">Activación Rápida</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1 [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)]">
                  <span>100%</span>
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-[11px] text-slate-200 font-bold [text-shadow:_0_2px_8px_rgb(0_0_0_/_90%)]">Garantía Total</div>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase - Top Accounts over the Background Video */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-lg space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider [text-shadow:_0_2px_8px_rgb(0_0_0_/_90%)]">
                  <Flame className="w-4 h-4 text-rose-500 fill-current" />
                  <span>{showcaseProducts.length === 1 ? 'Cuenta Destacada' : 'Cuentas Más Vendidas'}</span>
                </div>
                <span className="text-[11px] font-bold text-violet-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-violet-500/40">
                  Activación Inmediata
                </span>
              </div>

              {/* Dynamic Showcase Cards Grid */}
              {showcaseProducts.length === 1 ? (
                /* SINGLE PRODUCT: Elegant compact card */
                <div
                  onClick={() => onNavigate(`/productos/${showcaseProducts[0].id}`)}
                  className="group relative bg-[#0e0f1b]/95 rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-pointer flex flex-col max-w-md mx-auto w-full"
                >
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm border border-violet-400/40">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      {showcaseProducts[0].badge || (showcaseProducts[0].duration ? `${showcaseProducts[0].duration}` : 'CUENTA PRO')}
                    </span>
                    {showcaseProducts[0].duration && (
                      <span className="inline-flex items-center gap-1 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/15">
                        <Clock className="w-3 h-3 text-violet-400" />
                        {showcaseProducts[0].duration}
                      </span>
                    )}
                  </div>

                  {/* Image Presentation */}
                  <div className="relative w-full h-64 sm:h-72 bg-[#06070d]/90 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={showcaseProducts[0].imageUrl}
                      alt={showcaseProducts[0].name}
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src={showcaseProducts[0].imageUrl}
                      alt={showcaseProducts[0].name}
                      className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Card Bottom Details */}
                  <div className="p-4 bg-[#0a0b16] border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-extrabold text-base text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                        {showcaseProducts[0].name}
                      </h4>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-violet-400">
                          {APP_CONFIG.currencySymbol} {showcaseProducts[0].price.toFixed(2)}
                        </span>
                        {showcaseProducts[0].comparePrice && showcaseProducts[0].comparePrice > showcaseProducts[0].price && (
                          <span className="text-xs text-slate-500 line-through ml-2">
                            {APP_CONFIG.currencySymbol} {showcaseProducts[0].comparePrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {showcaseProducts[0].description || 'Activación garantizada a tu correo personal con soporte 24/7.'}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-violet-400 border-t border-white/10">
                      <span>Ver detalles & pedir por WhatsApp</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ) : showcaseProducts.length >= 2 ? (
                /* TWO PRODUCTS: Neat 2-column grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {showcaseProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onNavigate(`/productos/${prod.id}`)}
                      className="group relative bg-[#0e0f1b]/95 rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:border-violet-500/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Top Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm border border-violet-400/40">
                          <Sparkles className="w-3 h-3" />
                          {prod.badge || (prod.duration ? `${prod.duration}` : 'CUENTA PRO')}
                        </span>
                      </div>

                      {/* Image Presentation */}
                      <div className="relative w-full aspect-square bg-[#06070d]/90 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-110 pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Card Bottom Details */}
                      <div className="p-3.5 bg-[#0a0b16] border-t border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-violet-400">
                              {APP_CONFIG.currencySymbol} {prod.price.toFixed(2)}
                            </span>
                            {prod.comparePrice && prod.comparePrice > prod.price && (
                              <span className="text-[10px] text-slate-500 line-through ml-1.5">
                                {APP_CONFIG.currencySymbol} {prod.comparePrice.toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {prod.description || 'Garantía y entrega inmediata a tu correo'}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-violet-400">
                          <span>Ver detalles & pedir</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* NO PRODUCTS YET */
                <div
                  onClick={() => onNavigate('/productos')}
                  className="p-8 text-center bg-[#0e0f1b]/95 border border-white/20 rounded-2xl cursor-pointer hover:border-violet-500/50"
                >
                  <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Explora nuestro Catálogo Digital</p>
                  <p className="text-xs text-slate-400 mt-1">Haz clic aquí para ver todos los productos disponibles</p>
                </div>
              )}

              {/* Bottom Guarantee Pill - Striking Design */}
              <div className="bg-[#121324]/90 border border-violet-500/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs shadow-xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-violet-400">
                      Garantía Total RICH PRO
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                      Activación a tu correo personal
                    </div>
                  </div>
                </div>

                <div className="z-10 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-3 py-1 rounded-lg shadow-[0_0_12px_rgba(139,92,246,0.3)] border border-violet-400/30 uppercase tracking-wider transition-colors">
                    <Sparkles className="w-3 h-3 text-white" />
                    100% SEGURO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroBackgroundVideo>

      {/* Featured Products Section - Displays ALL products in rows of 4 */}
      <section id="featured-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Catálogo Completo de Suscripciones</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Productos Destacados
              </h2>
              {activeProducts.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-500/30 text-violet-300 text-xs font-bold">
                  {activeProducts.length} {activeProducts.length === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Todas nuestras cuentas oficiales y suscripciones disponibles con activación inmediata
            </p>
          </div>

          <button
            type="button"
            id="view-all-featured-btn"
            onClick={() => onNavigate('/productos')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-violet-400 transition-colors cursor-pointer"
          >
            <span>Ver filtros en catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...activeProducts]
              .sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return 0;
              })
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={(id) => onNavigate(`/productos/${id}`)}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            icon="package"
            title="Aún no hay productos disponibles"
            description="Explora nuestro catálogo o agrega productos desde el panel de administración."
            actionText="Ver catálogo completo"
            onAction={() => onNavigate('/productos')}
          />
        )}
      </section>

      {/* Categories Showcase */}
      {activeCategories.length > 0 && (
        <section id="home-categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">
                <Tag className="w-4 h-4" />
                <span>Explorar por Categoría</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Nuestras Categorías
              </h2>
            </div>

            <button
              type="button"
              id="view-all-cats-btn"
              onClick={() => onNavigate('/categorias')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-violet-400 transition-colors cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategories.slice(0, 6).map((category) => {
              const count = products.filter(
                (p) => p.categoryId === category.id || p.category === category.name
              ).length;
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={count}
                  onSelect={(catId) => onNavigate(`/productos?categoria=${encodeURIComponent(category.name || catId)}`)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* WhatsApp Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="home-wa-cta-banner"
          className="bg-gradient-to-br from-[#10111d] via-[#141627] to-[#0d0e17] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-violet-500/30"
        >
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              ¿No encuentras lo que buscas?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Te interesa algún producto en particular?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Escríbenos directamente por WhatsApp. Te enviamos fotos adicionales, resolvemos dudas de especificaciones y confirmamos disponibilidad en minutos.
            </p>
          </div>

          <a
            id="banner-wa-action-btn"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="z-10 shrink-0 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm sm:text-base shadow-[0_0_25px_rgba(139,92,246,0.4)] border border-violet-400/30 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
