const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function seed() {
  const data = JSON.parse(
    fs.readFileSync(
      process.env.SEED_FILE || path.join(__dirname, '../../../data/sponsors.json'),
      'utf8'
    )
  );

  const client = await pool.connect();
  try {
    await client.query('DELETE FROM sponsors');
    await client.query('ALTER SEQUENCE sponsors_id_seq RESTART WITH 1');

    for (const s of data) {
      await client.query(
        `INSERT INTO sponsors (
          organisation_name, city, county, type_rating, route, industry,
          sub_industry, company_size, founded_year, website, careers_page,
          glassdoor_rating, tech_stack, description, is_tech, hq_city
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          s.organisation_name, s.city, s.county, s.type_rating, s.route,
          s.industry, s.sub_industry, s.company_size, s.founded_year,
          s.website, s.careers_page, s.glassdoor_rating,
          s.tech_stack || [], s.description, s.is_tech, s.hq_city
        ]
      );
    }

    console.log(`Seeded ${data.length} sponsors`);
  } catch (err) {
    console.error('Seeding failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
