import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#11121c]/90 rounded-2xl border border-white/10 p-4 animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-square w-full bg-white/5 border border-white/5 rounded-xl mb-4" />
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/10 rounded w-full mb-1" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="h-5 bg-white/10 rounded w-1/3" />
        <div className="h-8 bg-white/10 rounded-xl w-1/3" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#11121c]/90 rounded-2xl border border-white/10 p-5 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
      <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
      <div className="h-3 bg-white/10 rounded w-3/4" />
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
