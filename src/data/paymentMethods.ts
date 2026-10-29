export interface PaymentMethod {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  color: string;
  iconType: 'yape' | 'plin' | 'bank' | 'crypto';
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'yape',
    name: 'Yape',
    subtitle: 'Transferencia instantánea con número o QR',
    badge: 'Más Rápido ⚡',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    color: 'from-purple-600 to-fuchsia-600',
    iconType: 'yape',
  },
  {
    id: 'plin',
    name: 'Plin',
    subtitle: 'Interbank, BBVA, Scotiabank sin comisión',
    badge: 'Instantáneo',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    color: 'from-cyan-500 to-blue-600',
    iconType: 'plin',
  },
  {
    id: 'transferencia',
    name: 'Transferencia Bancaria',
    subtitle: 'BCP, BBVA, Interbank o Banco de la Nación',
    color: 'from-amber-500 to-orange-600',
    iconType: 'bank',
  },
  {
    id: 'binance',
    name: 'Binance Pay / USDT',
    subtitle: 'Pagos cripto internacionales sin comisiones',
    badge: 'Global',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    color: 'from-emerald-500 to-teal-600',
    iconType: 'crypto',
  },
];
