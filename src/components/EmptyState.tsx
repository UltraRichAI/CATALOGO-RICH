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
      className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
