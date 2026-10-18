const products = require('../data/products');

const matchesKeywords = (product, q) => {
  // every word typed must appear somewhere in name, description or detail values
  const haystack = [
    product.name,
    product.description,
    ...Object.values(product.details),
  ]
    .join(' ')
    .toLowerCase();

  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
};

exports.search = ({ q, category, subcategory } = {}) => {
  return products.filter((p) => {
    if (category && p.categoryId !== category) return false;
    if (subcategory && p.subcategoryId !== subcategory) return false;
    if (q && !matchesKeywords(p, q)) return false;
    return true;
  });
};

exports.getById = (id) => products.find((p) => p.id === id);
