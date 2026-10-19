import React from 'react';

/**
 * About Component
 * Displays student background, academic focus, and core technical interests.
 */
function About() {
  const interests = [
    { label: 'Full-Stack Web Dev', icon: '🌐' },
    { label: 'Machine Learning & AI', icon: '🤖' },
    { label: 'Computer Vision', icon: '👁️' },
    { label: 'REST APIs & JWT', icon: '⚡' },
    { label: 'Vision-Language Models', icon: '🛰️' },
  ];

  return (
    <section id="about" className="section-container">
      <div className="section-header">
        <span className="section-badge">Get to Know Me</span>
        <h2 className="section-title">About Me</h2>
        <div className="section-divider"></div>
      </div>

      <div className="about-grid">
        {/* Left: Bio & Professional Summary */}
        <div className="about-bio-card">
          <div className="bio-card-header">
            <span className="bio-greeting-badge">👋 Introduction</span>
            <h3>Hello! I'm Jugal Kshatriya</h3>
          </div>
          <p className="about-paragraph">
            I am a <strong>B.Tech Computer Science &amp; Engineering</strong> student at
            Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT, with hands-on
            experience in full-stack web development, machine learning workflows, and
            computer-vision projects.
          </p>
          <p className="about-paragraph">
            I am comfortable working with <strong>Python, C++, JavaScript, REST APIs, FastAPI, Node.js, and Express.js</strong>,
            along with data preprocessing, model training, and Git-based collaborative workflows.
          </p>
          <p className="about-paragraph">
            My primary passion lies in building practical, impactful <strong>AI-enabled applications</strong> that
            bridge intelligent machine learning models with robust, user-friendly full-stack interfaces.
          </p>

          <div className="bio-quick-stats">
            <div className="quick-stat-item">
              <span className="stat-number">8.37</span>
              <span className="stat-label">CGPA (CSPIT)</span>
            </div>
            <div className="quick-stat-item">
              <span className="stat-number">Top 2%</span>
              <span className="stat-label">NPTEL Python</span>
            </div>
            <div className="quick-stat-item">
              <span className="stat-number">4+</span>
              <span className="stat-label">Featured Projects</span>
            </div>
          </div>
        </div>

        {/* Right: Education, Honors & Core Interests */}
        <div className="about-highlights-card">
          <div className="highlights-header">
            <span className="highlights-badge">Academic &amp; Focus</span>
            <h3>Education &amp; Highlights</h3>
          </div>

          {/* Education Block */}
          <div className="highlight-block education-block">
            <div className="block-icon-wrapper edu-icon-bg">
              🎓
            </div>
            <div className="block-details">
              <div className="block-top-row">
                <span className="block-chip chip-blue">B.Tech Degree</span>
                <span className="block-period">2024 – 2028</span>
              </div>
              <h4 className="block-title">Computer Science &amp; Engineering</h4>
              <p className="block-institution">
                Chandubhai S. Patel Institute of Technology (CSPIT)
              </p>
              <p className="block-university">CHARUSAT, Gujarat</p>
              <div className="cgpa-pill">
                <span className="cgpa-star">⭐</span>
                <span className="cgpa-text">Current CGPA: <strong>8.37 / 10.0</strong></span>
              </div>
            </div>
          </div>

          {/* Certification Block */}
          <div className="highlight-block cert-block">
            <div className="block-icon-wrapper cert-icon-bg">
              🏆
            </div>
            <div className="block-details">
              <div className="block-top-row">
                <span className="block-chip chip-gold">Elite Certification</span>
                <span className="block-period">July – Aug 2025</span>
              </div>
              <h4 className="block-title">NPTEL: Data Science with Python</h4>
              <div className="cert-rank-badge">
                <span className="rank-highlight">🏅 Top 2% Nationwide</span>
              </div>
            </div>
          </div>

          {/* Core Areas of Interest */}
          <div className="interests-box">
            <h4>Core Areas of Interest</h4>
            <div className="interest-tags">
              {interests.map((item, index) => (
                <span key={index} className="interest-tag">
                  <span className="interest-emoji">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
