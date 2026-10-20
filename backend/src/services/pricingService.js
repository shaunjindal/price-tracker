const rules = require('../data/discounts');

const isValid = (rule) => {
  if (!rule || typeof rule !== 'object') return false;
  const value = Number(rule.value);
  if (rule.type === 'none') return true;
  if (rule.type === 'percent') return value > 0 && value <= 100;
  if (rule.type === 'amount') return value > 0;
  return false;
};

// Returns the most specific valid rule for a product, or null.
const findRule = (product) => {
  const candidates = [
    ['product', rules.products?.[product.id]],
    ['subcategory', rules.subcategories?.[`${product.categoryId}/${product.subcategoryId}`]],
    ['category', rules.categories?.[product.categoryId]],
  ];

  for (const [level, rule] of candidates) {
    if (rule === undefined) continue;
    if (!isValid(rule)) {
      console.warn(`Ignoring invalid discount rule at ${level} level:`, rule);
      continue; // fall back to the next (less specific) level
    }
    return { level, rule };
  }
  return null;
};

const noDiscount = (product) => ({ ...product, salePrice: product.price, discount: null });

// price      = original price
// salePrice  = price after slashing (what the customer pays)
// discount   = null, or { type, value, level, savings, percentOff }
exports.applyPricing = (product) => {
  const found = findRule(product);
  if (!found || found.rule.type === 'none') return noDiscount(product);

  const { level, rule } = found;
  const value = Number(rule.value);
  const raw = rule.type === 'percent' ? product.price * (1 - value / 100) : product.price - value;
  const salePrice = Math.max(0, Math.round(raw));
  const savings = product.price - salePrice;
  if (savings <= 0) return noDiscount(product);

  return {
    ...product,
    salePrice,
    discount: {
      type: rule.type,
      value,
      level,
      savings,
      percentOff: Math.round((savings / product.price) * 100),
    },
  };
};
