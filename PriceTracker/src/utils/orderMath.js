import { applyCustomDiscount } from './pricing';
import { formatMoney } from './money';

export const MIN_QTY = 1;
export const MAX_QTY = 1000;

export const round2 = (n) => Math.round(n * 100) / 100;

// Pricing for one order line: { product, qty, customPricing }
//
// customPricing (set by the worker, replaces the backend price):
//   null                                              -> backend salePrice is used
//   { type: 'percent', value: 20 }                    -> 20% off the ORIGINAL price
//   { type: 'price', value: 800,  scope: 'each' }     -> final price: Rs 800 per piece
//   { type: 'price', value: 3200, scope: 'total' }    -> final price: Rs 3200 for the whole item
// Manual items never have customPricing.
export function getLinePricing({ product, qty, customPricing: cp }) {
  const price = product.price;
  const original = round2(price * qty);
  let unitPrice;
  let lineTotal;

  if (cp?.type === 'percent') {
    unitPrice = applyCustomDiscount(price, cp.value).salePrice;
    lineTotal = round2(unitPrice * qty);
  } else if (cp?.type === 'price' && cp.scope === 'total') {
    lineTotal = round2(cp.value);
    unitPrice = round2(cp.value / qty); // effective price per piece (display only)
  } else if (cp?.type === 'price') {
    unitPrice = round2(cp.value);
    lineTotal = round2(unitPrice * qty);
  } else {
    unitPrice = product.salePrice ?? price;
    lineTotal = round2(unitPrice * qty);
  }

  // positive = cheaper than the catalogue price, negative = dearer
  const lineSavings = round2(original - lineTotal);
  const percentOff = original > 0 ? Math.round((lineSavings / original) * 100) : 0;

  let label = null;
  if (cp?.type === 'price') label = 'NEW PRICE';
  else if (lineSavings > 0) {
    if (cp?.type === 'percent') label = `${cp.value}% OFF`;
    else label = percentOff > 0 ? `${percentOff}% OFF` : `${formatMoney(lineSavings)} OFF`;
  }

  return { unitPrice, lineTotal, lineSavings, percentOff, label, kind: cp?.type ?? null, isCustom: Boolean(cp) };
}

// The three numbers shown in the price table, always consistent with each other:
//   each = price per piece, total = price for the whole item, percent = % off the ORIGINAL price
export function deriveFields(product, qty, customPricing) {
  const p = getLinePricing({ product, qty, customPricing });
  const original = round2(product.price * qty);
  const percent = original > 0 ? (1 - p.lineTotal / original) * 100 : 0;
  return { each: p.unitPrice, total: p.lineTotal, percent };
}

export const getLineTotal = (item) => getLinePricing(item).lineTotal;

// original = total at catalogue prices, payable = what the customer pays.
// savings > 0: cheaper than catalogue, savings < 0: some final prices are above the catalogue price.
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
// lineTotal is always sent so a price agreed for the whole item adds up exactly.
export const toMessageItems = (items) =>
  items.map((item) => {
    const p = getLinePricing(item);
    return {
      name: item.product.name,
      qty: item.qty,
      unitPrice: p.unitPrice,
      originalUnitPrice: item.product.price,
      lineTotal: p.lineTotal,
    };
  });
