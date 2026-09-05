import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import type { Category, Product } from '../types/index.ts';
import { CategoryCard } from '../components/CategoryCard.tsx';
import { CategoryCardSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';

interface CategoriesPageProps {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  onNavigate: (route: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  products,
  isLoading,
  onNavigate,
}) => {
  const activeCategories = categories.filter((c) => c.active);

  return (
    <div id="categories-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/productos')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a productos</span>
          </button>
          <div className="inline-block px-3 py-1 bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            Organización
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Categorías
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explora nuestros productos organizados por familias y secciones.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : activeCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryId === cat.id || p.category === cat.name
            ).length;
            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                productCount={count}
                onSelect={() =>
                  onNavigate(`/productos?categoria=${encodeURIComponent(cat.name)}`)
                }
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="category"
          title="No hay categorías configuradas"
          description="Las categorías creadas por el administrador aparecerán aquí."
          actionText="Ver catálogo completo"
          onAction={() => onNavigate('/productos')}
        />
      )}
    </div>
  );
};
