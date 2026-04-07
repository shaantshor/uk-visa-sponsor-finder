const express = require('express');
const router = express.Router();
const {
  getSponsors,
  getSponsorById,
  getSimilarCompanies,
  getCities,
  getIndustries,
  getTrending,
} = require('../controllers/sponsors.controller');

router.get('/cities', getCities);
router.get('/industries', getIndustries);
router.get('/trending', getTrending);
router.get('/:id/similar', getSimilarCompanies);
router.get('/:id', getSponsorById);
router.get('/', getSponsors);

module.exports = router;
