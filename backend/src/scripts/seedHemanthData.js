const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Project, Certification, Skill, Portfolio } = require('../models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding with Hemanth\'s resume data');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Hemanth's Projects Data
const projectsData = [
  {
    title: "MLRIT CodeHub",
    description: "Engineered a competitive coding ecosystem with React, Node.js, Express, and MongoDB supporting 1,200+ users with real-time code compilation.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Judge0 API", "JWT", "Chart.js"],
    image: "/api/placeholder/400/250",
    liveLink: "#",
    githubLink: "https://github.com/kollurihemanth/mlrit-codehub",
    featured: true,
    category: "web",
    status: "in-progress",
    startDate: new Date("2024-12-01"),
    endDate: null
  },
  {
    title: "Celebrity Recognizer",
    description: "Created a Flask + OpenCV recognition system delivering 92% accuracy on 500+ test images with wavelet transforms and SVM classifier.",
    technologies: ["Python", "Flask", "OpenCV", "Machine Learning", "SVM", "Wavelet Transforms"],
    image: "/api/placeholder/400/250",
    liveLink: "#",
    githubLink: "https://github.com/kollurihemanth/celebrity-recognizer",
    featured: true,
    category: "other",
    status: "completed",
    startDate: new Date("2024-08-01"),
    endDate: new Date("2024-09-30")
  },
  {
    title: "Analytics Dashboard",
    description: "Delivered analytics dashboards visualizing 10K+ submissions, enabling instructors to track performance trends and engagement metrics.",
    technologies: ["React", "Chart.js", "Node.js", "MongoDB", "Data Visualization"],
    image: "/api/placeholder/400/250",
    liveLink: "#",
    githubLink: "#",
    featured: false,
    category: "web",
    status: "completed",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-12-01")
  }
];

// Hemanth's Certifications Data
const certificationsData = [
  {
    title: "Joy of Computing using Python",
    provider: "NPTEL",
    issueDate: new Date("2024-11-01"),
    credentialId: "NPTEL-JOC-2024",
    credentialUrl: "#",
    skills: ["Python", "Automation", "Data Visualization", "Data Handling"],
    description: "Applied Python in automation, visualization, and data handling with comprehensive programming concepts.",
    badge: "🏅",
    status: "active",
    category: "Programming",
    featured: true
  },
  {
    title: "Smart Coder",
    provider: "Smart Interviews",
    issueDate: new Date("2025-03-01"),
    credentialId: "SI-SC-2025",
    credentialUrl: "#",
    skills: ["Data Structures", "Algorithms", "Problem Solving", "Competitive Programming"],
    description: "Completed 100+ advanced DSA problems and mock interviews focusing on algorithmic optimization.",
    badge: "🧠",
    status: "active",
    category: "Programming",
    featured: true
  },
  {
    title: "ServiceNow CSA",
    provider: "ServiceNow",
    issueDate: new Date("2025-05-01"),
    credentialId: "SNow-CSA-2025",
    credentialUrl: "#",
    skills: ["ServiceNow", "ITSM", "Workflow Automation", "System Administration"],
    description: "Automated ITSM workflows, improving operational efficiency by 30% with comprehensive ServiceNow platform knowledge.",
    badge: "⚙️",
    status: "active",
    category: "DevOps",
    featured: false
  },
  {
    title: "LeetCode Top 24% Global Rank",
    provider: "LeetCode",
    issueDate: new Date("2024-01-01"),
    credentialId: "LC-TOP24-2024",
    credentialUrl: "https://leetcode.com/kollurihemanth",
    skills: ["Algorithms", "Data Structures", "Problem Solving", "Optimization"],
    description: "Solved 160+ algorithmic challenges emphasizing optimization and competitive programming excellence.",
    badge: "🏆",
    status: "active",
    category: "Programming",
    featured: true
  }
];

