import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";

const Hero = () => {
  const heroRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const el = heroRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (el) el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getProfileTransform = () => {
    const rotateX = (mousePos.y - 0.5) * -8;
    const rotateY = (mousePos.x - 0.5) * 8;
    return {
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
    };
  };

  const stats = [
    { label: "Users Impacted", value: "1K+" },
    { label: "Primary Focus", value: "Full Stack + DS" },
    { label: "LeetCode Rank", value: "Top 24%" },
  ];

  const socials = [
    { 
      label: "GitHub", 
      tag: "Code", 
      href: "https://github.com/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    { 
      label: "LinkedIn", 
      tag: "Network", 
      href: "https://linkedin.com/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      label: "LeetCode", 
      tag: "Practice", 
      href: "https://leetcode.com/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.813 2.133 8.012-.074l9.928-9.747a1.375 1.375 0 0 0-.001-1.964L16.51.44A1.374 1.374 0 0 0 15.55 0H13.483zm.264 3.014h1.875L5.24 13.339c-.058.058-.122.096-.195.096-.073 0-.137-.038-.195-.096L2.99 11.339c-.058-.058-.096-.122-.096-.195s.038-.137.096-.195L13.747 3.014z"/>
        </svg>
      )
    },
  ];

  return (
    <section id="home" ref={heroRef} className="hero-root">
      {/* Background */}
      <div className="hero-bg-gradient" />
      <div className="hero-bg-grid" />
      <div className="hero-orb hero-orb--blue" />
      <div className="hero-orb hero-orb--purple" />
      <div className="hero-orb hero-orb--pink" />

      <div className={`hero-content ${mounted ? "hero-content--mounted" : ""}`}>
        {/* LEFT: TEXT */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-pill">
              <span className="hero-dot hero-dot--green" />
              Available for Full Stack &amp; AI roles
            </span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line hero-title-line--top">
              Hi, I&apos;m
            </span>
            <span className="hero-title-line hero-title-line--name">
              Kolluri Hemanth
            </span>
            <span className="hero-title-line hero-title-line--role">
              Full Stack &amp; Data Science Engineer
            </span>
          </h1>

          <p className="hero-subtitle">
            I build <span className="hero-highlight">AI-enhanced</span>{" "}
            platforms, <span className="hero-highlight">full stack</span>{" "}
            applications, and <span className="hero-highlight">data-driven</span>{" "}
            systems that feel fast, modern, and production-ready — blending
            strong frontend UX with scalable backend architecture.
          </p>

          {/* CTAs */}
          <div className="hero-cta-row">
            <a href="#projects" className="hero-cta hero-cta--primary">
              <span className="hero-cta-label">See My Work</span>
              <span className="hero-cta-glow" />
              <span className="hero-cta-arrow">↗</span>
            </a>
            <a href="#contact" className="hero-cta hero-cta--secondary">
              <span className="hero-cta-label">Let&apos;s Connect</span>
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats-row">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="hero-social-row">
            <span className="hero-social-label">Find me on</span>
            <div className="hero-social-links">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-social-chip"
                >
                  <span className="hero-social-chip-icon">{item.icon}</span>
                  <span className="hero-social-chip-main">{item.label}</span>
                  <span className="hero-social-chip-tag">{item.tag}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: OVAL PORTRAIT */}
        <div className="hero-right">
          <div className="hero-profile-shell" style={getProfileTransform()}>
            <div className="hero-profile-oval">
              <img
                src="/hemanth-profile.png"
                alt="Kolluri Hemanth - Full Stack & Data Science Engineer"
                className="hero-profile-oval-img"
              />
              <div className="hero-profile-oval-glow" />
              <div className="hero-profile-oval-halo hero-profile-oval-halo--outer" />
              <div className="hero-profile-oval-halo hero-profile-oval-halo--inner" />
              <div className="hero-profile-overlay" />
            </div>
          </div>

          <p className="hero-profile-caption">
            Focused on crafting{" "}
            <span>clean interfaces</span>,{" "}
            <span>reliable APIs</span>, and{" "}
            <span>intelligent AI experiences</span>.
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <div className="hero-scroll-wheel" />
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
