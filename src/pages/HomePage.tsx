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
} from 'lucide-react';
import type { Product, Category } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { CategoryCard } from '../components/CategoryCard.tsx';
import { ProductGridSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { APP_CONFIG } from '../config/index.ts';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp.ts';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  isLoading,
  onNavigate,
}) => {
  const waUrl = getGeneralWhatsAppUrl(
    `Hola ${APP_CONFIG.storeName}, deseo consultar sobre los productos destacados de su catálogo.`
  );

  const featuredProducts = products.filter((p) => p.active && p.featured);
  const activeProducts = products.filter((p) => p.active);
  const activeCategories = categories.filter((c) => c.active);

  // Showcase up to 2 active products dynamically (prioritize featured, then first available)
  const showcaseProducts = (
    featuredProducts.length >= 2
      ? featuredProducts.slice(0, 2)
      : activeProducts.slice(0, 2)
  );

  return (
    <div id="home-page-container" className="space-y-12 sm:space-y-16 pb-16">
      {/* Eye-catching Announcement Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-slate-900 to-emerald-700 text-white px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold tracking-wide text-center sm:text-left">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold uppercase">
              <Flame className="w-3.5 h-3.5 fill-current" />
              OFERTA ESTRELLA:
            </span>
            <span>
              Canva Pro Universitario a solo <strong className="text-emerald-300 underline underline-offset-2">S/ 5.00</strong> y Gemini Pro <strong className="text-emerald-300">18 Meses</strong> con activación inmediata.
            </span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 font-extrabold text-[11px] bg-white text-slate-950 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors shadow-xs uppercase tracking-wider"
          >
            <MessageCircle className="w-3 h-3 text-emerald-600 fill-current" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Hero Section - Geometric Balance & Rich Product Showcase */}
      <section
        id="home-hero-section"
        className="bg-white border-b border-slate-200/80 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>RICH PRO • CUENTAS & SUSCRIPCIONES DIGITALES</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Canva Pro + Gemini Pro
              </h1>
              <p className="text-lg sm:text-xl font-bold text-emerald-700">
                Todo lo que necesitas para crear, estudiar y trabajar mejor.
              </p>
            </div>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Herramientas premium de diseño e inteligencia artificial para estudiantes, creadores y profesionales. Accede a funciones avanzadas y potencia tu productividad.
            </p>

            {/* University & Instant Activation Highlight Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200 text-left space-y-1.5 shadow-2xs max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>🎓 PRECIOS ESPECIALES PARA ESTUDIANTES</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 font-bold leading-relaxed">
                Canva Pro desde <span className="text-emerald-950 font-black underline decoration-emerald-500">S/ 5.00</span> · Gemini Pro desde <span className="text-emerald-950 font-black underline decoration-emerald-500">S/ 5.00</span>
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                id="hero-btn-catalog"
                onClick={() => onNavigate('/productos')}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-lg shadow-slate-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>VER CATÁLOGO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="hero-btn-wa"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-wider uppercase text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>COMPRAR POR WHATSAPP</span>
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-100 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600">S/ 5.00</div>
                <div className="text-[11px] text-slate-500 font-bold">Canva Universitario</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
                  <span>5 Min</span>
                  <Zap className="w-4 h-4 text-amber-500 fill-current" />
                </div>
                <div className="text-[11px] text-slate-500 font-bold">Activación Rápida</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1">
                  <span>100%</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 font-bold">Garantía Total</div>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase: Canva Pro & Gemini Pro Cards */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-lg space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-500 fill-current" />
                  <span>Cuentas Más Vendidas</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Activación Inmediata
                </span>
              </div>

              {/* Dynamic Showcase Cards Grid */}
              <div className={`grid gap-4 ${showcaseProducts.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {showcaseProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => onNavigate(`/productos/${prod.id}`)}
                    className="group relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl hover:border-emerald-500/60 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  >
                    {/* Top Badge */}
                    <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 pointer-events-none">
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {prod.badge || (prod.duration ? `${prod.duration}` : 'CUENTA PRO')}
                      </span>
                    </div>

                    {/* Image Presentation */}
                    <div className="relative w-full aspect-square bg-slate-900/80 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none select-none"
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
                    <div className="p-3.5 bg-slate-900/95 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-400">
                            {APP_CONFIG.currencySymbol} {prod.price.toFixed(2)}
                          </span>
                          {prod.comparePrice && prod.comparePrice > prod.price && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">
                              {APP_CONFIG.currencySymbol} {prod.comparePrice.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {prod.description || 'Garantía y entrega inmediata a tu correo'}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] font-bold text-emerald-400">
                        <span>Ver detalles & pedir</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}

                {showcaseProducts.length === 0 && (
                  <div
                    onClick={() => onNavigate('/productos')}
                    className="col-span-full p-8 text-center bg-slate-900/90 border border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500/50"
                  >
                    <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Explora nuestro Catálogo Digital</p>
                    <p className="text-xs text-slate-400 mt-1">Haz clic aquí para ver todos los productos disponibles</p>
                  </div>
                )}
              </div>

              {/* Bottom Guarantee Pill - Striking Design */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs shadow-lg shadow-emerald-950/20 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      Garantía Total RICH PRO
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                      Activación a tu correo personal
                    </div>
                  </div>
                </div>

                <div className="z-10 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-1 rounded-lg shadow-sm uppercase tracking-wider transition-colors">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    100% SEGURO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Selección Especial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Productos Destacados
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Los artículos más solicitados por nuestros clientes en WhatsApp
            </p>
          </div>

          <button
            type="button"
            id="view-all-featured-btn"
            onClick={() => onNavigate('/productos')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
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
            title="Aún no hay productos destacados"
            description="Explora todo nuestro catálogo para conocer nuestros productos disponibles."
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
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <Tag className="w-4 h-4" />
                <span>Explorar por Categoría</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Nuestras Categorías
              </h2>
            </div>

            <button
              type="button"
              id="view-all-cats-btn"
              onClick={() => onNavigate('/categorias')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
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
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-slate-800"
        >
          <div className="space-y-3 text-center md:text-left z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
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
            className="z-10 shrink-0 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
