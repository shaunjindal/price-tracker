// Order state = array of lines: { product, qty, customPercent }
// One line per product.
export function orderReducer(items, action) {
  switch (action.type) {
    case 'SET_ITEM': {
      const line = {
        product: action.product,
        qty: action.qty,
        customPercent: action.customPercent ?? null,
      };
      const exists = items.some((i) => i.product.id === action.product.id);
      return exists
        ? items.map((i) => (i.product.id === action.product.id ? line : i))
        : [...items, line];
    }
    case 'SET_QTY':
      return items.map((i) => (i.product.id === action.id ? { ...i, qty: action.qty } : i));
    case 'SET_DISCOUNT':
      return items.map((i) =>
        i.product.id === action.id ? { ...i, customPercent: action.customPercent ?? null } : i
      );
    case 'REMOVE':
      return items.filter((i) => i.product.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return items;
  }
}
