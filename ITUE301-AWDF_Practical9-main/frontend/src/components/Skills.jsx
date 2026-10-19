import React from 'react';

function Skills({ skillList }) {
  return (
    <section id="skills" className="section-card">
      <h2 className="section-heading">Technical Skills</h2>
      <p className="section-subtext">Core technologies and tools utilized in coursework and development:</p>
      <ul className="skills-list">
        {skillList && skillList.map((skill) => (
          <li key={skill} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
