const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const { Project, Certification, Skill, Portfolio } = require('../models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Load JSON data
const loadJsonData = (filename) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
};

// Seed Projects
const seedProjects = async () => {
  try {
    const projectsData = loadJsonData('projects.json');
    if (!projectsData || !projectsData.projects) {
      console.log('No projects data found');
      return;
    }

    // Clear existing projects
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Transform projects data (remove id field, let MongoDB generate _id)
    const projects = projectsData.projects.map(project => {
      const { id, ...projectData } = project; // Remove the id field
      return {
        ...projectData,
        startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
        endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
        createdAt: projectData.createdAt ? new Date(projectData.createdAt) : new Date()
      };
    });

    // Insert projects
    const insertedProjects = await Project.insertMany(projects);
    console.log(`✅ Seeded ${insertedProjects.length} projects`);
    return insertedProjects;
  } catch (error) {
    console.error('Error seeding projects:', error);
    return [];
  }
};

// Seed Certifications
const seedCertifications = async () => {
  try {
    const certificationsData = loadJsonData('certifications.json');
    if (!certificationsData || !Array.isArray(certificationsData)) {
      console.log('No certifications data found');
      return;
    }

    // Clear existing certifications
    await Certification.deleteMany({});
    console.log('🗑️  Cleared existing certifications');

    // Transform and insert certifications
    const certifications = certificationsData.map(cert => {
      // Map category values to match enum constraints
      let category = cert.category || 'Programming';
      if (category === 'Full Stack') category = 'Programming';
      if (category === 'Web Development') category = 'Frontend';
      if (category === 'Data Science') category = 'Programming';
      if (category === 'Development Tools') category = 'DevOps';
      
      const { id, ...certData } = cert; // Remove the id field
      return {
        ...certData,
        issueDate: new Date(cert.issueDate),
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
        skills: cert.skills || [],
        badge: cert.badge || '🏅',
        status: cert.status || 'active',
        category: category,
        featured: cert.featured || false
      };
    });

    const insertedCerts = await Certification.insertMany(certifications);
    console.log(`✅ Seeded ${insertedCerts.length} certifications`);
    return insertedCerts;
  } catch (error) {
    console.error('Error seeding certifications:', error);
  }
};

// Seed Skills (extracted from projects and certifications)
const seedSkills = async (projects, certifications) => {
  try {
    // Extract unique skills from projects and certifications
    const skillsSet = new Set();
    
    // From projects
    if (projects) {
      projects.forEach(project => {
        if (project.technologies) {
          project.technologies.forEach(tech => skillsSet.add(tech));
        }
      });
    }

    // From certifications
    if (certifications) {
      certifications.forEach(cert => {
        if (cert.skills) {
          cert.skills.forEach(skill => skillsSet.add(skill));
        }
      });
    }

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('🗑️  Cleared existing skills');

    // Create skill objects
    const skills = Array.from(skillsSet).map(skillName => {
      // Categorize skills based on name
      let category = 'Other';
      const lowerSkill = skillName.toLowerCase();
      
      if (['html', 'css', 'javascript', 'react', 'vue', 'angular', 'typescript'].includes(lowerSkill)) {
        category = 'Frontend';
      } else if (['node.js', 'express', 'python', 'django', 'flask', 'php', 'java'].includes(lowerSkill)) {
        category = 'Backend';
      } else if (['mongodb', 'mysql', 'postgresql', 'redis', 'sqlite'].includes(lowerSkill)) {
        category = 'Database';
      } else if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins'].includes(lowerSkill)) {
        category = 'DevOps';
      } else if (['react native', 'flutter', 'android', 'ios', 'kotlin', 'swift'].includes(lowerSkill)) {
        category = 'Mobile';
      } else if (['git', 'github', 'vscode', 'figma', 'postman'].includes(lowerSkill)) {
        category = 'Tools';
      }

      return {
        name: skillName,
        category: category,
        proficiencyLevel: Math.floor(Math.random() * 5) + 6, // Random between 6-10
        yearsOfExperience: Math.floor(Math.random() * 3) + 1, // Random between 1-3
        featured: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Python'].includes(skillName)
      };
    });

    const insertedSkills = await Skill.insertMany(skills);
    console.log(`✅ Seeded ${insertedSkills.length} skills`);
    return insertedSkills;
  } catch (error) {
    console.error('Error seeding skills:', error);
  }
};

// Seed Portfolio Info
const seedPortfolio = async () => {
  try {
    // Clear existing portfolio
    await Portfolio.deleteMany({});
    console.log('🗑️  Cleared existing portfolio');

    // Create default portfolio
    const portfolioData = {
      personalInfo: {
        name: 'Hemanth',
        title: 'Full Stack Developer',
        email: 'hemanth@example.com',
        phone: '+1-234-567-8900',
        location: 'Your City, Your Country',
        bio: 'Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through code.',
        profileImage: '/api/placeholder/300/300'
      },
      socialLinks: {
        github: 'https://github.com/hemanth',
        linkedin: 'https://linkedin.com/in/hemanth',
        twitter: 'https://twitter.com/hemanth',
        portfolio: 'https://hemanth-portfolio.com',
        resume: '/resume.pdf'
      },
      experience: [
        {
          title: 'Full Stack Developer',
          company: 'Tech Company',
          location: 'City, Country',
          startDate: new Date('2023-01-01'),
          current: true,
          description: 'Developing web applications using modern technologies',
          technologies: ['React.js', 'Node.js', 'MongoDB', 'Express.js']
        }
      ],
      education: [
        {
          degree: 'Bachelor of Technology',
          institution: 'Your University',
          location: 'City, Country',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2024-01-01'),
          description: 'Computer Science and Engineering'
        }
      ],
      settings: {
        isPublic: true,
        theme: 'light',
        showEmail: true,
        showPhone: true
      }
    };

    const portfolio = await Portfolio.create(portfolioData);
    console.log('✅ Seeded portfolio information');
    return portfolio;
  } catch (error) {
    console.error('Error seeding portfolio:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const projects = await seedProjects();
    const certifications = await seedCertifications();
    const skills = await seedSkills(projects, certifications);
    const portfolio = await seedPortfolio();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Projects: ${projects?.length || 0}`);
    console.log(`- Certifications: ${certifications?.length || 0}`);
    console.log(`- Skills: ${skills?.length || 0}`);
    console.log(`- Portfolio: ${portfolio ? 1 : 0}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };