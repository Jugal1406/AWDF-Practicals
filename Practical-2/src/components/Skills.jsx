import React from 'react';

const skillsList = [
  { name: 'Python, C, C++ & Java', level: 'Advanced', category: 'Languages' },
  { name: 'React.js & Vite', level: 'Intermediate', category: 'Frontend' },
  { name: 'Node.js & Express.js', level: 'Intermediate', category: 'Backend' },
  { name: 'FastAPI & REST APIs', level: 'Intermediate', category: 'APIs' },
  { name: 'TensorFlow & MobileNetV2', level: 'Intermediate', category: 'AI & CV' },
  { name: 'Scikit-learn, Pandas & NumPy', level: 'Advanced', category: 'Data & ML' },
  { name: 'MySQL & MongoDB', level: 'Intermediate', category: 'Databases' },
  { name: 'Git, GitHub & Colab', level: 'Advanced', category: 'Tools' },
  { name: 'JWT & Google OAuth', level: 'Intermediate', category: 'Security' },
  { name: 'State Management & Routing', level: 'Intermediate', category: 'React' },
];

export default function Skills() {
  return (
    <section className="skills-section card">
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {skillsList.map((skill, index) => (
          <div key={index} className="skill-card">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-badge">{skill.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
}