import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

export default function Home() {
  return (
    <div className="page home-page">
      <Header />
      
      <div className="hero-cta-banner card">
        <h2>Welcome to My React Portfolio</h2>
        <p>
          This application demonstrates client-side routing using <strong>React Router v6</strong> and
          state management using <strong>React useState</strong>. Explore my featured projects or test
          the real-time interactive contact form!
        </p>
        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary">
            Explore Projects &rarr;
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Interactive Contact Form &#9993;
          </Link>
        </div>
      </div>

      <About />
      <Skills />
    </div>
  );
}