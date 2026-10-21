const orderService = require('../services/orderService');
const HttpError = require('../utils/httpError');

// POST /api/orders/whatsapp   { phone: "9876543210", items: [{ name, qty, unitPrice, originalUnitPrice }] }
exports.sendWhatsApp = async (req, res) => {
  try {
    const out = await orderService.sendOrderOnWhatsApp({
      phone: req.body?.phone,
      items: req.body?.items,
    });
    res.json({ ok: true, ...out });
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
