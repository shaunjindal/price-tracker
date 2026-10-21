// Order state = array of lines: { product, qty, customPricing }
// customPricing: null | { type: 'percent', value } | { type: 'price', value, scope: 'each' | 'total' }
// One line per product.
export function orderReducer(items, action) {
  switch (action.type) {
    case 'SET_ITEM': {
      const line = {
        product: action.product,
        qty: action.qty,
        customPricing: action.customPricing ?? null,
      };
      const exists = items.some((i) => i.product.id === action.product.id);
      return exists
        ? items.map((i) => (i.product.id === action.product.id ? line : i))
        : [...items, line];
    }
    case 'SET_QTY':
      return items.map((i) => (i.product.id === action.id ? { ...i, qty: action.qty } : i));
    case 'SET_PRICING':
      return items.map((i) =>
        i.product.id === action.id ? { ...i, customPricing: action.customPricing ?? null } : i
      );
    case 'REMOVE':
      return items.filter((i) => i.product.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return items;
  }
}
