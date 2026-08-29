import { APP_CONFIG } from '../config/index.ts';
import { formatCurrency } from './formatters.ts';
import type { CartItem, Product } from '../types/index.ts';

/**
 * Normaliza y limpia el número de WhatsApp garantizando el código de país (51 para Perú si tiene 9 dígitos)
 */
export const getCleanWhatsAppNumber = (number = APP_CONFIG.whatsappNumber): string => {
  let cleaned = number.replace(/[^0-9]/g, '');
  // Si ingresaron un número de 9 dígitos peruano sin prefijo de país, agregar 51
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    cleaned = `51${cleaned}`;
  }
  return cleaned || '51929954728';
};

/**
 * Genera el enlace de WhatsApp para consultar un producto individual
 */
export const getProductWhatsAppUrl = (
  product: Product,
  customNumber = APP_CONFIG.whatsappNumber,
  isStudent = false
): string => {
  const number = getCleanWhatsAppNumber(customNumber);
  const formattedPrice = formatCurrency(product.price);
  const isCanva = product.name.toLowerCase().includes('canva');
  
  const message = [
    `Hola ${APP_CONFIG.storeName}, estoy interesado en adquirir:`,
    '',
    `📌 *${product.name}*`,
    `💰 Precio: *${formattedPrice}*`,
    isCanva || isStudent ? `🎓 *Aplica Descuento de Alumno Universitario* (S/ 5.00)` : '',
    product.category ? `🏷️ Categoría: ${product.category}` : '',
    '',
    `¿Me pueden brindar los métodos de pago y pasos para la activación inmediata? Muchas gracias.`
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

/**
 * Genera el enlace de WhatsApp para consultar los productos del Carrito
 */
export const getCartWhatsAppUrl = (
  items: CartItem[],
  customNumber = APP_CONFIG.whatsappNumber
): string => {
  const number = getCleanWhatsAppNumber(customNumber);
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const productLines = items.map(
    (item, index) =>
      `• *${item.product.name}* (x${item.quantity}) — ${formatCurrency(item.product.price * item.quantity)}`
  );

  const message = [
    `Hola ${APP_CONFIG.storeName}, quisiera hacer una consulta sobre estos productos de mi pedido:`,
    '',
    ...productLines,
    '',
    `💳 *Total Estimado:* *${formatCurrency(total)}*`,
    '',
    `Quisiera confirmar stock, disponibilidad y detalles para concretar la compra. ¡Muchas gracias!`
  ].join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

/**
 * Enlace directo de consulta general a WhatsApp
 */
export const getGeneralWhatsAppUrl = (
  customMessage?: string,
  customNumber = APP_CONFIG.whatsappNumber
): string => {
  const number = getCleanWhatsAppNumber(customNumber);
  const text =
    customMessage ||
    `Hola ${APP_CONFIG.storeName}, quisiera más información sobre el catálogo y productos disponibles.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};
