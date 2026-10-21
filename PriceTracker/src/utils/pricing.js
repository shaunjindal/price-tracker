import { formatMoney } from './money';

const round2 = (n) => Math.round(n * 100) / 100;

// Percent discount on the ORIGINAL unit price (rounded to whole rupees).
export function applyCustomDiscount(price, percent) {
  const salePrice = Math.max(0, Math.round(price * (1 - percent / 100)));
  return { salePrice, savings: price - salePrice };
}

// Returns a valid percent (> 0 and <= 100) or null.
export function parsePercent(text) {
  const n = parseFloat(String(text).replace(',', '.'));
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : null;
}

// Returns a rupee amount (> 0, max 2 decimals) or null.
export function parseAmount(text) {
  const t = String(text).replace(',', '.').trim();
  if (!/^\d{1,8}(\.\d{0,2})?$/.test(t)) return null;
  const n = Number(t);
  return n > 0 ? n : null;
}

// Worker input -> discount object, or an error message to show.
//   { type: 'percent', value }
//   { type: 'amount',  value, scope: 'each' | 'total' }   (each piece / whole item)
// Empty input gives no discount and no error.
export function buildDiscount({ type, text, scope }, product, qty) {
  if (!String(text).trim()) return { discount: null, error: null };

  if (type === 'percent') {
    const value = parsePercent(text);
    if (!value) return { discount: null, error: 'Enter a percentage between 1 and 100' };
    return { discount: { type: 'percent', value }, error: null };
  }

  const value = parseAmount(text);
  if (!value) return { discount: null, error: 'Enter an amount in rupees, like 50' };
  const max = scope === 'each' ? product.price : round2(product.price * qty);
  if (value > max) {
    return { discount: null, error: `Discount cannot be more than ${formatMoney(max)}` };
  }
  return { discount: { type: 'amount', value, scope }, error: null };
}
