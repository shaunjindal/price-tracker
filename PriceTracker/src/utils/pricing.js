// UI-only helper: apply a worker-entered percentage on the ORIGINAL price.
export function applyCustomDiscount(price, percent) {
  const salePrice = Math.max(0, Math.round(price * (1 - percent / 100)));
  return { salePrice, savings: price - salePrice };
}

// Returns a valid percent (> 0 and <= 100) or null.
export function parsePercent(text) {
  const n = parseFloat(String(text).replace(',', '.'));
  return Number.isFinite(n) && n > 0 && n <= 100 ? n : null;
}
