import React from 'react';
import { PackageOpen, SearchX, Layers } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'package' | 'search' | 'category';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'package',
  title,
  description,
  actionText,
  onAction,
  id,
}) => {
  const icons = {
    package: PackageOpen,
    search: SearchX,
    category: Layers,
  };

  const IconComponent = icons[icon];

  return (
    <div
      id={id || 'empty-state-view'}
      className="bg-[#0f1019]/90 rounded-2xl border border-dashed border-white/15 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 shadow-xl"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 text-violet-400 border border-white/10 flex items-center justify-center mb-4">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] border border-violet-400/30 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
