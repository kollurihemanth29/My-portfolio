// Portfolio API Service
// Demonstrates REST API consumption and data handling

import { useState, useEffect } from 'react';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

// Generic API call handler with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};

// Portfolio Services
export const portfolioService = {
  // Get portfolio overview (featured projects + recent certifications)
  getOverview: async () => {
    return await apiCall('/portfolio');
  },

  // Get complete portfolio data
  getCompletePortfolio: async () => {
    return await apiCall('/portfolio/complete');
  },

  // Search across portfolio
  searchPortfolio: async (searchTerm) => {
    return await apiCall(`/portfolio/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

// Projects Services
export const projectsService = {
  // Get all projects
  getAllProjects: async () => {
    return await apiCall('/projects');
  },

  // Get project by ID
  getProjectById: async (id) => {
    return await apiCall(`/projects/${id}`);
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    return await apiCall(`/projects?status=${status}`);
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    return await apiCall('/projects?featured=true');
  }
};

// Certifications Services
export const certificationsService = {
  // Get all certifications
  getAllCertifications: async () => {
    return await apiCall('/certifications');
  },

  // Get certification by ID
  getCertificationById: async (id) => {
    return await apiCall(`/certifications/${id}`);
  },

  // Get certifications by category
  getCertificationsByCategory: async (category) => {
    return await apiCall(`/certifications/category/${category}`);
  },

  // Get featured certifications
  getFeaturedCertifications: async () => {
    return await apiCall('/certifications?featured=true');
  },

  // Get certification statistics
  getCertificationStats: async () => {
    return await apiCall('/certifications/stats');
  },

  // Filter certifications
  filterCertifications: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.provider) params.append('provider', filters.provider);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    return await apiCall(`/certifications${queryString ? `?${queryString}` : ''}`);
  }
};

// React Hook for portfolio data
export const usePortfolioData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await portfolioService.getOverview();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const result = await portfolioService.getOverview();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Example usage for Projects component
export const useProjectsData = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let result;
        
        if (filters.featured) {
          result = await projectsService.getFeaturedProjects();
        } else if (filters.status) {
          result = await projectsService.getProjectsByStatus(filters.status);
        } else {
          result = await projectsService.getAllProjects();
        }
        
        setProjects(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  return { projects, loading, error };
};

// Example usage for Certifications component
export const useCertificationsData = (category = null) => {
  const [certifications, setCertifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        
        // Fetch certifications
        let certsResult;
        if (category) {
          certsResult = await certificationsService.getCertificationsByCategory(category);
        } else {
          certsResult = await certificationsService.getAllCertifications();
        }
        
        // Fetch stats
        const statsResult = await certificationsService.getCertificationStats();
        
        setCertifications(certsResult.data);
        setStats(statsResult.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCertifications([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [category]);

  return { certifications, stats, loading, error };
};

export default {
  portfolioService,
  projectsService,
  certificationsService,
  usePortfolioData,
  useProjectsData,
  useCertificationsData
};