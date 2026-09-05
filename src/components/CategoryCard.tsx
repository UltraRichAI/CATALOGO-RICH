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
      className="group bg-[#11121c]/90 hover:bg-[#151724] rounded-2xl border border-white/10 hover:border-violet-500/40 p-5 shadow-lg shadow-black/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-xl bg-violet-950/50 text-violet-400 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-400 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300">
          <Layers className="w-6 h-6" />
        </div>
        {typeof productCount === 'number' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300">
        <span>Ver productos</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
