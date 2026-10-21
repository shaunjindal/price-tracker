import { buildCustomPricing } from './pricing';

// Typing logic for the "price per piece / discount %" boxes, kept free of UI so it can be tested.
// State: { priceText, pctText, pricing, error }
//   priceText / pctText = exactly what is shown in each box (only ever changed by the worker typing)
//   pricing             = the last valid custom pricing (or null = normal price)
const OK = {
  price: /^\d{0,8}([.,]\d{0,2})?$/,
  percent: /^\d{0,3}([.,]\d{0,2})?$/,
};

export const initialInput = (value) => ({
  priceText: value?.type === 'price' ? String(value.value) : '',
  pctText: value?.type === 'percent' ? String(value.value) : '',
  pricing: value ?? null,
  error: null,
});

export const resetInput = () => ({ priceText: '', pctText: '', pricing: null, error: null });

// Returns { state, changed }. `changed` = the pricing to apply to the order changed.
export function typeInto(state, kind, raw) {
  if (!OK[kind].test(raw)) return { state, changed: false }; // ignore characters that are not allowed
  const text = raw.replace(',', '.');
  const built = buildCustomPricing({ type: kind, text, scope: 'each' });

  const next = {
    // typing in one box clears the other, so only one way of deciding the price is ever active
    priceText: kind === 'price' ? text : '',
    pctText: kind === 'percent' ? text : '',
    pricing: state.pricing,
    error: built.error,
  };
  let changed = false;
  if (built.pricing) {
    next.pricing = built.pricing;
    changed = true;
  } else if (!text.trim()) {
    next.pricing = null; // emptied the box: back to the normal price
    changed = true;
  }
  return { state: next, changed };
}
