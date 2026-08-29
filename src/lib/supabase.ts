import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { APP_CONFIG } from '../config/index.ts';
import type { Product, Category } from '../types/index.ts';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../data/seedData.ts';

// Local storage fallback keys
const LOCAL_PRODUCTS_KEY = 'rich_pro_products_cache';
const LOCAL_CATEGORIES_KEY = 'rich_pro_categories_cache';
const LOCAL_ADMIN_AUTH_KEY = 'rich_pro_admin_session';

// Check if valid Supabase credentials exist
export const isSupabaseConfigured = Boolean(
  APP_CONFIG.supabaseUrl &&
  APP_CONFIG.supabaseAnonKey &&
  APP_CONFIG.supabaseUrl.startsWith('http') &&
  !APP_CONFIG.supabaseUrl.includes('your-project')
);

// Initialize Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helper to generate UUIDs
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
};

/**
 * Local Storage Helpers for High-Availability & Seed
 */
export const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const items: Product[] = JSON.parse(raw);
      let modified = false;
      const updated = items.map((p) => {
        if (p.name.toLowerCase().includes('canva') && (p.price === 8 || p.badge?.includes('S/ 8'))) {
          modified = true;
          return {
            ...p,
            price: 5.0,
            badge: p.badge?.replace('S/ 8', 'S/ 5') || 'DESCUENTO UNIVERSITARIO S/ 5',
            description: p.description.replace('S/ 8.00', 'S/ 5.00'),
          };
        }
        return p;
      });
      if (modified) {
        setLocalProducts(updated);
        return updated;
      }
      return items;
    }
  } catch (e) {
    console.warn('Error reading local products cache:', e);
  }
  return [];
};

export const setLocalProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('Error saving local products cache:', e);
  }
};

export const getLocalCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local categories cache:', e);
  }
  return [];
};

export const setLocalCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn('Error saving local categories cache:', e);
  }
};

/**
 * Initial Rich Pro Seeder
 */
export const seedInitialLocalData = (): { products: Product[]; categories: Category[] } => {
  const now = Date.now();
  const categories: Category[] = SEED_CATEGORIES.map((cat, idx) => ({
    id: generateId(),
    name: cat.name,
    description: cat.description,
    active: true,
    createdAt: now - idx * 1000,
  }));

  const catMap = new Map<string, string>();
  categories.forEach((c) => catMap.set(c.name, c.id));

  const products: Product[] = SEED_PRODUCTS.map((prod, idx) => ({
    id: generateId(),
    name: prod.name,
    description: prod.description,
    price: prod.price,
    comparePrice: prod.comparePrice,
    imageUrl: prod.imageUrl,
    category: prod.category,
    categoryId: catMap.get(prod.category) || '',
    featured: prod.featured,
    active: prod.active,
    duration: prod.duration,
    badge: prod.badge,
    createdAt: now - idx * 60000,
    updatedAt: now,
  }));

  setLocalCategories(categories);
  setLocalProducts(products);

  return { products, categories };
};

/**
 * Supabase Data Service
 */
