const limits = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 100;

  if (!limits.has(ip)) {
    limits.set(ip, []);
  }

  const timestamps = limits.get(ip).filter(t => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }

  timestamps.push(now);
  limits.set(ip, timestamps);
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of limits) {
    const recent = timestamps.filter(t => now - t < 60000);
    if (recent.length === 0) limits.delete(ip);
    else limits.set(ip, recent);
  }
}, 300000).unref();

module.exports = rateLimit;