// Hemanth's Skills Data
const skillsData = [
  // Programming Languages
  { name: "Python", category: "Languages", proficiencyLevel: 9, yearsOfExperience: 3, featured: true, icon: "🐍" },
  { name: "Java", category: "Languages", proficiencyLevel: 8, yearsOfExperience: 2, featured: true, icon: "☕" },
  { name: "JavaScript", category: "Languages", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "🟨" },
  { name: "C", category: "Languages", proficiencyLevel: 7, yearsOfExperience: 2, featured: false, icon: "🔧" },
  { name: "SQL", category: "Languages", proficiencyLevel: 8, yearsOfExperience: 2, featured: true, icon: "🗃️" },

  // Frontend Technologies
  { name: "React", category: "Frontend", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "⚛️" },
  { name: "HTML5", category: "Frontend", proficiencyLevel: 9, yearsOfExperience: 3, featured: false, icon: "🌐" },
  { name: "CSS3", category: "Frontend", proficiencyLevel: 8, yearsOfExperience: 3, featured: false, icon: "🎨" },
  { name: "Chart.js", category: "Frontend", proficiencyLevel: 7, yearsOfExperience: 1, featured: false, icon: "📊" },

  // Backend Technologies
  { name: "Node.js", category: "Backend", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "🟢" },
  { name: "Express", category: "Backend", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "🚂" },
  { name: "Flask", category: "Backend", proficiencyLevel: 8, yearsOfExperience: 1, featured: false, icon: "🌶️" },
  { name: "REST API", category: "Backend", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "🔗" },
  { name: "JWT", category: "Backend", proficiencyLevel: 8, yearsOfExperience: 1, featured: false, icon: "🔐" },

  // Databases
  { name: "MongoDB", category: "Database", proficiencyLevel: 9, yearsOfExperience: 2, featured: true, icon: "🍃" },
  { name: "MySQL", category: "Database", proficiencyLevel: 8, yearsOfExperience: 2, featured: true, icon: "🐬" },

  // Tools & Platforms
  { name: "Docker", category: "DevOps", proficiencyLevel: 7, yearsOfExperience: 1, featured: false, icon: "🐋" },
  { name: "Git", category: "Tools", proficiencyLevel: 9, yearsOfExperience: 3, featured: true, icon: "📝" },
  { name: "AWS", category: "Cloud", proficiencyLevel: 6, yearsOfExperience: 1, featured: false, icon: "☁️" },
  { name: "VS Code", category: "Tools", proficiencyLevel: 9, yearsOfExperience: 3, featured: false, icon: "💻" },
  { name: "Postman", category: "Tools", proficiencyLevel: 8, yearsOfExperience: 2, featured: false, icon: "📮" },
  { name: "Jupyter", category: "Tools", proficiencyLevel: 8, yearsOfExperience: 2, featured: false, icon: "📓" },

  // Machine Learning & Data Science
  { name: "Machine Learning", category: "Other", proficiencyLevel: 8, yearsOfExperience: 2, featured: true, icon: "🤖" },
  { name: "OpenCV", category: "Libraries", proficiencyLevel: 7, yearsOfExperience: 1, featured: false, icon: "👁️" },
  { name: "Pandas", category: "Libraries", proficiencyLevel: 8, yearsOfExperience: 2, featured: false, icon: "🐼" },
  { name: "Data Analysis", category: "Other", proficiencyLevel: 8, yearsOfExperience: 2, featured: true, icon: "📈" },
  { name: "SVM", category: "Other", proficiencyLevel: 7, yearsOfExperience: 1, featured: false, icon: "🧮" },

  // Specialized Skills
  { name: "Judge0 API", category: "Tools", proficiencyLevel: 8, yearsOfExperience: 1, featured: false, icon: "⚖️" },
  { name: "ServiceNow", category: "DevOps", proficiencyLevel: 7, yearsOfExperience: 1, featured: false, icon: "⚙️" },
  { name: "CI/CD", category: "DevOps", proficiencyLevel: 6, yearsOfExperience: 1, featured: false, icon: "🔄" }
];

