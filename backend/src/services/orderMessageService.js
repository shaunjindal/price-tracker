// Pure functions: validate order lines, compute totals, build message text.
const HttpError = require('../utils/httpError');

const MAX_ITEMS = 100;
const round2 = (n) => Math.round(n * 100) / 100;
const inr = (n) => {
  const x = Number(n);
  const digits = Number.isInteger(x) ? 0 : 2; // 249.5 -> ₹249.50
  return `₹${x.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: 2 })}`;
};

// WhatsApp templates reject newlines, tabs and 4+ consecutive spaces in values.
const cleanText = (value, max = 80) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

// Expects [{ name, qty, unitPrice, originalUnitPrice?, lineTotal? }]
// lineTotal is what the customer pays for the whole line. It differs from
// unitPrice x qty when a flat amount was taken off the whole item.
exports.parseItems = (raw) => {
  if (!Array.isArray(raw) || raw.length === 0) throw new HttpError(400, 'The order has no items');
  if (raw.length > MAX_ITEMS) throw new HttpError(400, `An order can have at most ${MAX_ITEMS} items`);

  return raw.map((it, idx) => {
    const n = idx + 1;
    const qty = Number(it?.qty);
    const unitPrice = Number(it?.unitPrice);
    if (!Number.isInteger(qty) || qty < 1 || qty > 1000) {
      throw new HttpError(400, `Item ${n}: quantity must be between 1 and 1000`);
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 10000000) {
      throw new HttpError(400, `Item ${n}: invalid price`);
    }
    const original = Number(it?.originalUnitPrice);
    const given = Number(it?.lineTotal);
    const lineTotal =
      it?.lineTotal !== undefined && Number.isFinite(given) && given >= 0 && given <= 1e10
        ? round2(given)
        : round2(unitPrice * qty);
    return {
      name: cleanText(it?.name) || 'Custom item',
      qty,
      unitPrice: round2(unitPrice),
      originalUnitPrice: round2(Number.isFinite(original) ? Math.max(original, unitPrice) : unitPrice),
      lineTotal,
    };
  });
};

exports.computeTotals = (items) => {
  let original = 0;
  let payable = 0;
  let pieces = 0;
  for (const i of items) {
    original = round2(original + round2(i.originalUnitPrice * i.qty));
    payable = round2(payable + i.lineTotal);
    pieces += i.qty;
  }
  return { lines: items.length, pieces, original, payable, savings: round2(original - payable) };
};

const base = (it) => round2(it.unitPrice * it.qty);

// Free-form text (works inside WhatsApp's 24-hour customer window).
exports.buildTextMessage = (items, totals, businessName) => {
  const LIMIT = 3400;
  const lines = [`*Order Summary* - ${businessName}`, ''];
  let used = lines.join('\n').length;
  let shown = 0;

  for (const [i, it] of items.entries()) {
    const b = base(it);
    let block = `${i + 1}. ${it.name}\n    ${it.qty} × ${inr(it.unitPrice)} = ${inr(b)}`;
    if (it.lineTotal < b) block += `\n    Discount -${inr(round2(b - it.lineTotal))} → ${inr(it.lineTotal)}`;
    else if (it.lineTotal > b) block = `${i + 1}. ${it.name}\n    ${it.qty} × ${inr(it.unitPrice)} = ${inr(it.lineTotal)}`;
    if (used + block.length > LIMIT) break;
    lines.push(block);
    used += block.length + 1;
    shown += 1;
  }
  if (shown < items.length) lines.push(`...and ${items.length - shown} more items`);

  lines.push('');
  if (totals.savings > 0) {
    lines.push(`Original total: ${inr(totals.original)}`);
    lines.push(`Discount: -${inr(totals.savings)}`);
  }
  lines.push(`*Total payable: ${inr(totals.payable)}*`, '', 'Thank you for shopping with us!');
  return lines.join('\n');
};

// Template variables must be single-line:  {{1}} = items, {{2}} = total payable
exports.buildTemplateParams = (items, totals) => {
  const LIMIT = 650;
  const parts = [];
  let used = 0;
  for (const [i, it] of items.entries()) {
    const b = base(it);
    let part = `${i + 1}) ${it.name} x${it.qty} @ ${inr(it.unitPrice)} = ${inr(b)}`;
    if (it.lineTotal < b) part += ` (after discount ${inr(it.lineTotal)})`;
    else if (it.lineTotal > b) part = `${i + 1}) ${it.name} x${it.qty} = ${inr(it.lineTotal)}`;
    if (used + part.length + 3 > LIMIT) break;
    parts.push(part);
    used += part.length + 3;
  }
  let itemsLine = parts.join(' | ');
  if (parts.length < items.length) itemsLine += ` | ...and ${items.length - parts.length} more items`;
  return [itemsLine, inr(totals.payable)];
};
