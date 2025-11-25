import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import WhyHire from '../components/WhyHire';

const Home = () => {
  return (
    <div className="home">
      {/* Separate Navbar Section */}
      <Navbar />
      
      {/* Hero Section - Independent */}
      <section id="home" className="hero-section">
        <Hero />
      </section>
      
      {/* Other Sections */}
      <section id="about" className="content-section">
        <About />
      </section>
      <section id="skills" className="content-section">
        <Skills />
      </section>
      <section id="projects" className="content-section">
        <Projects />
      </section>
      <section id="certifications" className="content-section">
        <Certifications />
      </section>
      <section id="whyhire" className="content-section">
        <WhyHire />
      </section>
    </div>
  );
};

export default Home;