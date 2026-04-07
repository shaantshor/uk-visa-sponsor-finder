const pool = require('../config/db');

async function getStats(req, res, next) {
  try {
    const [totalResult, techResult, cityResult, industryResult, sizeResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM sponsors'),
      pool.query('SELECT COUNT(*) FROM sponsors WHERE is_tech = true'),
      pool.query('SELECT city, COUNT(*)::int as count FROM sponsors GROUP BY city ORDER BY count DESC LIMIT 10'),
      pool.query('SELECT industry, COUNT(*)::int as count FROM sponsors GROUP BY industry ORDER BY count DESC'),
      pool.query('SELECT company_size, COUNT(*)::int as count FROM sponsors GROUP BY company_size ORDER BY count DESC'),
    ]);

    res.json({
      total: parseInt(totalResult.rows[0].count),
      tech_count: parseInt(techResult.rows[0].count),
      cities: cityResult.rows,
      industries: industryResult.rows,
      sizes: sizeResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
