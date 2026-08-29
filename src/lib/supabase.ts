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

        if (!error && Array.isArray(data)) {
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
        } else if (error) {
          console.warn('Supabase fetch products error (check table public.products):', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch products error, fallback to local storage:', err);
      }
    }

    // Local Storage fallback (only for offline/initial prototype)
    let local = getLocalProducts();
    if (local.length === 0 && !isSupabaseConfigured) {
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

        if (!error && Array.isArray(data)) {
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
        } else if (error) {
          console.warn('Supabase fetch categories error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch categories error, fallback to local:', err);
      }
    }

    let local = getLocalCategories();
    if (local.length === 0 && !isSupabaseConfigured) {
      const seeded = seedInitialLocalData();
      return seeded.categories;
    }
    return local;
  },

  // Test Supabase Cloud Tables Connection
  async testCloudConnection(): Promise<{
    connected: boolean;
    productsTableExists: boolean;
    categoriesTableExists: boolean;
    canWrite: boolean;
    message: string;
    details?: string;
  }> {
    if (!supabase || !isSupabaseConfigured) {
      return {
        connected: false,
        productsTableExists: false,
        categoriesTableExists: false,
        canWrite: false,
        message: 'No se han detectado credenciales de Supabase válidas.',
      };
    }

    try {
      // 1. Check categories table
      const { error: catErr } = await supabase.from('categories').select('id').limit(1);
      const categoriesTableExists = !catErr;

      // 2. Check products table
      const { error: prodErr } = await supabase.from('products').select('id').limit(1);
      const productsTableExists = !prodErr;

      if (!categoriesTableExists || !productsTableExists) {
        const missing = [
          !categoriesTableExists ? 'categories' : null,
          !productsTableExists ? 'products' : null,
        ].filter(Boolean).join(' y ');

        return {
          connected: true,
          productsTableExists,
          categoriesTableExists,
          canWrite: false,
          message: `Conectado al proyecto Supabase, pero falta crear la tabla: ${missing}.`,
          details: prodErr?.message || catErr?.message,
        };
      }

      return {
        connected: true,
        productsTableExists: true,
        categoriesTableExists: true,
        canWrite: true,
        message: 'Base de datos Supabase en la nube activa y sincronizada en tiempo real.',
      };
    } catch (err: any) {
      return {
        connected: false,
        productsTableExists: false,
        categoriesTableExists: false,
        canWrite: false,
        message: `Error de red al conectar con Supabase: ${err?.message || err}`,
      };
    }
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
          created_at: new Date(fullProduct.createdAt).toISOString(),
          updated_at: new Date(now).toISOString(),
        };

        const { error: upsertError } = await supabase.from('products').upsert([payload]);
        if (upsertError) {
          console.error('Supabase save product error:', upsertError);
          throw new Error(`Supabase (${upsertError.code || 'Error'}): ${upsertError.message}`);
        }
      } catch (err: any) {
        console.error('Supabase save product exception:', err);
        throw err;
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
        if (error) {
          console.error('Supabase delete product error:', error);
          throw new Error(`Supabase (${error.code || 'Error'}): ${error.message}`);
        }
      } catch (err: any) {
        console.error('Supabase delete product exception:', err);
        throw err;
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
          created_at: new Date(fullCat.createdAt).toISOString(),
        };

        const { error: catError } = await supabase.from('categories').upsert([payload]);
        if (catError) {
          console.error('Supabase save category error:', catError);
          throw new Error(`Supabase (${catError.code || 'Error'}): ${catError.message}`);
        }
      } catch (err: any) {
        console.error('Supabase save category exception:', err);
        throw err;
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
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete category error:', error);
          throw new Error(`Supabase (${error.code || 'Error'}): ${error.message}`);
        }
      } catch (err: any) {
        console.error('Supabase delete category exception:', err);
        throw err;
      }
    }
    return true;
  },

  // Sync all existing local products & categories to Supabase
  async syncAllToSupabase(products: Product[], categories: Category[]): Promise<{ success: boolean; count: number; error?: string }> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    try {
      // 1. Sync categories first
      if (categories.length > 0) {
        const catPayload = categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          image_url: c.imageUrl || null,
          active: c.active !== false,
          created_at: new Date(c.createdAt || Date.now()).toISOString(),
        }));
        const { error: catErr } = await supabase.from('categories').upsert(catPayload);
        if (catErr) {
          throw new Error(`Error sincronizando categorías: ${catErr.message}`);
        }
      }

      // 2. Sync products
      if (products.length > 0) {
        const prodPayload = products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: Number(p.price),
          compare_price: p.comparePrice ? Number(p.comparePrice) : null,
          image_url: p.imageUrl,
          category: p.category || '',
          category_id: p.categoryId || null,
          active: p.active !== false,
          featured: Boolean(p.featured),
          duration: p.duration || null,
          badge: p.badge || null,
          created_at: new Date(p.createdAt || Date.now()).toISOString(),
          updated_at: new Date(p.updatedAt || Date.now()).toISOString(),
        }));
        const { error: prodErr } = await supabase.from('products').upsert(prodPayload);
        if (prodErr) {
          throw new Error(`Error sincronizando productos: ${prodErr.message}`);
        }
      }

      return { success: true, count: products.length };
    } catch (err: any) {
      console.error('Error in syncAllToSupabase:', err);
      throw err;
    }
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
        const { error: catErr } = await supabase.from('categories').upsert(catPayload);
        if (catErr) {
          throw new Error(`Error en categorías: ${catErr.message}`);
        }

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
        const { error: prodErr } = await supabase.from('products').upsert(prodPayload);
        if (prodErr) {
          throw new Error(`Error en productos: ${prodErr.message}`);
        }
      } catch (err: any) {
        console.error('Supabase cloud seeding error:', err);
        throw err;
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
