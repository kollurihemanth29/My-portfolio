const mongoose = require('mongoose');
const Project = require('./src/models/Project');
require('dotenv').config();

// Test the MongoDB connection and fetch projects
const testProjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Fetch all projects
    const allProjects = await Project.find();
    console.log(`\n📊 Total Projects in Database: ${allProjects.length}`);

    // Fetch featured projects
    const featuredProjects = await Project.find({ featured: true });
    console.log(`\n⭐ Featured Projects: ${featuredProjects.length}`);

    // Display project details
    console.log('\n🚀 Projects in Database:');
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`);
      console.log(`   Description: ${project.description.substring(0, 100)}...`);
      console.log(`   Technologies: ${project.technologies.join(', ')}`);
      console.log(`   Featured: ${project.featured ? '⭐ Yes' : 'No'}`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Category: ${project.category}`);
      console.log(`   Created: ${project.createdAt.toDateString()}`);
      console.log('   ---');
    });

    // Test different queries
    console.log('\n🔍 Testing Queries:');
    
    // Get web projects
    const webProjects = await Project.find({ category: 'web' });
    console.log(`Web Projects: ${webProjects.length}`);

    // Get completed projects
    const completedProjects = await Project.find({ status: 'completed' });
    console.log(`Completed Projects: ${completedProjects.length}`);

    // Get in-progress projects
    const inProgressProjects = await Project.find({ status: 'in-progress' });
    console.log(`In-Progress Projects: ${inProgressProjects.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testProjects();