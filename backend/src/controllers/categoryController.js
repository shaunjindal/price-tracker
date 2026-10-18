const categoryService = require('../services/categoryService');

exports.list = (req, res) => {
  res.json(categoryService.getAll());
};
