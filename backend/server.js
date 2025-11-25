const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const projectRoutes = require('./src/routes/projectRoutes');
const certificationRoutes = require('./src/routes/certificationRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = require('./src/config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(morgan('combined'));
// Increase payload size limits for file uploads (resumes, etc.)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API - Hemanth Kolluri',
    version: '1.0.0',
    description: 'REST API providing portfolio data including projects, certifications, and combined endpoints',
    developer: 'Kolluri Hemanth - Aspiring Full Stack Developer',
    status: 'Active',
    timestamp: new Date().toISOString(),
    endpoints: {
      // Main Portfolio Endpoints
      portfolio: '/api/portfolio',
      completePortfolio: '/api/portfolio/complete',
      portfolioSearch: '/api/portfolio/search?q=searchterm',
      
      // Projects Endpoints
      projects: '/api/projects',
      projectsById: '/api/projects/:id',
      
      // Certifications Endpoints
      certifications: '/api/certifications',
      certificationsById: '/api/certifications/:id',
      certificationsByCategory: '/api/certifications/category/:category',
      certificationStats: '/api/certifications/stats',
      
      // AI Chat Endpoints
      chat: '/api/chat'
    },
    features: [
      'RESTful API design',
      'JSON data handling',
      'Query parameter filtering',
      'Error handling & logging',
      'Search functionality',
      'Category-based filtering',
      'Statistics endpoints'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is running properly'
  });
});

app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;