// Hemanth's Portfolio Data
const portfolioData = {
  personalInfo: {
    name: "Kolluri Hemanth",
    title: "Full Stack and Data Science Engineer",
    email: "kolluriHemanth323@gmail.com",
    phone: "+91 7013466117",
    location: "Hyderabad, India",
    bio: "Full Stack and Data Science Engineer combining expertise in MERN stack development and analytics-driven systems design. Experienced in transforming complex data into actionable insights through optimized backend pipelines and intuitive dashboards. Architected web applications serving 1K+ users with secure authentication, RESTful APIs, and real-time execution.",
    profileImage: "/api/placeholder/300/300"
  },
  socialLinks: {
    github: "https://github.com/kollurihemanth",
    linkedin: "https://linkedin.com/in/kollurihemanth",
    portfolio: "https://kollurihemanth-portfolio.com",
    resume: "/hemanth-resume.pdf"
  },
  experience: [
    {
      title: "Full Stack Developer Intern",
      company: "MLRIT CodeHub",
      location: "Hyderabad, India",
      startDate: new Date("2024-12-01"),
      current: true,
      description: "Designed and launched a MERN-based coding platform supporting 1,200+ users with real-time code compilation. Integrated Judge0 API across six languages, cutting average response latency by 35%. Developed JWT-secured authentication with granular role access for 200+ faculty and students.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Judge0 API", "JWT"]
    }
  ],
  education: [
    {
      degree: "B.Tech in Data Science",
      institution: "MLR Institute of Technology",
      location: "Hyderabad, India",
      startDate: new Date("2022-01-01"),
      current: true,
      gpa: 9.0,
      description: "Specializing in Data Science with strong foundation in Full Stack Development"
    }
  ],
  settings: {
    isPublic: true,
    theme: "light",
    showEmail: true,
    showPhone: true
  }
};

// Seed functions
const seedProjects = async () => {
  try {
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');
    
    const projects = await Project.insertMany(projectsData);
    console.log(`✅ Seeded ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('Error seeding projects:', error);
    return [];
  }
};

const seedCertifications = async () => {
  try {
    await Certification.deleteMany({});
    console.log('🗑️  Cleared existing certifications');
    
    const certifications = await Certification.insertMany(certificationsData);
    console.log(`✅ Seeded ${certifications.length} certifications`);
    return certifications;
  } catch (error) {
    console.error('Error seeding certifications:', error);
    return [];
  }
};

const seedSkills = async () => {
  try {
    await Skill.deleteMany({});
    console.log('🗑️  Cleared existing skills');
    
    const skills = await Skill.insertMany(skillsData);
    console.log(`✅ Seeded ${skills.length} skills`);
    return skills;
  } catch (error) {
    console.error('Error seeding skills:', error);
    return [];
  }
};

const seedPortfolio = async () => {
  try {
    await Portfolio.deleteMany({});
    console.log('🗑️  Cleared existing portfolio');
    
    const portfolio = await Portfolio.create(portfolioData);
    console.log('✅ Seeded portfolio information');
    return portfolio;
  } catch (error) {
    console.error('Error seeding portfolio:', error);
    return null;
  }
};

// Main seeding function
const seedHemanthData = async () => {
  try {
    console.log('🌱 Starting Hemanth\'s portfolio database seeding...');
    
    await connectDB();
    
    const projects = await seedProjects();
    const certifications = await seedCertifications();
    const skills = await seedSkills();
    const portfolio = await seedPortfolio();
    
    console.log('🎉 Hemanth\'s portfolio database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Projects: ${projects?.length || 0}`);
    console.log(`- Certifications: ${certifications?.length || 0}`);
    console.log(`- Skills: ${skills?.length || 0}`);
    console.log(`- Portfolio: ${portfolio ? 1 : 0}`);
    
    console.log('\n🏆 Featured Projects:');
    projects.filter(p => p.featured).forEach(p => console.log(`  - ${p.title}`));
    
    console.log('\n🎖️ Featured Certifications:');
    certifications.filter(c => c.featured).forEach(c => console.log(`  - ${c.title}`));
    
    console.log('\n💪 Featured Skills:');
    skills.filter(s => s.featured).forEach(s => console.log(`  - ${s.name} (${s.proficiencyLevel}/10)`));
    
  } catch (error) {
    console.error('❌ Error seeding Hemanth\'s portfolio data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeder
if (require.main === module) {
  seedHemanthData();
}

module.exports = { seedHemanthData };