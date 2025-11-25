const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

// Load data files
const projectsPath = path.join(__dirname, '../data/projects.json');
const certificationsPath = path.join(__dirname, '../data/certifications.json');

const loadProjects = () => {
  try {
    const data = fs.readFileSync(projectsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error loading projects data:', error);
    return { projects: [] };
  }
};

const loadCertifications = () => {
  try {
    const data = fs.readFileSync(certificationsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error loading certifications data:', error);
    return [];
  }
};

// @desc    Get portfolio overview (projects + certifications)
// @route   GET /api/portfolio
// @access  Public
const getPortfolioOverview = async (req, res) => {
  try {
    const projectsData = loadProjects();
    const certificationsData = loadCertifications();

    // Extract featured projects
    const featuredProjects = projectsData.projects
      .filter(project => project.featured)
      .slice(0, 3);

    // Extract recent certifications
    const recentCertifications = certificationsData
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .slice(0, 3);

    // Calculate skills from both sources
    const projectSkills = [...new Set(projectsData.projects.flatMap(p => p.technologies))];
    const certificationSkills = [...new Set(certificationsData.flatMap(c => c.skills))];
    const allSkills = [...new Set([...projectSkills, ...certificationSkills])];

    // Portfolio statistics
    const stats = {
      totalProjects: projectsData.projects.length,
      completedProjects: projectsData.projects.filter(p => p.status === 'completed').length,
      totalCertifications: certificationsData.length,
      activeCertifications: certificationsData.filter(c => c.status === 'active').length,
      skillsCount: allSkills.length,
      experienceYears: calculateExperienceYears()
    };

    const portfolioData = {
      overview: {
        name: "Kolluri Hemanth",
        title: "Aspiring Full Stack Developer",
        bio: "Passionate fresher with strong fundamentals in modern web development, eager to contribute to innovative projects and grow professionally.",
        location: "India",
        status: "Open to Work"
      },
      statistics: stats,
      featuredProjects,
      recentCertifications,
      skills: allSkills,
      categories: {
        projects: getProjectCategories(projectsData.projects),
        certifications: getCertificationCategories(certificationsData)
      }
    };

    res.json({
      success: true,
      data: portfolioData
    });

    logger.info('Retrieved portfolio overview');
  } catch (error) {
    logger.error('Error in getPortfolioOverview:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get combined projects and certifications data
// @route   GET /api/portfolio/complete
// @access  Public
const getCompletePortfolio = async (req, res) => {
  try {
    const projectsData = loadProjects();
    const certificationsData = loadCertifications();

    res.json({
      success: true,
      data: {
        projects: projectsData.projects,
        certifications: certificationsData,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalItems: projectsData.projects.length + certificationsData.length,
          version: "1.0.0"
        }
      }
    });

    logger.info('Retrieved complete portfolio data');
  } catch (error) {
    logger.error('Error in getCompletePortfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Search across projects and certifications
// @route   GET /api/portfolio/search?q=searchterm
// @access  Public
const searchPortfolio = async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const projectsData = loadProjects();
    const certificationsData = loadCertifications();
    
    const searchLower = searchTerm.toLowerCase();

    // Search in projects
    const matchingProjects = projectsData.projects.filter(project => 
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchLower)) ||
      project.category.toLowerCase().includes(searchLower)
    );

    // Search in certifications
    const matchingCertifications = certificationsData.filter(cert =>
      cert.title.toLowerCase().includes(searchLower) ||
      cert.provider.toLowerCase().includes(searchLower) ||
      cert.description.toLowerCase().includes(searchLower) ||
      cert.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      cert.category.toLowerCase().includes(searchLower)
    );

    res.json({
      success: true,
      query: searchTerm,
      results: {
        projects: matchingProjects,
        certifications: matchingCertifications,
        totalMatches: matchingProjects.length + matchingCertifications.length
      }
    });

    logger.info(`Search performed for: "${searchTerm}" - ${matchingProjects.length + matchingCertifications.length} results`);
  } catch (error) {
    logger.error('Error in searchPortfolio:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
const calculateExperienceYears = () => {
  const startDate = new Date('2022-01-01'); // Adjust based on your learning start date
  const currentDate = new Date();
  const diffInYears = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffInYears * 10) / 10; // Round to 1 decimal place
};

const getProjectCategories = (projects) => {
  const categories = {};
  projects.forEach(project => {
    categories[project.category] = (categories[project.category] || 0) + 1;
  });
  return categories;
};

const getCertificationCategories = (certifications) => {
  const categories = {};
  certifications.forEach(cert => {
    categories[cert.category] = (categories[cert.category] || 0) + 1;
  });
  return categories;
};

module.exports = {
  getPortfolioOverview,
  getCompletePortfolio,
  searchPortfolio
};