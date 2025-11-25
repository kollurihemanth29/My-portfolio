import React, { useState, useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null);

  // Resume download handler
  const handleResumeDownload = (e) => {
    e.preventDefault();
    
    // Create a temporary link element for download
    const link = document.createElement('a');
    link.href = '/Hemanth_Resume.pdf';
    link.download = 'Hemanth_Resume.pdf';
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const achievements = [
    { number: "3+", label: "Years Learning" },
    { number: "15+", label: "Projects Built" },
    { number: "12+", label: "Technologies Learned" },
    { number: "100%", label: "Passion & Dedication" }
  ];

  const values = [
    {
      icon: "💡",
      title: "Innovation",
      description: "Pioneering creative solutions using AI, Machine Learning, and cutting-edge web technologies to solve complex real-world problems and drive digital transformation."
    },
    {
      icon: "🎯",
      title: "Excellence",
      description: "Delivering pixel-perfect designs and robust, scalable applications with clean code architecture, comprehensive testing, and industry best practices."
    },
    {
      icon: "🚀",
      title: "Growth Mindset",
      description: "Embracing continuous learning and staying ahead of emerging technologies like Next.js, TypeScript, Docker, and cloud platforms to deliver future-ready solutions."
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "Building strong partnerships with clients and teams through clear communication, agile methodologies, and a shared vision for success and innovation."
    }
  ];

  const timeline = [
    {
      year: "2022",
      title: "Learning Foundation",
      description: "Started my coding journey with HTML, CSS, and JavaScript. Built my first responsive websites and discovered my passion for frontend development.",
      icon: "📚",
      technologies: ["HTML5", "CSS3", "JavaScript", "Git"],
      achievement: "First Steps",
      color: "#22c55e"
    },
    {
      year: "2023",
      title: "Frontend Development",
      description: "Learned React.js and modern frontend tools. Created several personal projects including portfolio websites and interactive web apps.",
      icon: "⚡",
      technologies: ["React", "JavaScript", "Bootstrap", "Sass"],
      achievement: "Frontend Focus",
      color: "#14b8a6"
    },
    {
      year: "2024",
      title: "Full Stack Learning",
      description: "Expanded skills to backend with Node.js and databases. Built complete web applications and learned about APIs and server-side development.",
      icon: "🛠️",
      technologies: ["Node.js", "Express", "MongoDB", "REST APIs"],
      achievement: "Full Stack Learner",
      color: "#60a5fa"
    },
    {
      year: "2025",
      title: "Career Ready",
      description: "Ready to start my professional journey! Eager to contribute to real-world projects and continue learning while building meaningful applications.",
      icon: "🚀",
      technologies: ["React", "Node.js", "Python", "Cloud Basics"],
      achievement: "Job Ready",
      color: "#a855f7"
    }
  ];

  const totalSlides = 5;
  const slideDuration = 4000; // 4 seconds for smoother cycling

  // Cyclic slideshow functionality
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    
    autoSlideRef.current = setInterval(() => {
      setCurrentScreen(prev => (prev + 1) % totalSlides);
    }, slideDuration);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    // Always start auto-slide for continuous cycling
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const handleManualNavigation = (screenIndex) => {
    setCurrentScreen(screenIndex);
    // Briefly pause and then resume auto-cycling
    stopAutoSlide();
    setTimeout(() => startAutoSlide(), 500);
  };

  // Navigation functions with seamless cycling
  const goNext = () => {
    handleManualNavigation((currentScreen + 1) % totalSlides);
  };

  const goPrev = () => {
    handleManualNavigation(currentScreen === 0 ? totalSlides - 1 : currentScreen - 1);
  };

  // Removed wheel/scroll navigation

  // Touch Navigation
  const [touchStart, setTouchStart] = useState(0);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <section 
      className="about-root"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="about-track" 
        style={{ transform: `translateX(-${currentScreen * 100}vw)` }}
      >
        {/* Each Slide */}
        <div className="about-slide intro">
          <div className="about-bg-gradient" />
          <div className="about-bg-grid" />
          <div className="about-orb about-orb--blue" />
          <div className="about-orb about-orb--purple" />
          <div className="about-orb about-orb--pink" />
          <div className="about-content">
            <div className="about-intro-left">
              <div className="about-image-container">
                <div className="about-image-wrapper">
                  <img 
                    src="/hemanth-profile.png" 
                    alt="Kolluri Hemanth - Aspiring Full Stack Developer"
                    className="about-profile-img"
                  />
                  <div className="about-image-glow" />
                  <div className="about-image-halo about-image-halo--outer" />
                  <div className="about-image-halo about-image-halo--inner" />
                </div>
              </div>
            </div>
            
            <div className="about-intro-right">
              <span className="about-label">Get to know me</span>
              <h2 className="about-title">About Me</h2>
              <h3 className="about-intro-name">Hi, I'm Kolluri Hemanth</h3>
              <p className="about-intro-text">
                I'm an <strong>aspiring Full Stack Developer</strong> passionate about creating amazing 
                web applications and learning cutting-edge technologies. As a recent graduate, I'm eager to 
                apply my skills in <strong>React.js, Node.js, JavaScript, and modern web development</strong> to build 
                meaningful projects and contribute to innovative teams in the tech industry.
              </p>
              
              <div className="about-resume-section">
                <button 
                  onClick={handleResumeDownload}
                  className="resume-download-btn"
                  type="button"
                >
                  <span className="resume-btn-icon">📄</span>
                  <span className="resume-btn-text">Download Resume</span>
                  <span className="resume-btn-arrow">↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="about-slide story">
          <div className="about-bg-gradient" />
          <div className="about-bg-grid" />
          <div className="about-content about-content--centered">
            <div className="about-story-content">
              <h3 className="about-section-title">My Story</h3>
              <div className="about-story-text">
                <p className="about-description">
                  My journey began with curiosity about how websites work, leading me to learn <strong>Frontend Development</strong> 
                  with HTML, CSS, and JavaScript. I've since expanded my skills to include React.js, Node.js, and database management 
                  with MongoDB. Through personal projects and continuous learning, I've built a solid foundation in 
                  <strong>modern web development</strong> and am excited to apply these skills professionally.
                </p>
                <p className="about-description">
                  As a fresher, I'm eager to contribute to meaningful projects while continuing to learn and grow. 
                  I believe in writing <strong>clean, maintainable code</strong> and creating user-friendly applications. 
                  I'm actively seeking opportunities to join a dynamic team where I can apply my skills, learn from experienced 
                  developers, and contribute to building amazing digital experiences.
                </p>
              </div>
              
              <div className="about-stats">
                {achievements.map((item, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{item.number}</div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="about-slide values">
          <div className="about-bg-gradient" />
          <div className="about-bg-grid" />
          <div className="about-content about-content--centered">
            <h3 className="about-section-title">What Drives Me</h3>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h4 className="value-title">{value.title}</h4>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-slide timeline">
          <div className="about-bg-gradient" />
          <div className="about-bg-grid" />
          <div className="creative-roadmap">
            <div className="roadmap-header">
              <h3 className="roadmap-title">My Learning Journey</h3>
              <p className="roadmap-subtitle">From Coding Beginner to Full Stack Ready</p>
            </div>
            
            <div className="journey-path">
              <svg className="path-svg" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: "#22c55e", stopOpacity: 1}} />
                    <stop offset="33%" style={{stopColor: "#14b8a6", stopOpacity: 1}} />
                    <stop offset="66%" style={{stopColor: "#60a5fa", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#a855f7", stopOpacity: 1}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <path 
                  d="M 100 200 Q 300 100 500 180 T 900 150 Q 1000 120 1100 200" 
                  stroke="url(#pathGradient)" 
                  strokeWidth="6" 
                  fill="none"
                  filter="url(#glow)"
                  className="animated-path"
                />
              </svg>

              {timeline.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`journey-milestone milestone-${index + 1}`}
                  style={{
                    '--milestone-color': milestone.color,
                    '--animation-delay': `${index * 0.3}s`
                  }}
                >
                  <div className="milestone-marker">
                    <div className="milestone-icon">{milestone.icon}</div>
                    <div className="milestone-pulse"></div>
                  </div>
                  
                  <div className="milestone-card">
                    <div className="milestone-header">
                      <span className="milestone-year">{milestone.year}</span>
                      <span className="milestone-achievement">{milestone.achievement}</span>
                    </div>
                    
                    <h4 className="milestone-title">{milestone.title}</h4>
                    <p className="milestone-description">{milestone.description}</p>
                    
                    <div className="tech-stack">
                      {milestone.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-slide cta">
          <div className="about-bg-gradient" />
          <div className="about-bg-grid" />
          <div className="about-content about-content--centered">
            <div className="about-cta-content">
              <h3 className="about-section-title">Let's Start Building Together!</h3>
              <p className="about-cta-text">
                I'm excited to begin my professional journey and contribute to meaningful projects! As a fresher with 
                strong fundamentals in web development, I'm eager to learn, grow, and make a positive impact. Whether 
                you're looking for a dedicated junior developer who's passionate about clean code and user experience, 
                I'd love to discuss how I can contribute to your team and learn from experienced developers.
              </p>
              
              <div className="about-actions">
                <a href="#contact" className="about-btn about-btn--primary">
                  Let's Work Together
                  <span className="btn-arrow">→</span>
                </a>
                <button 
                  onClick={handleResumeDownload}
                  className="about-btn about-btn--secondary"
                  type="button"
                >
                  Download Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="about-fun-facts">
                <div className="fun-fact-card">
                  <span className="fun-fact-icon">☕</span>
                  <div>
                    <strong>Coffee Enthusiast</strong>
                    <p>Fueled by coffee and passion for clean code</p>
                  </div>
                </div>
                <div className="fun-fact-card">
                  <span className="fun-fact-icon">🌱</span>
                  <div>
                    <strong>Lifelong Learner</strong>
                    <p>Always exploring new technologies and frameworks</p>
                  </div>
                </div>
                <div className="fun-fact-card">
                  <span className="fun-fact-icon">🎯</span>
                  <div>
                    <strong>Problem Solver</strong>
                    <p>Love tackling complex challenges with elegant solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="about-dots">
        {[...Array(totalSlides)].map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentScreen ? "active" : ""}`}
            onClick={() => handleManualNavigation(i)}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <button className="nav-btn left" onClick={goPrev}>‹</button>
      <button className="nav-btn right" onClick={goNext}>›</button>


    </section>
  );
};

export default About;
