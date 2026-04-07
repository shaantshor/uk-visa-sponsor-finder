const pool = require('../config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id SERIAL PRIMARY KEY,
        organisation_name VARCHAR(500) NOT NULL,
        city VARCHAR(255),
        county VARCHAR(255),
        type_rating VARCHAR(100),
        route VARCHAR(100),
        industry VARCHAR(255),
        sub_industry VARCHAR(255),
        company_size VARCHAR(50),
        founded_year INTEGER,
        website TEXT,
        careers_page TEXT,
        glassdoor_rating DECIMAL(2,1),
        tech_stack TEXT[],
        description TEXT,
        is_tech BOOLEAN DEFAULT false,
        hq_city VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS search_logs (
        id SERIAL PRIMARY KEY,
        query TEXT,
        filters JSONB,
        result_count INTEGER,
        searched_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_sponsors_name_trgm ON sponsors USING GIN (organisation_name gin_trgm_ops)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sponsors_city ON sponsors(city)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sponsors_industry ON sponsors(industry)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sponsors_is_tech ON sponsors(is_tech)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_sponsors_route ON sponsors(route)');

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
