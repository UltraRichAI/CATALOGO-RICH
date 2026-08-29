import { APP_CONFIG } from '../config/index.ts';

export const formatCurrency = (amount: number, symbol = APP_CONFIG.currencySymbol): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return `${symbol} 0.00`;
  return `${symbol} ${amount.toFixed(2)}`;
};

export const formatDate = (timestamp: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
