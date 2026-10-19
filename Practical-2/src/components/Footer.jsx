import React from 'react';

export default function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Jugal Kshatriya. All rights reserved.</p>
        <div className="footer-links-row" style={{ marginTop: '6px', fontSize: '0.9rem' }}>
          <a
            href="https://github.com/Jugal1406"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline', marginRight: '14px' }}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jugal-kshatriya-b24a80314/?isSelfProfile=true"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            LinkedIn
          </a>
        </div>
        <p className="footer-subtext" style={{ marginTop: '8px' }}>
          ITUE301: AWDF Practical 2 — State Management and Routing in React
        </p>
      </div>
    </footer>
  );
}