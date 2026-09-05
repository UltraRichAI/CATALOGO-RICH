import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';
import type { Product, Category, SortOption } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ProductGridSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  onNavigate: (route: string) => void;
  initialCategory?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  categories,
  isLoading,
  onNavigate,
  initialCategory = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filter and sort active products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Only active products in public catalog
        if (!product.active) return false;

        // Search Query (name or description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.category?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory) {
          const matchCatName = product.category === selectedCategory;
          const matchCatId = product.categoryId === selectedCategory;
          if (!matchCatName && !matchCatId) return false;
        }

        // Featured filter
        if (onlyFeatured && !product.featured) {
          return false;
        }

        // Offers filter (comparePrice > price)
        if (onlyOffers) {
          const isOffer = product.comparePrice && product.comparePrice > product.price;
          if (!isOffer) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        // Default 'newest'
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [products, searchQuery, selectedCategory, onlyFeatured, onlyOffers, sortBy]);

  const activeCategories = categories.filter((c) => c.active);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== '' ||
    onlyFeatured ||
    onlyOffers ||
    sortBy !== 'newest';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setOnlyFeatured(false);
    setOnlyOffers(false);
    setSortBy('newest');
  };

  return (
    <div id="catalog-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header & Title */}
      <div>
        <div className="inline-block px-3 py-1 bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          RICH PRO • Catálogo Oficial
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cuentas Pro & Suscripciones Digitales
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Canva Pro 18 meses, Gemini Pro 18 meses, IA y software con entrega inmediata y garantía.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-[#10111d]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="catalog-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#0a0b12] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#0a0b12] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-[#0e0f19] text-white">Más recientes</option>
              <option value="price-asc" className="bg-[#0e0f19] text-white">Precio: Menor a Mayor</option>
              <option value="price-desc" className="bg-[#0e0f19] text-white">Precio: Mayor a Menor</option>
              <option value="name-asc" className="bg-[#0e0f19] text-white">Nombre: A - Z</option>
            </select>
          </div>

          {/* Quick Toggle Pills */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="button"
              id="filter-toggle-offers"
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                onlyOffers
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Ofertas</span>
            </button>

            <button
              type="button"
              id="filter-toggle-featured"
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                onlyFeatured
                  ? 'bg-violet-950/60 border-violet-500/50 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Destacados</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        {activeCategories.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400/30 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Todas las Categorías
            </button>

            {activeCategories.map((cat) => {
              const isSelected =
                selectedCategory === cat.name || selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-400/30 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Results indicator & Clear Filters */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Mostrando <strong className="text-white">{filteredProducts.length}</strong> de{' '}
            <strong className="text-white">{products.filter((p) => p.active).length}</strong> productos
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              id="reset-all-filters-btn"
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 underline cursor-pointer"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      </div>

      {/* Product Grid Area */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : filteredProducts.length > 0 ? (
        <div id="catalog-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={(id) => onNavigate(`/productos/${id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="No encontramos productos con esos filtros"
          description="Intenta buscar con otros términos o elimina los filtros activos para ver todo el catálogo."
          actionText="Limpiar filtros"
          onAction={resetFilters}
        />
      )}
    </div>
  );
};
