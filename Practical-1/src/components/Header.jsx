import React from 'react';

/**
 * Header Component
 * Displays the portfolio title, student name, and applies the dynamic themeColor prop via inline style.
 * 
 * @param {Object} props
 * @param {string} props.name - Student Name
 * @param {string} props.themeColor - Accent color applied via inline style
 */
function Header({ name, themeColor }) {
  return (
    <header className="header-container" style={{ borderTop: `5px solid ${themeColor}` }}>
      <div className="header-content">
        <div className="header-badge" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
          Computer Science &amp; Engineering | CSPIT, CHARUSAT
        </div>
        <h1 className="header-title">
          Hi, I'm <span className="highlight-name" style={{ color: themeColor }}>{name}</span>
        </h1>
        <p className="header-subtitle">
          Computer Science &amp; Engineering Student &bull; Full-Stack Development &bull; AI/ML
        </p>
        <p className="header-description" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Passionate about building practical AI-enabled applications, robust web services, and machine learning workflows.
        </p>
        <div className="header-cta-group">
          <a href="#projects" className="btn btn-primary" style={{ backgroundColor: themeColor }}>
            View My Projects
          </a>
          <a href="#contact" className="btn btn-outline" style={{ borderColor: themeColor, color: themeColor }}>
            Contact Me
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
