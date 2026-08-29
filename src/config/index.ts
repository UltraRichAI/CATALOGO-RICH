// Helper to sanitize Supabase URL if full REST endpoint was entered
const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://yihkcjdgwvtfunlbocmb.supabase.co';
const cleanSupabaseUrl = rawSupabaseUrl
  ? rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
  : 'https://yihkcjdgwvtfunlbocmb.supabase.co';

export const APP_CONFIG = {
  // Supabase Configuration - Catalogo-Digital (ID: yihkcjdgwvtfunlbocmb)
  supabaseUrl: cleanSupabaseUrl,
  supabaseAnonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_iTkqfYNnq7SRyzlxgX5gmg_-AIc5vK7',
  supabaseProjectId: 'yihkcjdgwvtfunlbocmb',
  supabaseProjectName: 'Catalogo-Digital',
  
  // WhatsApp business number in international format (e.g. 51929954728 for Peru)
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '51929954728',
  
  // Store Branding & Defaults - RICH PRO
  storeName: (import.meta.env.VITE_STORE_NAME as string) || 'RICH PRO',
  storeTagline: 'Cuentas Pro, Canva Pro (Descuento Alumnos Universitarios), Gemini Pro & Suscripciones',
  currencySymbol: (import.meta.env.VITE_CURRENCY_SYMBOL as string) || 'S/',
  currencyCode: 'PEN',
  supportHours: 'Atención 24/7 • Entregas digitales inmediatas',
  location: 'Activaciones garantizadas y soporte directo vía WhatsApp',
};

