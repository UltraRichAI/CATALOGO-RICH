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
  isStudent = false,
  paymentMethod?: string,
  quantity = 1
): string => {
  const number = getCleanWhatsAppNumber(customNumber);
  const formattedPrice = formatCurrency(product.price * quantity);
  const isCanva = product.name.toLowerCase().includes('canva');
  
  const hasSavings = product.comparePrice && product.comparePrice > product.price;
  const unitSavings = hasSavings ? product.comparePrice! - product.price : 0;
  const totalSavings = unitSavings * quantity;
  const savingsPercent = hasSavings ? Math.round((unitSavings / product.comparePrice!) * 100) : 0;

  const message = [
    `Hola ${APP_CONFIG.storeName}, deseo adquirir la siguiente suscripción:`,
    '',
    `📌 *${product.name}*` + (quantity > 1 ? ` (x${quantity} unidades)` : ''),
    `💰 Total: *${formattedPrice}*` + (quantity > 1 ? ` (${formatCurrency(product.price)} c/u)` : ''),
    hasSavings
      ? `🔥 *Ahorro con RICH PRO:* ${formatCurrency(totalSavings)} (${savingsPercent}% de ahorro vs. oficial)`
      : '',
    paymentMethod ? `💳 *Método de pago preferido:* *${paymentMethod}*` : '',
    isCanva || isStudent ? `🎓 *Aplica Descuento de Alumno Universitario* (S/ 5.00)` : '',
    product.duration ? `⏳ *Duración:* ${product.duration}` : '',
    product.category ? `🏷️ *Categoría:* ${product.category}` : '',
    '',
    `¿Me pueden brindar los datos para realizar el pago por *${paymentMethod || 'Yape/Plin'}* y recibir mi activación inmediata? ¡Muchas gracias!`
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
  customNumber = APP_CONFIG.whatsappNumber,
  paymentMethod?: string
): string => {
  const number = getCleanWhatsAppNumber(customNumber);
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calculate total savings across all items
  const totalOfficial = items.reduce((acc, item) => {
    const regular = item.product.comparePrice && item.product.comparePrice > item.product.price
      ? item.product.comparePrice
      : item.product.price;
    return acc + regular * item.quantity;
  }, 0);

  const totalSavings = totalOfficial - total;
  const savingsPercent = totalOfficial > 0 ? Math.round((totalSavings / totalOfficial) * 100) : 0;

  const productLines = items.map(
    (item) =>
      `• *${item.product.name}* (x${item.quantity}) — ${formatCurrency(item.product.price * item.quantity)}`
  );

  const message = [
    `Hola ${APP_CONFIG.storeName}, deseo realizar mi pedido de las siguientes suscripciones:`,
    '',
    ...productLines,
    '',
    `💰 *Total a pagar:* *${formatCurrency(total)}*`,
    totalSavings > 0
      ? `🔥 *Ahorro Total con RICH PRO:* *${formatCurrency(totalSavings)}* (${savingsPercent}% de descuento vs. oficial)`
      : '',
    paymentMethod ? `💳 *Método de pago seleccionado:* *${paymentMethod}*` : '',
    '',
    `Por favor facilítenme los datos para realizar la transferencia por *${paymentMethod || 'Yape / Plin'}* y coordinar la activación de mis accesos. ¡Muchas gracias!`
  ]
    .filter(Boolean)
    .join('\n');

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
