const Certification = require('../models/Certification');
const logger = require('../../utils/logger');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getAllCertifications = async (req, res) => {
  try {
    const { category, provider, status, featured, limit } = req.query;
    
    // Build query
    let query = {};
    if (category) query.category = new RegExp(category, 'i');
    if (provider) query.provider = new RegExp(provider, 'i');
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';
    
    // Execute query with sorting
    let certificationsQuery = Certification.find(query).sort({ issueDate: -1 });
    
    if (limit) {
      certificationsQuery = certificationsQuery.limit(parseInt(limit));
    }
    
    const certifications = await certificationsQuery;

    res.json({
      success: true,
      count: certifications.length,
      data: certifications
    });

    logger.info(`Retrieved ${certifications.length} certifications`);
  } catch (error) {
    logger.error('Error in getAllCertifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single certification by ID
// @route   GET /api/certifications/:id
// @access  Public
const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    res.json({
      success: true,
      data: certification
    });

    logger.info(`Retrieved certification: ${certification.title}`);
  } catch (error) {
    logger.error('Error in getCertificationById:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get certifications by category
// @route   GET /api/certifications/category/:category
// @access  Public
const getCertificationsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    
    const certifications = await Certification.find({
      category: new RegExp(category, 'i')
    }).sort({ issueDate: -1 });

    if (certifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No certifications found in category: ${category}`
      });
    }

    res.json({
      success: true,
      category: category,
      count: certifications.length,
      data: certifications
    });

    logger.info(`Retrieved ${certifications.length} certifications for category: ${category}`);
  } catch (error) {
    logger.error('Error in getCertificationsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get featured certifications
// @route   GET /api/certifications/featured
// @access  Public
const getFeaturedCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({ featured: true }).sort({ issueDate: -1 });
    
    res.json({
      success: true,
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    logger.error('Error in getFeaturedCertifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get certification statistics
// @route   GET /api/certifications/stats
// @access  Public
const getCertificationStats = async (req, res) => {
  try {
    const certifications = await Certification.find();
    
    // Calculate statistics
    const stats = {
      total: certifications.length,
      active: certifications.filter(cert => cert.status === 'active').length,
      categories: {},
      providers: {},
      recentCertifications: certifications.filter(cert => {
        const certDate = new Date(cert.issueDate);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return certDate >= sixMonthsAgo;
      }).length,
      skillsCovered: [...new Set(certifications.flatMap(cert => cert.skills))].length
    };

    // Count by categories
    certifications.forEach(cert => {
      stats.categories[cert.category] = (stats.categories[cert.category] || 0) + 1;
    });

    // Count by providers
    certifications.forEach(cert => {
      stats.providers[cert.provider] = (stats.providers[cert.provider] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });

    logger.info('Retrieved certification statistics');
  } catch (error) {
    logger.error('Error in getCertificationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Future: Create certification endpoint (admin functionality)

module.exports = {
  getAllCertifications,
  getCertificationById,
  getCertificationsByCategory,
  getFeaturedCertifications,
  getCertificationStats
};