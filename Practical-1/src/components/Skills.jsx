import React from 'react';

/**
 * Skills Component
 * Demonstrates dynamic list rendering in React using props and the .map() array method.
 * 
 * @param {Object} props
 * @param {Array} props.skillList - Array of skill objects to render dynamically
 */
function Skills({ skillList = [] }) {
  return (
    <section id="skills" className="section-container">
      <div className="section-header">
        <span className="section-badge">Technical Expertise</span>
        <h2 className="section-title">Skills & Competencies</h2>
        <div className="section-divider"></div>
        <p className="section-description">
          A showcase of my technical toolkit across AI/ML, programming languages, and web engineering.
        </p>
      </div>

      <div className="skills-grid">
        {skillList.map((skill) => (
          <div key={skill.id} className="skill-card">
            <div className="skill-card-top">
              <span className="skill-icon">{skill.icon || '⚡'}</span>
              <span className="skill-category">{skill.category}</span>
            </div>
            <h3 className="skill-name">{skill.name}</h3>
            <p className="skill-description">{skill.description}</p>
            <div className="skill-level-container">
              <div className="skill-level-header">
                <span className="skill-level-label">Proficiency</span>
                <span className="skill-level-percent">{skill.level}%</span>
              </div>
              <div className="skill-progress-bar">
                <div
                  className="skill-progress-fill"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
