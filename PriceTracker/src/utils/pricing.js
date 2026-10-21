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

// Returns a rupee price (> 0, max 2 decimals) or null.
export function parseAmount(text) {
  const t = String(text).replace(',', '.').trim();
  if (!/^\d{1,8}(\.\d{0,2})?$/.test(t)) return null;
  const n = Number(t);
  return n > 0 ? n : null;
}

// Worker input -> custom pricing object, or an error message to show.
//   { type: 'percent', value }                         -> value % off the original price
//   { type: 'price',   value, scope: 'each'|'total' }  -> the AGREED price, per piece or for the whole item
// Empty input gives no pricing and no error.
export function buildCustomPricing({ type, text, scope }) {
  if (!String(text).trim()) return { pricing: null, error: null };

  if (type === 'percent') {
    const value = parsePercent(text);
    if (!value) return { pricing: null, error: 'Enter a percentage between 1 and 100' };
    return { pricing: { type: 'percent', value }, error: null };
  }

  const value = parseAmount(text);
  if (!value) return { pricing: null, error: 'Enter the price in rupees, like 800' };
  return { pricing: { type: 'price', value, scope }, error: null };
}
