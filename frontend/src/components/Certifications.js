import React, { useState, useEffect } from 'react';
import { certificationsService } from '../services/portfolioApi';
import './Certifications.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await certificationsService.getAllCertifications();
      if (response.success) {
        const featured = response.data.filter((c) => c.featured === true);
        setCertifications(featured.length > 0 ? featured : fallbackCertifications);
      } else {
        setCertifications(fallbackCertifications);
        setError("Failed to fetch certifications");
      }
    } catch (err) {
      setCertifications(fallbackCertifications);
      setError("Server error — using fallback certifications");
    } finally {
      setLoading(false);
    }
  };

  const fallbackCertifications = [
    {
      title: "Joy of Computing using Python",
      provider: "NPTEL",
      status: "COMPLETED",
      startDate: "2024-07-01",
      endDate: "2024-09-01",
      badge: "🏅",
      credentialUrl: "#",
      providerUrl: "https://nptel.ac.in",
      skills: ["Python", "Automation", "Data Visualization", "Data Handling"],
      featured: true,
    },
    {
      title: "Smart Coder",
      provider: "Smart Interviews",
      status: "COMPLETED",
      startDate: "2025-01-01",
      endDate: "2025-03-01",
      badge: "🧠",
      credentialUrl: "#",
      providerUrl: "https://smartinterviews.in",
      skills: ["Data Structures", "Algorithms", "Problem Solving"],
      featured: true,
    },
    {
      title: "LeetCode Top 24% Global Rank",
      provider: "LeetCode",
      status: "COMPLETED",
      startDate: "2023-12-01",
      endDate: "2024-01-01",
      badge: "🏆",
      credentialUrl: "#",
      providerUrl: "https://leetcode.com",
      skills: ["Algorithms", "Data Structures", "Optimization"],
      featured: true,
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <section className="certifications-hero">
        <div className="certifications-bg-gradient" />
        <div className="certifications-bg-grid" />
        <div className="certifications-orb certifications-orb--blue" />
        <div className="certifications-orb certifications-orb--purple" />
        <div className="certifications-orb certifications-orb--aqua" />
        <div className="certifications-container">
          <div className="certifications-header">
            <span className="certifications-label">Professional</span>
            <h2 className="certifications-title">Loading Certifications...</h2>
          </div>
          <div className="loading-spinner">🔄 Loading certifications...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="certifications-hero">
      <div className="certifications-bg-gradient" />
      <div className="certifications-bg-grid" />
      <div className="certifications-orb certifications-orb--blue" />
      <div className="certifications-orb certifications-orb--purple" />
      <div className="certifications-orb certifications-orb--aqua" />
      
      <div className="certifications-container">
        <div className="certifications-header">
          <span className="certifications-label">Professional</span>
          <h2 className="certifications-title">Certifications & Achievements</h2>
        </div>
        
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}

        <div className="certifications-grid">

          {certifications.map((cert, index) => (
            <div key={index} className="cert-modern-card">

              {/* Top Gradient Header */}
              <div className="cert-card-header">

                <span className="cert-status-badge">
                  {cert.status || "COMPLETED"}
                </span>

                <span className="cert-date-range">
                  {formatDate(cert.startDate)} – {formatDate(cert.endDate)}
                </span>

              </div>

              {/* Bottom Content */}
              <div className="cert-card-content">
                <h3 className="cert-card-title">{cert.title}</h3>

                <p className="cert-card-provider">{cert.provider}</p>

                <div className="cert-skills-row">
                  {cert.skills?.map((skill, i) => (
                    <span key={i} className="cert-skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="cert-buttons-row">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-btn-gradient"
                  >
                    View Credential
                  </a>

                  {cert.providerUrl && (
                    <a
                      href={cert.providerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-btn-secondary"
                    >
                      Provider Site
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Certifications;
