import { applyCustomDiscount } from './pricing';
import { formatMoney } from './money';

export const MIN_QTY = 1;
export const MAX_QTY = 1000;

export const round2 = (n) => Math.round(n * 100) / 100;

// Pricing for one order line: { product, qty, customDiscount }
//
// customDiscount (worker-entered, replaces the backend discount, always based on the ORIGINAL price):
//   null
//   { type: 'percent', value: 20 }
//   { type: 'amount', value: 50,  scope: 'each' }    -> Rs 50 off every piece
//   { type: 'amount', value: 100, scope: 'total' }   -> Rs 100 off the whole item (all pieces)
// Without it the backend salePrice is used. Manual items have no discount.
export function getLinePricing({ product, qty, customDiscount: d }) {
  const price = product.price;
  const original = round2(price * qty);
  let unitPrice;
  let lineTotal;

  if (d?.type === 'percent') {
    unitPrice = applyCustomDiscount(price, d.value).salePrice;
    lineTotal = round2(unitPrice * qty);
  } else if (d?.type === 'amount' && d.scope === 'each') {
    unitPrice = Math.max(0, round2(price - d.value));
    lineTotal = round2(unitPrice * qty);
  } else if (d?.type === 'amount') {
    lineTotal = Math.max(0, round2(original - d.value));
    unitPrice = round2(lineTotal / qty); // effective price per piece (display only)
  } else {
    unitPrice = product.salePrice ?? price;
    lineTotal = round2(unitPrice * qty);
  }

  const lineSavings = round2(original - lineTotal);
  const percentOff = original > 0 ? Math.round((lineSavings / original) * 100) : 0;

  let label = null;
  if (lineSavings > 0) {
    if (d?.type === 'percent') label = `${d.value}% OFF`;
    else if (d?.type === 'amount') label = `${formatMoney(lineSavings)} OFF`;
    else label = percentOff > 0 ? `${percentOff}% OFF` : `${formatMoney(lineSavings)} OFF`;
  }

  return { unitPrice, lineTotal, lineSavings, percentOff, label, isCustom: Boolean(d) };
}

export const getLineTotal = (item) => getLinePricing(item).lineTotal;

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
// lineTotal is always sent so flat "whole item" amounts add up exactly.
export const toMessageItems = (items) =>
  items.map((item) => {
    const p = getLinePricing(item);
    const wholeItemAmount = item.customDiscount?.type === 'amount' && item.customDiscount.scope === 'total';
    return {
      name: item.product.name,
      qty: item.qty,
      unitPrice: wholeItemAmount ? item.product.price : p.unitPrice,
      originalUnitPrice: item.product.price,
      lineTotal: p.lineTotal,
    };
  });
