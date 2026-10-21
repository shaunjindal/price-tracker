import { applyCustomDiscount } from './pricing';

export const MIN_QTY = 1;
export const MAX_QTY = 1000;

export const round2 = (n) => Math.round(n * 100) / 100;

// Effective unit price for one order line: { product, qty, customPercent }.
// A custom percentage (worker-entered) replaces the backend discount and is
// applied on the ORIGINAL price. Otherwise the backend salePrice is used.
// Manual items have no discount (salePrice === price).
export function getUnitPricing({ product, customPercent }) {
  if (customPercent) {
    const { salePrice, savings } = applyCustomDiscount(product.price, customPercent);
    return {
      unitPrice: salePrice,
      discount: savings > 0 ? { percentOff: customPercent, savings } : null,
      isCustom: true,
    };
  }
  return {
    unitPrice: product.salePrice ?? product.price,
    discount: product.discount ?? null,
    isCustom: false,
  };
}

export function getLineTotal(item) {
  return round2(getUnitPricing(item).unitPrice * item.qty);
}

// original = total at original prices, payable = total after all discounts
export function getOrderTotals(items) {
  let pieces = 0;
  let original = 0;
  let payable = 0;
  for (const item of items) {
    pieces += item.qty;
    original = round2(original + round2(item.product.price * item.qty));
    payable = round2(payable + getLineTotal(item));
  }
  return { lines: items.length, pieces, original, payable, savings: round2(original - payable) };
}

// Shape sent to the backend when messaging the order to a customer.
export const toMessageItems = (items) =>
  items.map((item) => ({
    name: item.product.name,
    qty: item.qty,
    unitPrice: getUnitPricing(item).unitPrice,
    originalUnitPrice: item.product.price,
  }));
