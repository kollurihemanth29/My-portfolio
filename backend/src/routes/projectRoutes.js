const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', projectController.getAllProjects);

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', projectController.getFeaturedProjects);

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', projectController.getProjectById);

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (for future admin functionality)
router.post('/', projectController.createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (for future admin functionality)
router.put('/:id', projectController.updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (for future admin functionality)
router.delete('/:id', projectController.deleteProject);

module.exports = router;