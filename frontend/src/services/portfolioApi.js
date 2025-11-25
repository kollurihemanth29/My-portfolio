// Portfolio API Service
// Auto-detect Backend URL + Clean Fetch Wrapper

import { useState, useEffect } from "react";

// ---------------------------------------------
// ✅ FIX: Auto-select API BASE (Production + Local)
// ---------------------------------------------

// Ensure API_BASE_URL always ends with /api
const API_BASE_URL = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.endsWith('/api')
  ? process.env.REACT_APP_API_URL
  : (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/api' : '/api');

console.log("📡 Using Backend API:", API_BASE_URL);

// Generic API call handler with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API Call Failed:", error);
    throw error;
  }
};

// ---------------------------------------------
// PORTFOLIO SERVICES
// ---------------------------------------------
export const portfolioService = {
  getOverview: async () => apiCall("/portfolio"),
  getCompletePortfolio: async () => apiCall("/portfolio/complete"),
  searchPortfolio: async (searchTerm) =>
    apiCall(`/portfolio/search?q=${encodeURIComponent(searchTerm)}`),
};

// ---------------------------------------------
// PROJECT SERVICES
// ---------------------------------------------
export const projectsService = {
  getAllProjects: async () => apiCall("/projects"),

  getProjectById: async (id) => apiCall(`/projects/${id}`),

  getProjectsByStatus: async (status) =>
    apiCall(`/projects?status=${status}`),

  getFeaturedProjects: async () => apiCall("/projects?featured=true"),
};

// ---------------------------------------------
// CERTIFICATION SERVICES
// ---------------------------------------------
export const certificationsService = {
  getAllCertifications: async () => apiCall("/certifications"),

  getCertificationById: async (id) => apiCall(`/certifications/${id}`),

  getCertificationsByCategory: async (category) =>
    apiCall(`/certifications/category/${category}`),

  getFeaturedCertifications: async () =>
    apiCall("/certifications?featured=true"),

  getCertificationStats: async () => apiCall("/certifications/stats"),

  filterCertifications: async (filters) => {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.provider) params.append("provider", filters.provider);
    if (filters.status) params.append("status", filters.status);

    return apiCall(`/certifications?${params.toString()}`);
  },
};

// ---------------------------------------------
// CUSTOM HOOK — PORTFOLIO
// ---------------------------------------------
export const usePortfolioData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
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

// ---------------------------------------------
// CUSTOM HOOK — PROJECTS
// ---------------------------------------------
export const useProjectsData = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        let result;

        if (filters.featured) result = await projectsService.getFeaturedProjects();
        else if (filters.status) result = await projectsService.getProjectsByStatus(filters.status);
        else result = await projectsService.getAllProjects();

        setProjects(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  return { projects, loading, error };
};

// ---------------------------------------------
// CUSTOM HOOK — CERTIFICATIONS
// ---------------------------------------------
export const useCertificationsData = (category = null) => {
  const [certifications, setCertifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        let certsResult = category
          ? await certificationsService.getCertificationsByCategory(category)
          : await certificationsService.getAllCertifications();

        let statsResult = await certificationsService.getCertificationStats();

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

    load();
  }, [category]);

  return { certifications, stats, loading, error };
};

export default {
  portfolioService,
  projectsService,
  certificationsService,
  usePortfolioData,
  useProjectsData,
  useCertificationsData,
};
