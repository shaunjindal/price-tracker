// Tiny in-memory limiter (per IP). Enough to stop accidental or abusive spamming.
module.exports = function rateLimit({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }

  setInterval(() => {
    const now = Date.now();
    for (const [ip, h] of hits) if (h.resetAt <= now) hits.delete(ip);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const h = hits.get(req.ip);
    if (!h || h.resetAt <= now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (h.count >= max) {
      return res.status(429).json({ error: 'Too many messages sent. Please try again later.' });
    }
    h.count += 1;
    return next();
  };
};
