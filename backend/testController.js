// Test project controller loading
const mongoose = require('mongoose');
require('dotenv').config();

const testController = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Try to load the Project model
    const Project = require('./src/models/Project');
    console.log('✅ Project model loaded successfully');

    // Try to fetch projects
    const projects = await Project.find();
    console.log(`✅ Found ${projects.length} projects`);

    // Try to load the controller
    const projectController = require('./src/controllers/projectController');
    console.log('✅ Project controller loaded successfully');
    
    console.log('Available controller methods:', Object.keys(projectController));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testController();