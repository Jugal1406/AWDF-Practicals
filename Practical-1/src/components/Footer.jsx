import React from 'react';

/**
 * Footer Component
 * Displays student contact details (using placeholders as requested) and copyright information.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  // Contact links
  const email = "jugalkshatriya9@gmail.com";
  const phone = "+91 70167 57885";
  const githubUrl = "https://github.com/Jugal1406";
  const linkedinUrl = "https://www.linkedin.com/in/jugal-kshatriya-b24a80314/?isSelfProfile=true";

  return (
    <footer id="contact" className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand-column">
            <h3 className="footer-brand-title">Jugal Kshatriya</h3>
            <p className="footer-bio-summary">
              B.Tech Computer Science &amp; Engineering student at CSPIT, CHARUSAT.
              Hands-on experience in full-stack web development, machine learning workflows,
              and computer vision projects.
            </p>
            <div className="footer-academic-tag">
              CSPIT, CHARUSAT &bull; 2024–2028 &bull; CGPA: 8.37
            </div>
          </div>

          <div className="footer-contact-column">
            <h4>Contact Information</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-label">Email:</span>
                <a href={`mailto:${email}`} className="contact-value-link">
                  {email}
                </a>
              </li>
              <li>
                <span className="contact-label">Phone:</span>
                <a href="tel:+917016757885" className="contact-value-link">
                  {phone}
                </a>
              </li>
              <li>
                <span className="contact-label">GitHub:</span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value-link"
                >
                  github.com/Jugal1406
                </a>
              </li>
              <li>
                <span className="contact-label">LinkedIn:</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value-link"
                >
                  linkedin.com/in/jugal-kshatriya-b24a80314
                </a>
              </li>
              <li>
                <span className="contact-label">Location:</span>
                <span className="contact-value">CSPIT, CHARUSAT, Gujarat, India</span>
              </li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4>Quick Links</h4>
            <ul className="footer-nav-list">
              <li><a href="#about">About Me</a></li>
              <li><a href="#skills">Skills &amp; Expertise</a></li>
              <li><a href="#projects">Featured Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Jugal Kshatriya. All Rights Reserved. Built with React &amp; Vite.
          </p>
        
        </div>
      </div>
    </footer>
  );
}

export default Footer;
