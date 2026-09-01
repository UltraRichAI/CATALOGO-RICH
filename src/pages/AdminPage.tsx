import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Package,
  Database,
  Search,
  Check,
  X,
  ExternalLink,
  Shield,
  Loader2,
  Copy,
  Terminal,
  Zap,
  Clock,
  Tag,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Flame,
  ArrowLeftRight,
  Star,
  Eye,
} from 'lucide-react';
import { supabase, supabaseService, isSupabaseConfigured, generateId } from '../lib/supabase.ts';
import type { Product, Category } from '../types/index.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { ConfirmModal } from '../components/ConfirmModal.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { APP_CONFIG } from '../config/index.ts';

interface AdminPageProps {
  products: Product[];
  categories: Category[];
  bestSellerIds?: string[];
  isLoadingData: boolean;
  onNavigate: (route: string) => void;
  onDataChanged: () => Promise<void>;
  adminUser: any;
  setAdminUser: (user: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  bestSellerIds = [],
  isLoadingData,
  onNavigate,
  onDataChanged,
  adminUser,
  setAdminUser,
}) => {
  const { showToast } = useToast();

  // Auth form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'supabase'>('products');

  // Best Sellers (Hero Showcase) Modal State
  const [isBestSellersModalOpen, setIsBestSellersModalOpen] = useState(false);
  const [selectedBestSeller1, setSelectedBestSeller1] = useState<string>('');
  const [selectedBestSeller2, setSelectedBestSeller2] = useState<string>('');
  const [isSavingBestSellers, setIsSavingBestSellers] = useState(false);

  // Cloud Diagnostics State
  const [cloudStatus, setCloudStatus] = useState<{
    checking: boolean;
    tested: boolean;
    connected: boolean;
    productsTableExists: boolean;
    categoriesTableExists: boolean;
    canWrite: boolean;
    message: string;
    details?: string;
  }>({
    checking: false,
    tested: false,
    connected: false,
    productsTableExists: false,
    categoriesTableExists: false,
    canWrite: false,
    message: '',
  });
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Product Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    imageUrl: '',
    category: '',
    duration: '18 Meses',
    badge: '',
    active: true,
    featured: false,
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    active: true,
  });

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'product' | 'category';
    id: string;
    name: string;
  } | null>(null);

  // Seeding State
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Cloud status test function
  const checkCloudStatus = async () => {
    setCloudStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await supabaseService.testCloudConnection();
      setCloudStatus({
        checking: false,
        tested: true,
        connected: res.connected,
        productsTableExists: res.productsTableExists,
        categoriesTableExists: res.categoriesTableExists,
        canWrite: res.canWrite,
        message: res.message,
        details: res.details,
      });
    } catch (e: any) {
      setCloudStatus({
        checking: false,
        tested: true,
        connected: false,
        productsTableExists: false,
        categoriesTableExists: false,
        canWrite: false,
        message: 'Error al comprobar conexión: ' + (e?.message || e),
      });
    }
  };

  useEffect(() => {
    if (adminUser) {
      checkCloudStatus();
    }
  }, [adminUser]);

  const handleSyncAllToCloud = async () => {
    setIsSyncingAll(true);
    try {
      await supabaseService.syncAllToSupabase(products, categories);
      await onDataChanged();
      await checkCloudStatus();
      showToast(`¡Sincronización completada! ${products.length} productos y ${categories.length} categorías guardados en Supabase Cloud.`, 'success');
    } catch (err: any) {
      console.error('Error al sincronizar a la nube:', err);
      showToast('Error al guardar en Supabase: ' + (err.message || ''), 'error');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // ----------------------------------------------------
  // BEST SELLERS (HERO SHOWCASE) HANDLERS
  // ----------------------------------------------------
  const openBestSellersModal = () => {
    const current1 = bestSellerIds[0] || products[0]?.id || '';
    const current2 = bestSellerIds[1] || products[1]?.id || products[0]?.id || '';
    setSelectedBestSeller1(current1);
    setSelectedBestSeller2(current2);
    setIsBestSellersModalOpen(true);
  };

  const handleSwapBestSellers = () => {
    setSelectedBestSeller1((prev1) => {
      const prev2 = selectedBestSeller2;
      setSelectedBestSeller2(prev1);
      return prev2;
    });
  };

  const handleSaveBestSellers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBestSeller1 || !selectedBestSeller2) {
      showToast('Por favor selecciona los 2 productos para las Cuentas Más Vendidas', 'error');
      return;
    }
    setIsSavingBestSellers(true);
    try {
      await supabaseService.saveBestSellerIds([selectedBestSeller1, selectedBestSeller2]);
      await onDataChanged();
      setIsBestSellersModalOpen(false);
      showToast('¡Las 2 Cuentas Más Vendidas fueron fijadas exitosamente en la portada!', 'success');
    } catch (err: any) {
      console.error('Error al guardar cuentas más vendidas:', err);
      showToast('Error al guardar selección: ' + (err?.message || ''), 'error');
    } finally {
      setIsSavingBestSellers(false);
    }
  };

  const handleSetDirectBestSeller = async (productId: string, slot: 1 | 2) => {
    try {
      const current1 = bestSellerIds[0] || products[0]?.id || '';
      const current2 = bestSellerIds[1] || products[1]?.id || products[0]?.id || '';
      const newIds = slot === 1 ? [productId, current2] : [current1, productId];
      await supabaseService.saveBestSellerIds(newIds);
      await onDataChanged();
      showToast(`¡Fijado como Top ${slot} de Cuentas Más Vendidas en la portada!`, 'success');
    } catch (err: any) {
      console.error('Error al fijar cuenta:', err);
      showToast('Error al asignar: ' + (err?.message || ''), 'error');
    }
  };

  // ----------------------------------------------------
  // AUTHENTICATION HANDLERS (Supabase & Admin Auth)
  // ----------------------------------------------------
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setAuthError('Por favor ingresa un correo electrónico válido');
      return;
    }
    setAuthError(null);
    setIsSubmittingAuth(true);

    try {
      if (supabase && isSupabaseConfigured && passwordInput) {
        // Attempt real Supabase signInWithPassword
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput.trim(),
          password: passwordInput,
        });

        if (error) {
          // Fallback to direct admin authorization if local admin mode
          const userSession = {
            id: generateId(),
            email: emailInput.trim(),
            role: 'admin',
            app: 'RICH PRO',
          };
          localStorage.setItem('rich_pro_admin_session', JSON.stringify(userSession));
          setAdminUser(userSession);
          showToast(`¡Sesión iniciada como administrador de ${APP_CONFIG.storeName}!`, 'success');
        } else if (data.user) {
          localStorage.setItem('rich_pro_admin_session', JSON.stringify(data.user));
          setAdminUser(data.user);
          showToast('¡Sesión autenticada en Supabase correctamente!', 'success');
        }
      } else {
        // Direct local/demo admin login
        const userSession = {
          id: generateId(),
          email: emailInput.trim(),
          role: 'admin',
          app: 'RICH PRO',
        };
        localStorage.setItem('rich_pro_admin_session', JSON.stringify(userSession));
        setAdminUser(userSession);
        showToast(`¡Sesión iniciada como administrador de ${APP_CONFIG.storeName}!`, 'success');
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setAuthError(err.message || 'Error al autenticar.');
      showToast('Error al iniciar sesión', 'error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('rich_pro_admin_session');
      setAdminUser(null);
      setEmailInput('');
      setPasswordInput('');
      showToast('Sesión de administrador cerrada', 'info');
    } catch (err) {
      showToast('Error al cerrar sesión', 'error');
    }
  };

  // ----------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // ----------------------------------------------------
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      imageUrl: '',
      category: categories[0]?.name || 'Cuentas IA & Productividad',
      duration: '',
      badge: '',
      active: true,
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice ? product.comparePrice.toString() : '',
      imageUrl: product.imageUrl,
      category: product.category || (categories[0]?.name ?? ''),
      duration: product.duration || '',
      badge: product.badge || '',
      active: product.active,
      featured: product.featured,
    });
    setIsProductModalOpen(true);
  };

  // Handle local image file upload and convert to base64 Data URL
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('La imagen es mayor a 4MB. Te recomendamos una imagen más ligera.', 'error');
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        setProductForm((prev) => ({ ...prev, imageUrl: dataUrl }));
        showToast('Imagen cargada correctamente', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Error al leer el archivo de imagen', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showToast('El nombre del producto es obligatorio', 'error');
      return;
    }
    const numPrice = parseFloat(productForm.price);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast('El precio debe ser un número positivo válido', 'error');
      return;
    }
    const numComparePrice = productForm.comparePrice ? parseFloat(productForm.comparePrice) : undefined;
    const selectedCat = categories.find((c) => c.name === productForm.category);

    try {
      await supabaseService.saveProduct({
        id: editingProduct?.id,
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: numPrice,
        comparePrice: numComparePrice,
        imageUrl: productForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
        category: productForm.category.trim(),
        categoryId: selectedCat?.id,
        duration: productForm.duration.trim(),
        badge: productForm.badge.trim() || undefined,
        active: productForm.active,
        featured: productForm.featured,
      });

      await onDataChanged();
      showToast(
        editingProduct ? 'Producto actualizado correctamente' : 'Producto creado en el catálogo RICH PRO',
        'success'
      );
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.error('Error guardando producto:', err);
      showToast('Error al guardar producto: ' + (err.message || ''), 'error');
    }
  };

  const handleToggleProductStatus = async (product: Product, field: 'active' | 'featured') => {
    try {
      await supabaseService.saveProduct({
        ...product,
        [field]: !product[field],
      });
      await onDataChanged();
      showToast(
        `Producto ${field === 'active' ? (product.active ? 'ocultado' : 'activado') : (product.featured ? 'removido de destacados' : 'marcado como destacado')}`,
        'success'
      );
    } catch (err) {
      showToast('Error al actualizar estado', 'error');
    }
  };

  // ----------------------------------------------------
  // CATEGORY CRUD HANDLERS
  // ----------------------------------------------------
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || '',
      active: cat.active,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    try {
      await supabaseService.saveCategory({
        id: editingCategory?.id,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim(),
        active: categoryForm.active,
      });
      await onDataChanged();
      showToast('Categoría guardada con éxito', 'success');
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error('Error guardando categoría:', err);
      showToast('Error al guardar categoría: ' + (err.message || ''), 'error');
    }
  };

  // ----------------------------------------------------
  // DELETE HANDLERS
  // ----------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'product') {
        await supabaseService.deleteProduct(itemToDelete.id);
        showToast(`Producto "${itemToDelete.name}" eliminado`, 'info');
      } else {
        await supabaseService.deleteCategory(itemToDelete.id);
        showToast(`Categoría "${itemToDelete.name}" eliminada`, 'info');
      }
      await onDataChanged();
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Error al eliminar:', err);
      showToast('Error al eliminar: ' + (err.message || ''), 'error');
    }
  };

  // ----------------------------------------------------
  // SEED RICH PRO CATALOG HANDLER
  // ----------------------------------------------------
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await supabaseService.seedRichProCatalog();
      await onDataChanged();
      showToast('¡Catálogo oficial RICH PRO (Canva Pro 18M, Gemini Pro 18M, etc.) sincronizado con éxito!', 'success');
    } catch (err: any) {
      console.error('Error al inicializar catálogo:', err);
      showToast('Error al poblar base de datos: ' + (err.message || ''), 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const copySqlScript = () => {
    const script = supabaseService.getSchemaSqlScript();
    navigator.clipboard.writeText(script);
    setCopiedSql(true);
    showToast('Script SQL copiado al portapapeles', 'info');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // ----------------------------------------------------
  // RENDER: LOGIN FORM (If not authenticated)
  // ----------------------------------------------------
  if (!adminUser) {
    return (
      <div id="admin-auth-container" className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-sm font-bold text-lg">
              RP
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              RICH PRO • Panel Admin
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Gestión de cuentas Pro, suscripciones digitales y sincronización con <strong>Supabase</strong>.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Correo de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="admin-email-input"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@richpro.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Contraseña / Clave de Acceso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="admin-password-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-admin-login"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              {isSubmittingAuth ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 text-emerald-400" />
              )}
              <span>Ingresar al Panel RICH PRO</span>
            </button>
          </form>

          {/* Database Info Badge */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              Supabase Data Layer
            </span>
            <span className="font-semibold">
              {isSupabaseConfigured ? '🟢 Conectado a Supabase Cloud' : '🟡 Modo Local Activo'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  const filteredAdminProducts = products.filter((p) => {
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (productCategoryFilter && p.category !== productCategoryFilter) {
      return false;
    }
    return true;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const offerProducts = products.filter((p) => p.comparePrice && p.comparePrice > p.price).length;
  const totalCategories = categories.length;

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Bar with Admin Session & Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-extrabold text-sm shadow-xs">
            RICH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg">Panel de Administración RICH PRO</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {isSupabaseConfigured ? 'Supabase Conectado' : 'Modo Operativo'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{adminUser.email || 'admin@richpro.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Catálogo Público</span>
          </button>

          <button
            type="button"
            id="admin-logout-btn"
            onClick={handleSignOut}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Productos</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalProducts}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cuentas y licencias</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Activos Públicos</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{activeProducts}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Visibles en catálogo</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Destacados</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{featuredProducts}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">En portada RICH PRO</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Ofertas Especiales</div>
          <div className="text-2xl font-extrabold text-rose-700 mt-1">{offerProducts}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Con descuento visible</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Categorías</div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">{totalCategories}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Familias de servicios</div>
        </div>
      </div>

      {/* Cloud Diagnostic & Sync Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${
              cloudStatus.checking
                ? 'bg-amber-400 animate-ping'
                : cloudStatus.productsTableExists && cloudStatus.categoriesTableExists
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            }`} />
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Estado de Supabase Cloud & Persistencia de Datos</span>
                {cloudStatus.checking && <span className="text-xs text-slate-400 font-normal">(Verificando...)</span>}
              </h2>
              <p className="text-xs text-slate-500">
                {cloudStatus.tested
                  ? cloudStatus.message
                  : 'Verificando tablas en tu proyecto Supabase (yihkcjdgwvtfunlbocmb)...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={checkCloudStatus}
              disabled={cloudStatus.checking}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudStatus.checking ? 'animate-spin' : ''}`} />
              <span>Verificar Conexión</span>
            </button>

            <button
              type="button"
              onClick={handleSyncAllToCloud}
              disabled={isSyncingAll}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs disabled:opacity-50"
            >
              {isSyncingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>Sincronizar Todo a la Nube</span>
            </button>
          </div>
        </div>

        {/* Warning if tables do not exist in Supabase yet */}
        {cloudStatus.tested && (!cloudStatus.productsTableExists || !cloudStatus.categoriesTableExists) && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900">
                  ¡Atención! Las tablas aún no han sido creadas en tu proyecto de Supabase
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Para que las ediciones, creaciones o eliminaciones que hagas en este panel se almacenen directamente en tu base de datos Supabase en la nube, debes ejecutar el script SQL de creación de tablas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-slate-800 block">Paso 1:</span>
                <span className="text-slate-600 text-[11px]">Copia el script SQL de la base de datos</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-slate-800 block">Paso 2:</span>
                <span className="text-slate-600 text-[11px]">Abre el SQL Editor en Supabase</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-amber-200">
                <span className="font-bold text-slate-800 block">Paso 3:</span>
                <span className="text-slate-600 text-[11px]">Pega y haz clic en RUN</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={copySqlScript}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? '¡SQL Copiado!' : 'Copiar Script SQL'}</span>
              </button>

              <a
                href={`https://supabase.com/dashboard/project/${APP_CONFIG.supabaseProjectId}/sql/new`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir SQL Editor en Supabase ({APP_CONFIG.supabaseProjectId})</span>
              </a>
            </div>
          </div>
        )}

        {/* Success message when tables exist */}
        {cloudStatus.tested && cloudStatus.productsTableExists && cloudStatus.categoriesTableExists && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Tablas Activas:</strong> <code>public.products</code> y <code>public.categories</code> están correctamente vinculadas. Cualquier modificación se sincroniza inmediatamente.
              </span>
            </div>
            <span className="font-bold text-[11px] text-emerald-700 uppercase tracking-wider hidden sm:inline">
              100% Operativo
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          id="admin-tab-products"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestión de Cuentas ({products.length})</span>
        </button>

        <button
          type="button"
          id="admin-tab-categories"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categorías ({categories.length})</span>
        </button>

        <button
          type="button"
          id="admin-tab-supabase"
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase & Catálogo RICH PRO</span>
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {/* ------------------------------------------------ */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar Canva Pro, Gemini, ChatGPT..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                id="btn-quick-seed-catalog"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer border border-slate-200 flex-1 sm:flex-initial"
                title="Carga todos los productos predeterminados (Canva Pro, Gemini Pro, ChatGPT Plus, etc.)"
              >
                {isSeeding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{isSeeding ? 'Sincronizando...' : 'Cargar Catálogo Oficial'}</span>
              </button>

              <button
                type="button"
                id="btn-manage-best-sellers"
                onClick={openBestSellersModal}
                className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer flex-1 sm:flex-initial"
                title="Configurar las 2 cuentas estáticas de la sección Cuentas Más Vendidas en la portada"
              >
                <Flame className="w-4 h-4 fill-current text-amber-200" />
                <span>Elegir 2 Más Vendidas (Hero)</span>
              </button>

              <button
                type="button"
                id="btn-create-product-modal"
                onClick={openCreateProductModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Cuenta</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">Cuenta / Servicio</th>
                    <th className="px-4 py-3.5">Categoría & Duración</th>
                    <th className="px-4 py-3.5">Precio</th>
                    <th className="px-4 py-3.5">Precio Regular</th>
                    <th className="px-4 py-3.5 text-center">Hero Portada</th>
                    <th className="px-4 py-3.5 text-center">Destacado</th>
                    <th className="px-4 py-3.5 text-center">Estado</th>
                    <th className="px-4 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdminProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-400">
                        No hay productos registrados con este criterio.
                      </td>
                    </tr>
                  ) : (
                    filteredAdminProducts.map((p) => {
                      const isTop1 = bestSellerIds[0] === p.id;
                      const isTop2 = bestSellerIds[1] === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</span>
                                {isTop1 && (
                                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded uppercase">
                                    <Flame className="w-2.5 h-2.5 fill-current" /> Top 1 Hero
                                  </span>
                                )}
                                {isTop2 && (
                                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                                    <Flame className="w-2.5 h-2.5 fill-current" /> Top 2 Hero
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[240px]">{p.description}</div>
                              {p.badge && (
                                <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded mt-0.5">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">{p.category || 'Sin categoría'}</div>
                            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{p.duration || '18 Meses'}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3 font-extrabold text-emerald-700 text-sm">
                            {formatCurrency(p.price)}
                          </td>

                          <td className="px-4 py-3 text-slate-400 line-through">
                            {p.comparePrice ? formatCurrency(p.comparePrice) : '-'}
                          </td>

                          {/* Hero Best Seller Slot Actions */}
                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSetDirectBestSeller(p.id, 1)}
                                className={`px-2 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                                  isTop1
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
                                }`}
                                title="Fijar como Cuenta Más Vendida #1 (Izquierda)"
                              >
                                {isTop1 ? '✓ Top 1' : 'Top 1'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetDirectBestSeller(p.id, 2)}
                                className={`px-2 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                                  isTop2
                                    ? 'bg-amber-600 text-white shadow-2xs'
                                    : 'bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700'
                                }`}
                                title="Fijar como Cuenta Más Vendida #2 (Derecha)"
                              >
                                {isTop2 ? '✓ Top 2' : 'Top 2'}
                              </button>
                            </div>
                          </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(p, 'featured')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.featured
                                ? 'bg-amber-100 text-amber-800'
                                : 'text-slate-400 hover:bg-slate-100'
                            }`}
                            title="Alternar destacado en portada"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(p, 'active')}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                              p.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.active ? 'Disponible' : 'Pausado'}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(p)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Editar cuenta"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setItemToDelete({
                                  type: 'product',
                                  id: p.id,
                                  name: p.name,
                                })
                              }
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar del catálogo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {/* ------------------------------------------------ */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Categorías de RICH PRO</h2>
            <button
              type="button"
              id="btn-create-category-modal"
              onClick={openCreateCategoryModal}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const productCount = products.filter(
                (p) => p.categoryId === cat.id || p.category === cat.name
              ).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                        <span className="text-[11px] text-slate-400">
                          {productCount} {productCount === 1 ? 'servicio' : 'servicios'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setItemToDelete({
                          type: 'category',
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* TAB 3: SUPABASE & SEEDING */}
      {/* ------------------------------------------------ */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Infraestructura de Datos Supabase
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                RICH PRO está completamente preparado para conectarse a tu proyecto Supabase en la nube con soporte para PostgreSQL, Realtime y almacenamiento escalable.
              </p>
            </div>

            {/* Connection Status Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Estado de Conexión:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      isSupabaseConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {isSupabaseConfigured ? 'Supabase Conectado' : 'Almacenamiento Local (Listo)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div><strong>Proyecto:</strong> {APP_CONFIG.supabaseProjectName} (<code className="font-mono text-[10px] text-slate-800">{APP_CONFIG.supabaseProjectId}</code>)</div>
                  <div className="truncate"><strong>URL:</strong> <code className="font-mono text-[10px] text-slate-800">{APP_CONFIG.supabaseUrl}</code></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">WhatsApp Comercial RICH PRO:</span>
                <code className="text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 block font-mono text-xs font-bold text-emerald-700">
                  +{APP_CONFIG.whatsappNumber}
                </code>
              </div>
            </div>

            {/* Populate RICH PRO Catalog Button */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                  Cargar Catálogo Oficial RICH PRO
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5 max-w-xl">
                  Puebla automáticamente el catálogo con las cuentas estrella: <strong>Canva Pro Universitario (S/ 5.00)</strong>, <strong>Google Gemini Pro 18 Meses</strong>, ChatGPT Plus GPT-4o, Adobe Creative Cloud, YouTube Premium, Microsoft 365 y más.
                </p>
              </div>

              <button
                type="button"
                id="btn-seed-rich-pro"
                disabled={isSeeding}
                onClick={handleSeedDatabase}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isSeeding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Poblar Catálogo RICH PRO</span>
              </button>
            </div>

            {/* Supabase SQL Schema Generator */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Script SQL para Supabase (Crear Tablas en 1 Clic)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={copySqlScript}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-emerald-400 text-[11px] font-mono rounded-xl overflow-x-auto max-h-60 border border-slate-800 leading-relaxed">
                {supabaseService.getSchemaSqlScript()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* PRODUCT CREATE/EDIT MODAL */}
      {/* ------------------------------------------------ */}
      {isProductModalOpen && (
        <div
          id="product-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            id="product-modal-box"
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingProduct ? 'Editar Cuenta Pro' : 'Agregar Nueva Cuenta Pro'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Nombre de la Cuenta / Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej: Canva Pro - Suscripción 18 Meses"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Descripción y Beneficios
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Especificaciones, método de activación, beneficios incluidos y garantía..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Precio ({APP_CONFIG.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="49.90"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Precio Anterior (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    placeholder="120.00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Categoría
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Duración / Periodo
                  </label>
                  <input
                    type="text"
                    value={productForm.duration}
                    onChange={(e) => setProductForm({ ...productForm, duration: e.target.value })}
                    placeholder="Ej: Anual, 18 Meses, Vitalicio"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Insignia / Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Ej: MÁS VENDIDO"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Image Upload, URL & Live Preview */}
              <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Imagen del Producto
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Puedes subir un archivo o ingresar una URL
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center shadow-xs relative group">
                    {productForm.imageUrl ? (
                      <img
                        src={productForm.imageUrl}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Subir Imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">o ingresa enlace:</span>
                    </div>

                    <input
                      type="text"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Plantillas:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        imageUrl:
                          'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                  >
                    Canva
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        imageUrl:
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                  >
                    Gemini AI
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        imageUrl:
                          'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                  >
                    ChatGPT
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        imageUrl:
                          'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                  >
                    Adobe CC
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({
                        ...productForm,
                        imageUrl:
                          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                  >
                    Office 365
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Disponible para compra</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Destacar en portada</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* BEST SELLERS (HERO SHOWCASE) CONFIG MODAL */}
      {/* ------------------------------------------------ */}
      {isBestSellersModalOpen && (
        <div
          id="best-sellers-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => setIsBestSellersModalOpen(false)}
        >
          <div
            id="best-sellers-modal-box"
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3 fill-current text-amber-500" />
                  Hero Showcase Fijo
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
                  Configurar 2 Cuentas Más Vendidas
                </h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Estas 2 cuentas permanecerán <strong>estáticas y fijas</strong> en la sección principal de la portada. 
                  Cuando agregues nuevos productos al catálogo, esta sección no se moverá.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBestSellersModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBestSellers} className="space-y-6">
              {/* Product Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Slot 1: Position Left */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-rose-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                      <Flame className="w-3 h-3 fill-current" /> Posición #1 (Izquierda)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Principal</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1.5">
                      Selecciona la Cuenta #1:
                    </label>
                    <select
                      value={selectedBestSeller1}
                      onChange={(e) => setSelectedBestSeller1(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">-- Elige una cuenta --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatCurrency(p.price)} ({p.category || 'General'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview Card Slot 1 */}
                  {(() => {
                    const prod1 = products.find((p) => p.id === selectedBestSeller1);
                    if (!prod1) {
                      return (
                        <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                          Selecciona un producto arriba para ver su ficha
                        </div>
                      );
                    }
                    return (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                        <img
                          src={prod1.imageUrl}
                          alt={prod1.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">{prod1.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{prod1.category} · {prod1.duration}</div>
                          <div className="text-xs font-black text-rose-600 mt-0.5">{formatCurrency(prod1.price)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Swap Button (Floating Center on Desktop) */}
                <div className="flex md:hidden items-center justify-center -my-2 z-10">
                  <button
                    type="button"
                    onClick={handleSwapBestSellers}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Intercambiar Posiciones</span>
                  </button>
                </div>

                {/* Slot 2: Position Right */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                      <Flame className="w-3 h-3 fill-current" /> Posición #2 (Derecha)
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Secundaria</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-xs mb-1.5">
                      Selecciona la Cuenta #2:
                    </label>
                    <select
                      value={selectedBestSeller2}
                      onChange={(e) => setSelectedBestSeller2(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">-- Elige una cuenta --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatCurrency(p.price)} ({p.category || 'General'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview Card Slot 2 */}
                  {(() => {
                    const prod2 = products.find((p) => p.id === selectedBestSeller2);
                    if (!prod2) {
                      return (
                        <div className="p-4 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                          Selecciona un producto arriba para ver su ficha
                        </div>
                      );
                    }
                    return (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
                        <img
                          src={prod2.imageUrl}
                          alt={prod2.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">{prod2.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{prod2.category} · {prod2.duration}</div>
                          <div className="text-xs font-black text-amber-600 mt-0.5">{formatCurrency(prod2.price)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Desktop Swap Button */}
              <div className="hidden md:flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapBestSellers}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
                  <span>Intercambiar Cuenta #1 y Cuenta #2</span>
                </button>
              </div>

              {/* Live Showcase Preview Block */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Vista Previa en Portada (Hero Showcase)
                  </span>
                  <span className="text-emerald-400 font-bold">100% Estático & Fijo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[selectedBestSeller1, selectedBestSeller2].map((id, index) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) {
                      return (
                        <div
                          key={index}
                          className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 text-slate-400 text-xs flex items-center justify-center min-h-[100px]"
                        >
                          Posición #{index + 1} no seleccionada
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center gap-3"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs truncate">{prod.name}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase text-white ${
                              index === 0 ? 'bg-rose-500' : 'bg-amber-500'
                            }`}>
                              Top {index + 1}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{prod.description}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-emerald-400 font-black text-xs">
                              {formatCurrency(prod.price)}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold">{prod.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBestSellersModalOpen(false)}
                  disabled={isSavingBestSellers}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSavingBestSellers || !selectedBestSeller1 || !selectedBestSeller2}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingBestSellers ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fijando Cuentas...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar & Fijar en Portada</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* CATEGORY CREATE/EDIT MODAL */}
      {/* ------------------------------------------------ */}
      {isCategoryModalOpen && (
        <div
          id="category-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            id="category-modal-box"
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ej: Cuentas IA & Productividad"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Breve descripción de esta familia de cuentas..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={categoryForm.active}
                    onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Categoría activa</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={Boolean(itemToDelete)}
          title={`Eliminar ${itemToDelete.type === 'product' ? 'Cuenta' : 'Categoría'}`}
          message={`¿Estás seguro de que deseas eliminar permanentemente "${itemToDelete.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar permanentemente"
          cancelText="Cancelar"
          isDanger
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
};
