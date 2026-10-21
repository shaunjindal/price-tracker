const router = require('express').Router();
const controller = require('../controllers/orderController');
const apiKey = require('../middleware/apiKey');
const rateLimit = require('../middleware/rateLimit');

router.post(
  '/whatsapp',
  apiKey,
  rateLimit({ windowMs: 60 * 60 * 1000, max: 100 }), // 100 sends per IP per hour
  controller.sendWhatsApp
);

module.exports = router;
