const router = require('express').Router();

router.use('/categories', require('./categoryRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));

module.exports = router;
