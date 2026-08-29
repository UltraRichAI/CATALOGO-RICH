import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import type { Category } from '../types/index.ts';

interface CategoryCardProps {
  category: Category;
  productCount?: number;
  onSelect: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  productCount,
  onSelect,
}) => {
  return (
    <div
      id={`category-card-${category.id}`}
      onClick={() => onSelect(category.id)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
          <Layers className="w-6 h-6" />
        </div>
        {typeof productCount === 'number' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
        <span>Ver productos</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