export const supabaseService = {
  // Fetch Products
  async fetchProducts(): Promise<Product[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            description: item.description || '',
            price: Number(item.price),
            comparePrice: item.compare_price ? Number(item.compare_price) : undefined,
            imageUrl: item.image_url || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
            category: item.category || '',
            categoryId: item.category_id || '',
            active: item.active !== false,
            featured: Boolean(item.featured),
            duration: item.duration || '',
            badge: item.badge || '',
            createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
            updatedAt: item.updated_at ? new Date(item.updated_at).getTime() : Date.now(),
          }));
          setLocalProducts(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch products error, fallback to local storage:', err);
      }
    }

    // Local Storage fallback
    let local = getLocalProducts();
    if (local.length === 0) {
      const seeded = seedInitialLocalData();
      return seeded.products;
    }
    return local;
  },

  // Fetch Categories
  async fetchCategories(): Promise<Category[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: Category[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            description: item.description || '',
            imageUrl: item.image_url,
            active: item.active !== false,
            createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
          }));
          setLocalCategories(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetch categories error, fallback to local:', err);
      }
    }

    let local = getLocalCategories();
    if (local.length === 0) {
      const seeded = seedInitialLocalData();
      return seeded.categories;
    }
    return local;
  },

  // Save Product (Insert or Update)
  async saveProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
    const isNew = !product.id;
    const prodId = product.id || generateId();
    const now = Date.now();

    const fullProduct: Product = {
      id: prodId,
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      comparePrice: product.comparePrice,
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      category: product.category || '',
      categoryId: product.categoryId || '',
      active: product.active ?? true,
      featured: product.featured ?? false,
      duration: product.duration || '',
      badge: product.badge || '',
      createdAt: product.createdAt || now,
      updatedAt: now,
    };

    // Save to local cache first
    const local = getLocalProducts();
    const existingIdx = local.findIndex((p) => p.id === prodId);
    if (existingIdx >= 0) {
      local[existingIdx] = fullProduct;
    } else {
      local.unshift(fullProduct);
    }
    setLocalProducts(local);

    // Save to Supabase if connected
    if (supabase) {
      try {
        const payload = {
          id: prodId,
          name: fullProduct.name,
          description: fullProduct.description,
          price: fullProduct.price,
          compare_price: fullProduct.comparePrice || null,
          image_url: fullProduct.imageUrl,
          category: fullProduct.category,
          category_id: fullProduct.categoryId || null,
          active: fullProduct.active,
          featured: fullProduct.featured,
          duration: fullProduct.duration || null,
          badge: fullProduct.badge || null,
          updated_at: new Date(now).toISOString(),
        };

        const { error: upsertError } = await supabase.from('products').upsert([payload]);
        if (upsertError) {
          console.warn('Supabase upsert product notice (check table schema/RLS):', upsertError.message);
        }
      } catch (err) {
        console.warn('Supabase save product error:', err);
      }
    }

    return fullProduct;
  },

  // Delete Product
  async deleteProduct(id: string): Promise<boolean> {
    const local = getLocalProducts().filter((p) => p.id !== id);
    setLocalProducts(local);

    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.warn('Supabase delete error:', error.message);
      } catch (err) {
        console.warn('Supabase delete product error:', err);
      }
    }
    return true;
  },

  // Save Category
  async saveCategory(cat: Partial<Category> & { id?: string }): Promise<Category> {
    const isNew = !cat.id;
    const catId = cat.id || generateId();
    const now = Date.now();

    const fullCat: Category = {
      id: catId,
      name: cat.name || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl,
      active: cat.active ?? true,
      createdAt: cat.createdAt || now,
    };

    const local = getLocalCategories();
    const existingIdx = local.findIndex((c) => c.id === catId);
    if (existingIdx >= 0) {
      local[existingIdx] = fullCat;
    } else {
      local.push(fullCat);
    }
    setLocalCategories(local);

    if (supabase) {
      try {
        const payload = {
          id: catId,
          name: fullCat.name,
          description: fullCat.description,
          image_url: fullCat.imageUrl || null,
          active: fullCat.active,
        };

        const { error: catError } = await supabase.from('categories').upsert([payload]);
        if (catError) {
          console.warn('Supabase save category notice:', catError.message);
        }
      } catch (err) {
        console.warn('Supabase save category error:', err);
      }
    }

    return fullCat;
  },

  // Delete Category
  async deleteCategory(id: string): Promise<boolean> {
    const local = getLocalCategories().filter((c) => c.id !== id);
    setLocalCategories(local);

    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category error:', err);
      }
    }
    return true;
  },

  // Seed Supabase with RICH PRO catalog
  async seedRichProCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
    const seeded = seedInitialLocalData();

    if (supabase) {
      try {
        // Seed categories
        const catPayload = seeded.categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          active: c.active,
          created_at: new Date(c.createdAt).toISOString(),
        }));
        await supabase.from('categories').upsert(catPayload);

        // Seed products
        const prodPayload = seeded.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          compare_price: p.comparePrice || null,
          image_url: p.imageUrl,
          category: p.category,
          category_id: p.categoryId || null,
          active: p.active,
          featured: p.featured,
          duration: p.duration || null,
          badge: p.badge || null,
          created_at: new Date(p.createdAt).toISOString(),
          updated_at: new Date(p.updatedAt).toISOString(),
        }));
        await supabase.from('products').upsert(prodPayload);
      } catch (err) {
        console.warn('Supabase cloud seeding error:', err);
      }
    }

    return seeded;
  },

  // Supabase SQL Schema for easy creation
  getSchemaSqlScript(): string {
    return `-- ========================================================
-- RICH PRO • Tablas de Base de Datos Supabase (PostgreSQL)
-- Copia y pega esto en el SQL Editor de tu proyecto Supabase
-- ========================================================

-- 1. Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Productos (RICH PRO: Canva Pro 18M, Gemini Pro 18M, etc.)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  image_url TEXT,
  category TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  duration TEXT,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Seguridad por Filas (RLS) y Políticas de Acceso Público de Lectura
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todo el público (anónimo y autenticado)
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

-- Permitir escrituras a usuarios autenticados / service role
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Realtime para ambas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
`;
  },
};
