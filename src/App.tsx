import React, { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseService, isSupabaseConfigured } from './lib/supabase.ts';
import type { Product, Category } from './types/index.ts';
import { CartProvider } from './context/CartContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { CatalogPage } from './pages/CatalogPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('rich_pro_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Router state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Keep state synchronized with browser URL
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Data from Supabase / Local Storage
  const loadData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        supabaseService.fetchProducts(),
        supabaseService.fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Error loading Supabase catalog data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Setup Supabase Realtime Subscription if Supabase is connected
    if (supabase && isSupabaseConfigured) {
      const channel = supabase
        .channel('rich_pro_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            supabaseService.fetchProducts().then(setProducts);
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          () => {
            supabaseService.fetchCategories().then(setCategories);
          }
        )
        .subscribe();

      // Check Supabase Auth Session
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setAdminUser(data.session.user);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setAdminUser(session.user);
          localStorage.setItem('rich_pro_admin_session', JSON.stringify(session.user));
        } else if (!localStorage.getItem('rich_pro_admin_session')) {
          setAdminUser(null);
        }
      });

      return () => {
        supabase.removeChannel(channel);
        authListener?.subscription.unsubscribe();
      };
    }
  }, [loadData]);

  // Route matching
  const renderCurrentView = () => {
    // 1. Admin Route
    if (currentPath.startsWith('/admin')) {
      return (
        <AdminPage
          products={products}
          categories={categories}
          isLoadingData={isLoading}
          onNavigate={navigate}
          onDataChanged={loadData}
          adminUser={adminUser}
          setAdminUser={setAdminUser}
        />
      );
    }

    // 2. Product Detail Route (/productos/:id)
    if (currentPath.startsWith('/productos/')) {
      const productId = currentPath.replace('/productos/', '').split('?')[0];
      return (
        <ProductDetailPage
          productId={productId}
          products={products}
          isLoading={isLoading}
          onNavigate={navigate}
        />
      );
    }

    // 3. Catalog Route (/productos)
    if (currentPath.startsWith('/productos')) {
      const urlParams = new URLSearchParams(window.location.search);
      const initialCat = urlParams.get('categoria') || '';
      return (
        <CatalogPage
          products={products}
          categories={categories}
          isLoading={isLoading}
          onNavigate={navigate}
          initialCategory={initialCat}
        />
      );
    }

    // 4. Categories Route (/categorias)
    if (currentPath.startsWith('/categorias')) {
      return (
        <CategoriesPage
          categories={categories}
          products={products}
          isLoading={isLoading}
          onNavigate={navigate}
        />
      );
    }

    // 5. Default: Home Page (/)
    return (
      <HomePage
        products={products}
        categories={categories}
        isLoading={isLoading}
        onNavigate={navigate}
      />
    );
  };

  return (
    <ToastProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
          <Header
            currentRoute={currentPath}
            navigate={navigate}
            isAdminLoggedIn={Boolean(adminUser)}
          />

          <main className="flex-1">
            {renderCurrentView()}
          </main>

          <Footer navigate={navigate} />

          {/* Cart Drawer */}
          <CartDrawer onNavigateToCatalog={() => navigate('/productos')} />

          {/* Floating WhatsApp Action Trigger */}
          <WhatsAppFloatingButton />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}

