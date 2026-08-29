export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  category?: string;
  categoryId?: string;
  active: boolean;
  featured: boolean;
  duration?: string;
  badge?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: number;
  order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  onlyFeatured: boolean;
  onlyOffers: boolean;
  sortBy: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

export interface StoreConfig {
  storeName: string;
  whatsappNumber: string;
  currencySymbol: string;
  currencyCode: string;
  supportHours: string;
  location: string;
}
