import React from 'react';

export default function About() {
  return (
    <section className="about-section card">
      <h2 className="section-title">About Me</h2>
      <p className="bio-text">
        Hello! I am <strong>Jugal Kshatriya</strong>, a B.Tech Computer Science and Engineering student at
        Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT. I have hands-on experience in full-stack web
        development, machine learning workflows, and computer-vision projects.
      </p>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Degree & Year:</span>
          <span className="info-value">B.Tech CSE (2024–2028)</span>
        </div>
        <div className="info-item">
          <span className="info-label">Institution:</span>
          <span className="info-value">CSPIT, CHARUSAT</span>
        </div>
        <div className="info-item">
          <span className="info-label">Academic CGPA:</span>
          <span className="info-value">8.37 / 10.0</span>
        </div>
        <div className="info-item">
          <span className="info-label">Certification:</span>
          <span className="info-value">NPTEL: Data Science with Python (Top 2%)</span>
        </div>
        <div className="info-item">
          <span className="info-label">Primary Interests:</span>
          <span className="info-value">Full-Stack Web Dev, AI/ML, Computer Vision, REST APIs</span>
        </div>
        <div className="info-item">
          <span className="info-label">Core Tech:</span>
          <span className="info-value">Python, React, Node.js, FastAPI, TensorFlow/Keras</span>
        </div>
      </div>
    </section>
  );
}