import React from 'react';

function About({ bio, department, institution }) {
  return (
    <section id="about" className="section-card">
      <h2 className="section-heading">About Me</h2>
      <p className="bio-text">{bio}</p>
      <div className="about-meta">
        <div className="meta-item">
          <strong>Department:</strong> {department}
        </div>
        <div className="meta-item">
          <strong>Institution:</strong> {institution}
        </div>
        <div className="meta-item">
          <strong>Focus:</strong> Advanced Web Development Frameworks & Full-Stack Systems
        </div>
      </div>
    </section>
  );
}

export default About;
