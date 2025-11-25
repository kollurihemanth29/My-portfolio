const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// @route   GET /api/portfolio
// @desc    Get portfolio overview with featured projects and recent certifications
// @access  Public
router.get('/', portfolioController.getPortfolioOverview);

// @route   GET /api/portfolio/complete
// @desc    Get complete portfolio data (all projects + all certifications)
// @access  Public
router.get('/complete', portfolioController.getCompletePortfolio);

// @route   GET /api/portfolio/search
// @desc    Search across projects and certifications
// @access  Public
// @params  Query: ?q=searchterm
router.get('/search', portfolioController.searchPortfolio);

module.exports = router;