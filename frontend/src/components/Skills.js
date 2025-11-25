import React, { useState, useEffect, useRef } from 'react';
import './Skills.css';

const Skills = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const autoSlideRef = useRef(null);
  const touchRef = useRef(0);

  const skillSlides = [
    {
      title: "Core Programming",
      subtitle: "Foundation languages and web development",
      categories: [
        {
          category: "Programming Languages",
          icon: "💻",
          skills: [
            { name: "Python", level: 90 },
            { name: "Java", level: 85 },
            { name: "JavaScript", level: 85 },
            { name: "C", level: 80 },
            { name: "SQL", level: 85 }
          ]
        },
        {
          category: "Web Development",
          icon: "🌐",
          skills: [
            { name: "React", level: 88 },
            { name: "Node.js", level: 85 },
            { name: "Express", level: 85 },
            { name: "HTML/CSS", level: 90 },
            { name: "REST APIs", level: 87 }
          ]
        },
        {
          category: "Databases",
          icon: "🗄️",
          skills: [
            { name: "MongoDB", level: 85 },
            { name: "MySQL", level: 80 }
          ]
        }
      ]
    },
    {
      title: "Advanced Technologies",
      subtitle: "AI, ML, and modern development tools",
      categories: [
        {
          category: "Data Science & ML",
          icon: "📊",
          skills: [
            { name: "Flask", level: 80 },
            { name: "Pandas", level: 85 },
            { name: "OpenCV", level: 75 },
            { name: "Machine Learning", level: 78 }
          ]
        },
        {
          category: "AI & Gen AI",
          icon: "🤖",
          skills: [
            { name: "VibeCoding", level: 85 },
            { name: "Generative AI", level: 80 },
            { name: "Agent Workflows", level: 82 },
            { name: "Crew AI", level: 78 },
            { name: "AI-Powered Development", level: 85 }
          ]
        },
        {
          category: "Modern Dev Tools",
          icon: "🚀",
          skills: [
            { name: "Cursor AI", level: 88 },
            { name: "Lovable", level: 82 },
            { name: "Replit", level: 85 },
            { name: "Lyzer", level: 80 },
            { name: "AI Code Assistants", level: 87 }
          ]
        }
      ]
    },
    {
      title: "DevOps & Tools",
      subtitle: "Development tools and platform expertise",
      categories: [
        {
          category: "Tools & Platforms",
          icon: "🛠️",
          skills: [
            { name: "Git", level: 88 },
            { name: "Docker", level: 75 },
            { name: "AWS", level: 72 },
            { name: "Postman", level: 85 },
            { name: "Jupyter", level: 82 },
            { name: "VS Code", level: 90 }
          ]
        },
        {
          category: "Development Process",
          icon: "⚙️",
          skills: [
            { name: "Agile Methodology", level: 80 },
            { name: "Code Review", level: 85 },
            { name: "Testing", level: 75 },
            { name: "CI/CD", level: 70 }
          ]
        },
        {
          category: "Soft Skills",
          icon: "🎯",
          skills: [
            { name: "Problem Solving", level: 90 },
            { name: "Team Collaboration", level: 88 },
            { name: "Communication", level: 85 },
            { name: "Learning Agility", level: 95 }
          ]
        }
      ]
    }
  ];

  const totalSlides = skillSlides.length;
  const slideDuration = 6000;

  console.log('Current screen:', currentScreen);
  console.log('Total slides:', skillSlides?.length);
  console.log('First slide data:', skillSlides[0]);

  useEffect(() => {
    // Temporarily disable auto-slide for debugging
    // autoSlideRef.current = setInterval(() => {
    //   setCurrentScreen(prev => (prev + 1) % totalSlides);
    // }, slideDuration);

    // return () => clearInterval(autoSlideRef.current);
  }, []);

  // Navigation functions
  const goNext = () => {
    setCurrentScreen((currentScreen + 1) % totalSlides);
  };

  const goPrev = () => {
    setCurrentScreen(currentScreen === 0 ? totalSlides - 1 : currentScreen - 1);
  };

  const handleTouchStart = (e) => (touchRef.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  return (
    <section 
      className="skills-hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="skills-track"
        style={{ transform: `translateX(-${currentScreen * 100}vw)` }}
      >
        {skillSlides.map((slide, index) => {
          console.log(`Rendering slide ${index}:`, slide.title, 'Categories:', slide.categories?.length);
          return (
            <div key={index} className="skills-slide">
              <div className="skills-bg-gradient" />
              <div className="skills-bg-grid" />
              <div className="skills-orb skills-orb--blue" />
              <div className="skills-orb skills-orb--purple" />
              <div className="skills-orb skills-orb--pink" />
              
              <div className="skills-content">
                <div className="skills-header">
                  <span className="skills-label">Technical Expertise</span>
                  <h2 className="skills-title">{slide.title}</h2>
                  <p className="skills-subtitle">{slide.subtitle}</p>
                </div>

              <div className="skills-grid skills-grid-fixed">
                {slide.categories.map((cat, i) => (
                  <div key={i} className="skill-category-card">
                    <div className="category-header">
                      <span className="category-icon">{cat.icon}</span>
                      <h3 className="category-title">{cat.category}</h3>
                      <div className="category-line"></div>
                    </div>

                    <div className="skills-list">
                      {cat.skills.map((skill, s) => (
                        <div key={s} className="skill-item">
                          <div className="skill-info">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percentage">{skill.level}%</span>
                          </div>
                          <div className="skill-bar">
                            <div
                              className="skill-progress"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        );
        })}
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow nav-arrow-left" onClick={goPrev}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button className="nav-arrow nav-arrow-right" onClick={goNext}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Minimal Navigation Dots */}
      <div className="slide-indicators">
        {skillSlides.map((_, i) => (
          <div
            key={i}
            className={`indicator ${i === currentScreen ? 'active' : ''}`}
            onClick={() => setCurrentScreen(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;
