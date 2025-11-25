# Portfolio Backend API

A Node.js/Express backend API for the portfolio website.

## Features

- RESTful API for project data
- Express.js server with middleware
- Error handling and logging
- CORS enabled for frontend integration
- Environment configuration
- JSON data storage (can be upgraded to MongoDB)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project (if implementing admin features)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── models/         # Data models
│   ├── middleware/     # Custom middleware
│   └── data/          # JSON data files
├── utils/             # Utility functions
├── server.js          # Main server file
└── package.json       # Dependencies and scripts
```

## Technologies

- Node.js
- Express.js
- MongoDB (optional)
- CORS
- Helmet (security)
- Morgan (logging)
- Dotenv (environment variables)