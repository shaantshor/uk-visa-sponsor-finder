const pool = require('../config/db');

async function getSponsors(req, res, next) {
  try {
    const {
      search,
      city,
      industry,
      is_tech,
      company_size,
      page = 1,
      limit = 20,
      sort = 'organisation_name',
      order = 'asc',
    } = req.query;

    const allowedSorts = ['organisation_name', 'city', 'industry', 'founded_year', 'glassdoor_rating', 'company_size'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'organisation_name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(organisation_name ILIKE '%' || $${paramIndex} || '%' OR similarity(organisation_name, $${paramIndex}) > 0.1)`);
      params.push(search);
      paramIndex++;
    }

    if (city) {
      conditions.push(`city = $${paramIndex}`);
      params.push(city);
      paramIndex++;
    }

    if (industry) {
      conditions.push(`industry = $${paramIndex}`);
      params.push(industry);
      paramIndex++;
    }

    if (is_tech === 'true' || is_tech === 'false') {
      conditions.push(`is_tech = $${paramIndex}`);
      params.push(is_tech === 'true');
      paramIndex++;
    }

    if (company_size) {
      conditions.push(`company_size = $${paramIndex}`);
      params.push(company_size);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM sponsors ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    let orderClause;
    if (search) {
      const searchParamIdx = 1;
      orderClause = `ORDER BY similarity(organisation_name, $${searchParamIdx}) DESC, ${sortCol} ${sortOrder}`;
    } else {
      orderClause = `ORDER BY ${sortCol} ${sortOrder}`;
    }

    params.push(limitNum);
    params.push(offset);

    const result = await pool.query(
      `SELECT * FROM sponsors ${whereClause} ${orderClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    if (search) {
      pool.query(
        'INSERT INTO search_logs (query, filters, result_count) VALUES ($1, $2, $3)',
        [search, JSON.stringify({ city, industry, is_tech, company_size }), total]
      ).catch(() => {});
    }

    res.json({
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getSponsorById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sponsors WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getSimilarCompanies(req, res, next) {
  try {
    const { id } = req.params;
    const sponsorResult = await pool.query('SELECT * FROM sponsors WHERE id = $1', [id]);

    if (sponsorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    const sponsor = sponsorResult.rows[0];

    const result = await pool.query(
      `SELECT *,
        (CASE WHEN industry = $2 THEN 2 ELSE 0 END) +
        (CASE WHEN city = $3 THEN 1 ELSE 0 END) +
        (CASE WHEN company_size = $4 THEN 1 ELSE 0 END) as relevance
      FROM sponsors
      WHERE id != $1
      ORDER BY relevance DESC, organisation_name ASC
      LIMIT 6`,
      [id, sponsor.industry, sponsor.city, sponsor.company_size]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getCities(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT city, COUNT(*)::int as count FROM sponsors GROUP BY city ORDER BY count DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getIndustries(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT industry, COUNT(*)::int as count FROM sponsors GROUP BY industry ORDER BY count DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getTrending(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT query, COUNT(*)::int as count FROM search_logs GROUP BY query ORDER BY count DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSponsors,
  getSponsorById,
  getSimilarCompanies,
  getCities,
  getIndustries,
  getTrending,
};
