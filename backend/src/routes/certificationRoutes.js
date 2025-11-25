const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');

// @route   GET /api/certifications
// @desc    Get all certifications with optional filtering
// @access  Public
// @params  Query: ?category=Frontend&provider=Udemy&status=active
router.get('/', certificationController.getAllCertifications);

// @route   GET /api/certifications/featured
// @desc    Get featured certifications
// @access  Public
router.get('/featured', certificationController.getFeaturedCertifications);

// @route   GET /api/certifications/stats
// @desc    Get certification statistics and analytics
// @access  Public
router.get('/stats', certificationController.getCertificationStats);

// @route   GET /api/certifications/category/:category
// @desc    Get certifications by specific category
// @access  Public
// @params  category: Frontend, Backend, Full Stack, Programming, Development Tools
router.get('/category/:category', certificationController.getCertificationsByCategory);

// @route   GET /api/certifications/:id
// @desc    Get single certification by ID
// @access  Public
router.get('/:id', certificationController.getCertificationById);

// Future: POST endpoint for creating certifications (admin functionality)

module.exports = router;