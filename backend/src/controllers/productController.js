const productService = require('../services/productService');

// GET /api/products?q=cotton&category=bedsheets&subcategory=cotton
exports.list = (req, res) => {
  const { q, category, subcategory } = req.query;
  const items = productService.search({ q, category, subcategory });
  res.json({ total: items.length, items });
};

// GET /api/products/:id
exports.getById = (req, res) => {
  const product = productService.getById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};
