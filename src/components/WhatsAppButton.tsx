import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  url: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  url,
  label = 'Consultar por WhatsApp',
  variant = 'primary',
  className = '',
  id,
  onClick,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer text-center select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-violet-400/30 px-4 py-2.5 rounded-xl gap-2 text-sm md:text-base font-semibold',
    secondary:
      'bg-violet-950/60 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30 px-4 py-2.5 rounded-xl gap-2 text-sm font-semibold',
    outline:
      'bg-transparent hover:bg-white/5 text-violet-300 border border-violet-500/40 hover:border-violet-400 px-3.5 py-2 rounded-xl gap-1.5 text-sm font-medium',
    compact:
      'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg gap-1.5 text-xs font-semibold shadow-xs',
  };

  return (
    <a
      id={id || `wa-btn-${Math.random().toString(36).substring(2, 7)}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <MessageCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0 fill-current opacity-90" />
      <span>{label}</span>
    </a>
  );
};
