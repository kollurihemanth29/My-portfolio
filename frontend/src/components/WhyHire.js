import React, { useState, useRef } from 'react';
import './WhyHire.css';

const WhyHire = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    console.log("Video play functionality will be implemented");
  };

  const reasons = [
    "Fresh perspective and innovative thinking as a passionate fresher",
    "92% accuracy in Machine Learning projects with real-world applications",
    "Built full-stack applications serving 1,200+ active users",
    "Proficient in 6+ programming languages and modern tech stacks",
    "Strong problem-solving skills with analytical and creative approach",
    "Quick learner who adapts fast to new technologies and frameworks"
  ];

  return (
    <section className="whyhire-hero">
      <div className="whyhire-bg-gradient" />
      <div className="whyhire-bg-grid" />
      <div className="whyhire-orb whyhire-orb--blue" />
      <div className="whyhire-orb whyhire-orb--purple" />
      <div className="whyhire-orb whyhire-orb--pink" />
      
      <div className="whyhire-container">

        {/* HEADER */}
        <div className="whyhire-header">
          <span className="whyhire-label">Why Choose Me</span>
          <h2 className="whyhire-title">
            <span className="title-highlight">Your Next</span> 
            <span className="title-gradient">Game Changer</span>
          </h2>
          <p className="whyhire-subtitle">
            A passionate fresher ready to bring fresh perspectives, cutting-edge skills, 
            and unwavering dedication to your team's success.
          </p>
        </div>

        {/* SPLIT VIEW */}
        <div className="whyhire-split">

          {/* LEFT: REASONS */}
          <div className="whyhire-left">
            <h3 className="reasons-title">Why Hire Me?</h3>
            <div className="reasons-list">
              {reasons.map((reason, index) => (
                <div key={index} className="reason-item">
                  <span className="reason-bullet">✓</span>
                  <span className="reason-text">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: VIDEO PLACEHOLDER */}
          <div className="whyhire-right">
            <div className="video-container">
              <div className="video-placeholder" onClick={handleVideoPlay}>
                {!isVideoPlaying ? (
                  <>
                    <div className="video-overlay">
                      <div className="play-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="video-info">
                        <h3>Meet Hemanth</h3>
                        <p>Introduction Video</p>
                      </div>
                    </div>

                    <div className="video-thumbnail">
                      <div className="thumbnail-placeholder">
                        <span className="video-icon">🎥</span>
                        <span className="video-text">Watch Introduction</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="video-loading">
                    <div className="loading-spinner"></div>
                    <p>Video coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyHire;
