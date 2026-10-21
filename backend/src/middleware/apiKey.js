const crypto = require('crypto');
const { appApiKey } = require('../config/env');

// Only enforced when APP_API_KEY is set on the server.
module.exports = (req, res, next) => {
  if (!appApiKey) return next();
  const got = Buffer.from(String(req.get('x-api-key') || ''));
  const expected = Buffer.from(appApiKey);
  if (got.length === expected.length && crypto.timingSafeEqual(got, expected)) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};
