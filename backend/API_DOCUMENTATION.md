# Portfolio Backend API Documentation

## 🚀 Overview
This REST API provides comprehensive endpoints for projects and certifications data, demonstrating modern backend development practices including routing, data handling, and API design fundamentals.

**Base URL:** `http://localhost:5000/api`

---

## 📋 API Endpoints Summary

### **Main Portfolio Endpoints**
- `GET /api/portfolio` - Portfolio overview with featured content
- `GET /api/portfolio/complete` - Complete portfolio data  
- `GET /api/portfolio/search?q=term` - Search across all data

### **Projects Endpoints**
- `GET /api/projects` - All projects with filtering
- `GET /api/projects/:id` - Specific project by ID
- `POST /api/projects` - Create new project (admin)

### **Certifications Endpoints**
- `GET /api/certifications` - All certifications with filtering
- `GET /api/certifications/:id` - Specific certification by ID
- `GET /api/certifications/category/:category` - Filter by category
- `GET /api/certifications/stats` - Certification statistics

---

## 🎯 Detailed Endpoint Documentation

### 1. Portfolio Overview
```http
GET /api/portfolio
```
**Description:** Returns portfolio summary with featured projects, recent certifications, and statistics.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "name": "Kolluri Hemanth",
      "title": "Aspiring Full Stack Developer",
      "bio": "Passionate fresher with strong fundamentals...",
      "status": "Open to Work"
    },
    "statistics": {
      "totalProjects": 6,
      "completedProjects": 4,
      "totalCertifications": 6,
      "activeCertifications": 6,
      "skillsCount": 25,
      "experienceYears": 2.9
    },
    "featuredProjects": [...],
    "recentCertifications": [...],
    "skills": ["React", "Node.js", "JavaScript", ...]
  }
}
```

### 2. Complete Portfolio Data
```http
GET /api/portfolio/complete
```
**Description:** Returns all projects and certifications data in one response.

### 3. Portfolio Search
```http
GET /api/portfolio/search?q=react
```
**Description:** Search across projects and certifications by technology, title, or description.

**Query Parameters:**
- `q` (required): Search term

### 4. All Projects
```http
GET /api/projects
```
**Description:** Returns all projects with optional filtering.

**Query Parameters:**
- `status`: Filter by project status (completed, in-progress, planned)
- `category`: Filter by project category (web, mobile, other)
- `featured`: Filter featured projects (true/false)

**Example:** `GET /api/projects?status=completed&featured=true`

### 5. Single Project
```http
GET /api/projects/1
```
**Description:** Returns detailed information for a specific project.

### 6. All Certifications
```http
GET /api/certifications
```
**Description:** Returns all certifications with optional filtering.

**Query Parameters:**
- `category`: Filter by category (Frontend, Backend, Full Stack, Programming, Development Tools)
- `provider`: Filter by provider (freeCodeCamp, Udemy, Coursera, etc.)
- `status`: Filter by status (active, expired)

**Example:** `GET /api/certifications?category=Frontend&provider=Udemy`

### 7. Certifications by Category
```http
GET /api/certifications/category/Frontend
```
**Description:** Returns all certifications for a specific category.

**Available Categories:**
- Frontend
- Backend  
- Full Stack
- Programming
- Development Tools

### 8. Certification Statistics
```http
GET /api/certifications/stats
```
**Description:** Returns analytics and statistics about certifications.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "active": 6,
    "categories": {
      "Frontend": 2,
      "Backend": 1,
      "Full Stack": 1,
      "Programming": 1,
      "Development Tools": 1
    },
    "providers": {
      "freeCodeCamp": 2,
      "Udemy": 1,
      "Coursera": 1,
      "The Odin Project": 1,
      "GitHub Learning Lab": 1
    },
    "recentCertifications": 3,
    "skillsCovered": 20
  }
}
```

---

## 💻 Frontend Integration Examples

### Basic Fetch Example
```javascript
// Fetch portfolio overview
const fetchPortfolioData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/portfolio');
    const data = await response.json();
    
    if (data.success) {
      console.log('Portfolio Data:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading };
};
```

### Search Implementation
```javascript
const searchPortfolio = async (searchTerm) => {
  const response = await fetch(
    `http://localhost:5000/api/portfolio/search?q=${encodeURIComponent(searchTerm)}`
  );
  const data = await response.json();
  
  if (data.success) {
    return {
      projects: data.results.projects,
      certifications: data.results.certifications,
      totalMatches: data.results.totalMatches
    };
  }
  
  throw new Error('Search failed');
};
```

---

## 🛡️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `500`: Server Error

---

## 🎨 Data Models

### Project Model
```javascript
{
  "id": 1,
  "title": "Project Name",
  "description": "Project description...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "image": "/api/placeholder/400/250",
  "liveLink": "https://live-demo.com",
  "githubLink": "https://github.com/user/repo",
  "featured": true,
  "category": "web",
  "status": "completed",
  "startDate": "2024-01-15",
  "endDate": "2024-02-28",
  "createdAt": "2024-02-28T10:00:00.000Z"
}
```

### Certification Model
```javascript
{
  "id": "cert-001",
  "title": "Certification Name",
  "provider": "Provider Name",
  "issueDate": "2024-03-15",
  "credentialId": "credential-id",
  "credentialUrl": "https://verify-url.com",
  "skills": ["JavaScript", "React", "Node.js"],
  "description": "Certification description...",
  "badge": "🏅",
  "status": "active",
  "category": "Programming"
}
```

---

## 🚀 Features Demonstrated

### **REST API Fundamentals**
✅ RESTful endpoint design  
✅ HTTP methods (GET, POST)  
✅ Proper status codes  
✅ JSON responses  

### **Routing & Data Handling**
✅ Express.js routing  
✅ Route parameters (:id)  
✅ Query parameters (?filter=value)  
✅ File-based data storage  
✅ JSON parsing and manipulation  

### **Advanced Features**
✅ Search functionality across datasets  
✅ Filtering and sorting  
✅ Statistics and analytics  
✅ Error handling middleware  
✅ Logging system  
✅ CORS configuration  

### **Professional Practices**
✅ Modular controller/route structure  
✅ Consistent API response format  
✅ Input validation  
✅ Environment configuration  
✅ Security headers (Helmet)  

---

## 📝 Usage in Frontend

Import the API service in your React components:

```javascript
import portfolioApi from '../services/portfolioApi';

// In your component
const MyComponent = () => {
  const { data, loading, error } = portfolioApi.usePortfolioData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{data.overview.name}</h1>
      <p>Projects: {data.statistics.totalProjects}</p>
      <p>Certifications: {data.statistics.totalCertifications}</p>
    </div>
  );
};
```

This backend API demonstrates comprehensive understanding of REST API development, data handling, and modern Node.js/Express.js practices suitable for a full-stack developer portfolio.