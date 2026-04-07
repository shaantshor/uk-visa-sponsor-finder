const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/config/db');

afterAll(async () => {
  await pool.end();
});

describe('Sponsors API', () => {
  describe('GET /api/sponsors', () => {
    it('should return paginated sponsors with default pagination', async () => {
      const res = await request(app).get('/api/sponsors');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('limit', 20);
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('totalPages');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search sponsors by exact name', async () => {
      const res = await request(app).get('/api/sponsors?search=Google');
      expect(res.status).toBe(200);
      const names = res.body.data.map(s => s.organisation_name.toLowerCase());
      expect(names.some(n => n.includes('google'))).toBe(true);
    });

    it('should find sponsors with fuzzy search', async () => {
      const res = await request(app).get('/api/sponsors?search=gogle');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter sponsors by city', async () => {
      const res = await request(app).get('/api/sponsors?city=London');
      expect(res.status).toBe(200);
      res.body.data.forEach(sponsor => {
        expect(sponsor.city).toBe('London');
      });
    });

    it('should filter sponsors by industry', async () => {
      const res = await request(app).get('/api/sponsors?industry=Technology');
      expect(res.status).toBe(200);
      res.body.data.forEach(sponsor => {
        expect(sponsor.industry).toBe('Technology');
      });
    });

    it('should filter tech companies', async () => {
      const res = await request(app).get('/api/sponsors?is_tech=true');
      expect(res.status).toBe(200);
      res.body.data.forEach(sponsor => {
        expect(sponsor.is_tech).toBe(true);
      });
    });

    it('should filter by company size', async () => {
      const res = await request(app).get('/api/sponsors?company_size=enterprise');
      expect(res.status).toBe(200);
      res.body.data.forEach(sponsor => {
        expect(sponsor.company_size).toBe('enterprise');
      });
    });

    it('should support combined filters', async () => {
      const res = await request(app).get('/api/sponsors?search=bank&city=London&is_tech=true');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      res.body.data.forEach(sponsor => {
        expect(sponsor.city).toBe('London');
        expect(sponsor.is_tech).toBe(true);
      });
    });
  });

  describe('GET /api/sponsors/:id', () => {
    it('should return a single sponsor by id', async () => {
      const listRes = await request(app).get('/api/sponsors?limit=1');
      const id = listRes.body.data[0].id;
      const res = await request(app).get(`/api/sponsors/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', id);
      expect(res.body).toHaveProperty('organisation_name');
    });

    it('should return 404 for non-existent sponsor', async () => {
      const res = await request(app).get('/api/sponsors/99999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Sponsor not found');
    });
  });

  describe('GET /api/sponsors/:id/similar', () => {
    it('should return similar companies', async () => {
      const listRes = await request(app).get('/api/sponsors?limit=1');
      const id = listRes.body.data[0].id;
      const res = await request(app).get(`/api/sponsors/${id}/similar`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeLessThanOrEqual(6);
      res.body.forEach(sponsor => {
        expect(sponsor.id).not.toBe(id);
      });
    });
  });

  describe('GET /api/sponsors/cities', () => {
    it('should return cities with counts', async () => {
      const res = await request(app).get('/api/sponsors/cities');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('city');
      expect(res.body[0]).toHaveProperty('count');
      expect(typeof res.body[0].count).toBe('number');
    });
  });

  describe('GET /api/sponsors/industries', () => {
    it('should return industries with counts', async () => {
      const res = await request(app).get('/api/sponsors/industries');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('industry');
      expect(res.body[0]).toHaveProperty('count');
      expect(typeof res.body[0].count).toBe('number');
    });
  });

  describe('GET /api/sponsors/trending', () => {
    it('should return trending searches', async () => {
      const res = await request(app).get('/api/sponsors/trending');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Stats API', () => {
  describe('GET /api/stats', () => {
    it('should return stats with all expected fields', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('tech_count');
      expect(res.body).toHaveProperty('cities');
      expect(res.body).toHaveProperty('industries');
      expect(res.body).toHaveProperty('sizes');
      expect(typeof res.body.total).toBe('number');
      expect(typeof res.body.tech_count).toBe('number');
      expect(Array.isArray(res.body.cities)).toBe(true);
      expect(Array.isArray(res.body.industries)).toBe(true);
      expect(Array.isArray(res.body.sizes)).toBe(true);
    });
  });
});
