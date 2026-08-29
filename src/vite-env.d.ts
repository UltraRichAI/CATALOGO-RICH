/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSTANT_APP_ID?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_CURRENCY_SYMBOL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
