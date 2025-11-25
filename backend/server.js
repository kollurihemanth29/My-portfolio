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

// ------------------------------------------
// ⭐ UNIVERSAL VERCEL CORS FIX (PERMANENT)
// ------------------------------------------

const allowedPatterns = [
  /^https:\/\/my-portfolio-.*-kolluri-hemanths-projects\.vercel\.app$/,
  /^https:\/\/my-portfolio-.*\.vercel\.app$/,
  /^https:\/\/.*-kolluri-hemanths-projects\.vercel\.app$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/my-portfolio-rho-nine-76\.vercel\.app$/,  // Production domain
  /^http:\/\/localhost:3000$/,
  /^http:\/\/localhost:3001$/,
];

// CORS Middleware - Allow all origins (simplified for Vercel)
app.use(
  cors({
    origin: '*',  // Allow all origins
    credentials: false,  // Must be false when origin is '*'
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Explicit OPTIONS handler for all routes
app.options('*', cors());

// ------------------------------------------
// Security & Logging
// ------------------------------------------
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ------------------------------------------
// Root API
// ------------------------------------------
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API - Hemanth Kolluri',
    version: '1.0.0',
    description: 'REST API providing portfolio data including projects, certifications, and chat features.',
    developer: 'Kolluri Hemanth',
    timestamp: new Date().toISOString(),
    endpoints: {
      projects: '/api/projects',
      certifications: '/api/certifications',
      portfolio: '/api/portfolio',
      chat: '/api/chat'
    }
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ------------------------------------------
// Routes
// ------------------------------------------
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ------------------------------------------
// Export for Vercel Serverless
// ------------------------------------------
// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;
