# RICH PRO - Catálogo de Cuentas & Suscripciones Digitales

Aplicación web profesional, de alto rendimiento y diseño moderno para la exhibición, cotización y venta de suscripciones digitales (Canva Pro Universitario, Google Gemini Pro 18 Meses, ChatGPT Plus, suites de diseño e IA) con pedidos directos vía **WhatsApp**.

---

## 🚀 Tecnologías

* **Frontend:** React 19, TypeScript, Vite
* **Estilos:** Tailwind CSS v4
* **Animaciones & Iconos:** Motion, Lucide React
* **Persistencia:** Supabase / Local Storage Store
* **Integración:** Redirección dinámica y generador de cotizaciones a WhatsApp

---

## 📋 Características Principales

### 🛍️ Tienda & Catálogo
* **Portada de Alta Conversión:** Showcase visual optimizado para afiches y banners de Canva Pro (S/ 5.00) y Google Gemini Pro 18 Meses.
* **Catálogo de Cuentas:** Filtros por categoría, ordenamiento por precio y buscador instantáneo.
* **Página de Detalle de Producto:** Visualización completa sin recortes (`object-contain`), cálculo de descuentos y botón directo de compra por WhatsApp con mensaje predeterminado.
* **Carrito de Compras / Cotizador:** Suma de productos y generación automática de pedido detallado para WhatsApp.
* **Botón Flotante de Contacto:** Enlace rápido al WhatsApp personal (`929954728`).

### 🔐 Panel Administrativo (`/admin`)
* Gestión completa de productos (CRUD: Crear, editar, activar/desactivar, destacar, eliminar).
* Gestión de categorías.
* Botón de restauración y carga del catálogo oficial de RICH PRO.

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# URL de la aplicación
VITE_APP_URL="http://localhost:3000"

# Número de WhatsApp para ventas y atención (Formato internacional sin +)
VITE_WHATSAPP_NUMBER="51929954728"

# Datos de la Tienda
VITE_STORE_NAME="RICH PRO"
VITE_CURRENCY_SYMBOL="S/"

# Supabase (Opcional - La app cuenta con fallback local)
VITE_SUPABASE_URL="https://yihkcjdgwvtfunlbocmb.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_iTkqfYNnq7SRyzlxgX5gmg_-AIc5vK7"
```

---

## 📦 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/rich-pro-catalogo.git
   cd rich-pro-catalogo
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🐙 Pasos para Subir a GitHub

### Opción 1: Exportación Directa desde Google AI Studio
1. Haz clic en el menú superior o en los **Ajustes (Settings)** de Google AI Studio.
2. Selecciona **"Export to GitHub"** (o **"Export to ZIP"** si prefieres descargarlo).
3. Conecta tu cuenta de GitHub y confirma la creación del repositorio.

---

### Opción 2: Subida Manual mediante Terminal Git

1. Abre tu terminal en la carpeta del proyecto.
2. Inicializa el repositorio Git si aún no lo has hecho:
   ```bash
   git init
   ```
3. Agrega todos los archivos al seguimiento:
   ```bash
   git add .
   ```
4. Realiza el commit inicial:
   ```bash
   git commit -m "feat: release oficial RICH PRO catalogo de cuentas"
   ```
5. Crea un nuevo repositorio vacío en [GitHub](https://github.com/new) (ejemplo: `rich-pro-catalogo`).
6. Vincula tu repositorio remoto y sube la rama principal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/tu-usuario/rich-pro-catalogo.git
   git push -u origin main
   ```

---

## 🌐 Despliegue Gratuito en Vercel o Netlify

1. Inicia sesión en [Vercel](https://vercel.com) o [Netlify](https://netlify.com).
2. Haz clic en **"Add New Project"** e importa tu repositorio de GitHub recién subido.
3. El framework se detectará automáticamente como **Vite**.
4. En **Environment Variables**, añade:
   * `VITE_WHATSAPP_NUMBER`: `51929954728`
   * `VITE_STORE_NAME`: `RICH PRO`
   * `VITE_CURRENCY_SYMBOL`: `S/`
5. Haz clic en **Deploy**. En menos de 1 minuto tu catálogo estará público en internet.

