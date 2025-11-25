import React, { useState, useEffect } from 'react';
import './Projects.css';
import { projectsService } from '../services/portfolioApi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching projects from API...');
      
      const response = await projectsService.getAllProjects();
      console.log('📊 API Response:', response);
      
      if (response.success) {
        console.log(`✅ Successfully loaded ${response.data.length} projects`);
        setProjects(response.data);
      } else {
        console.log('❌ API returned success=false');
        setError('Failed to fetch projects from API');
        setProjects(fallbackProjects);
      }
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      setError(`API Error: ${error.message}`);
      // Fallback to hardcoded data if API fails
      console.log('🔄 Using fallback data');
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API is not available
  const fallbackProjects = [
    {
      id: 1,
      title: "MLRIT CodeHub",
      description: "Full Stack Coding Platform supporting 1,200+ users with real-time code compilation across 6 languages. Features JWT authentication, contest management, and performance analytics dashboards.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Judge0 API", "Chart.js"],
      image: "/api/placeholder/400/250",
      liveLink: "#",
      githubLink: "#",
      achievements: [
        "Serves 1,200+ active users",
        "35% reduction in response latency",
        "45% improvement in engagement",
        "50% performance enhancement"
      ],
      status: "In Development",
      period: "Dec 2024 – Present",
      gradient: "linear-gradient(135deg, #60a5fa, #a855f7)"
    },
    {
      id: 2,
      title: "Celebrity Recognizer",
      description: "Machine Learning application using Flask and OpenCV with 92% accuracy on 500+ test images. Features SVM classifier with optimized preprocessing using wavelet transforms.",
      technologies: ["Python", "Flask", "OpenCV", "SVM", "Machine Learning"],
      image: "/api/placeholder/400/250",
      liveLink: "#",
      githubLink: "#",
      achievements: [
        "92% recognition accuracy",
        "25% reduction in inference latency",
        "Real-time predictions",
        "Robust preprocessing pipeline"
      ],
      status: "Completed",
      period: "Aug 2024 – Sep 2024",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)"
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Modern, responsive portfolio website showcasing projects and skills with interactive animations, smooth transitions, and optimized performance across all devices.",
      technologies: ["React", "CSS3", "JavaScript", "Responsive Design"],
      image: "/api/placeholder/400/250",
      liveLink: "#",
      githubLink: "#",
      achievements: [
        "Fully responsive design",
        "Interactive animations",
        "Fast loading performance",
        "Modern UI/UX"
      ],
      status: "Live",
      period: "Nov 2024",
      gradient: "linear-gradient(135deg, #ec4899, #f59e0b)"
    }
  ];

  // Helper function to get project gradient based on category or featured status
  const getProjectGradient = (project) => {
    if (project.featured) {
      return project.category === 'web' 
        ? 'linear-gradient(135deg, #60a5fa, #a855f7)' 
        : 'linear-gradient(135deg, #a855f7, #ec4899)';
    }
    return 'linear-gradient(135deg, #374151, #4b5563)';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Helper function to get period display
  const getPeriod = (startDate, endDate, status) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : (status === 'in-progress' ? 'Present' : '');
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <section className="projects-hero">
        <div className="projects-bg-gradient" />
        <div className="projects-bg-grid" />
        <div className="projects-container">
          <div className="projects-header">
            <span className="projects-label">Portfolio Showcase</span>
            <h2 className="projects-title">Loading Projects...</h2>
            <p className="projects-subtitle">Fetching data from database</p>
          </div>
          <div className="loading-spinner" style={{textAlign: 'center', padding: '2rem', color: '#60a5fa'}}>
            🔄 Loading projects...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects-hero">
        <div className="projects-bg-gradient" />
        <div className="projects-bg-grid" />
        <div className="projects-container">
          <div className="projects-header">
            <span className="projects-label">Portfolio Showcase</span>
            <h2 className="projects-title">Featured Projects</h2>
            <p className="projects-subtitle">Real-world applications from my resume</p>
          </div>
          <div className="error-message" style={{textAlign: 'center', padding: '2rem', color: '#ef4444'}}>
            <p>⚠️ {error} - Using fallback data</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-hero">
      <div className="projects-bg-gradient" />
      <div className="projects-bg-grid" />
      <div className="projects-orb projects-orb--blue" />
      <div className="projects-orb projects-orb--purple" />
      <div className="projects-orb projects-orb--pink" />
      
      <div className="projects-container">
        <div className="projects-header">
          <span className="projects-label">Portfolio Showcase</span>
          <h2 className="projects-title">Featured Projects</h2>
          <p className="projects-subtitle">Real-world applications from my resume ({projects.length} projects from database)</p>
        </div>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id || project.id} className="project-card">
              <div 
                className="project-header"
                style={{ background: getProjectGradient(project) }}
              >
                <div className="project-status">
                  <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                  <span className="project-period">
                    {getPeriod(project.startDate, project.endDate, project.status)}
                  </span>
                </div>
              </div>
              
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                {project.achievements && (
                  <div className="achievements">
                    <h4>Key Achievements:</h4>
                    <ul>
                      {project.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a href={project.liveLink || '#'} className="btn-primary">Live Demo</a>
                  <a href={project.githubLink || '#'} className="btn-secondary">GitHub</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;