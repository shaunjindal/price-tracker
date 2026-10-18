const router = require('express').Router();

router.use('/categories', require('./categoryRoutes'));
router.use('/products', require('./productRoutes'));

module.exports = router;
