import React from 'react';

const studentProjects = [
  {
    id: 1,
    title: 'Crop Disease Detection Web App',
    category: 'Computer Vision & FastAPI',
    description:
      'Trained a MobileNetV2-based chili leaf disease classifier end to end and tested sample images outside the training dataset. Performed dataset quality checks, class-distribution analysis, and duplicate-image review to improve reliability.',
    technologies: ['Python', 'TensorFlow/Keras', 'MobileNetV2', 'FastAPI', 'EDA'],
    status: 'Active',
    githubUrl: 'https://github.com/Jugal1406',
  },
  {
    id: 2,
    title: 'AI Lead Qualification & Meeting Pipeline',
    category: 'AI Automation & CRM',
    description:
      'Collaborating on a team project that connects AI-led lead qualification with CRM updates and automated meeting scheduling. Implemented provider-based CRM integration with HubSpot, Calendly booking workflows, and meeting details.',
    technologies: ['Python', 'REST APIs', 'HubSpot', 'Calendly', 'AI Pipeline'],
    status: 'In Progress',
    githubUrl: 'https://github.com/Jugal1406',
  },
  {
    id: 3,
    title: 'Samyak Ayurvedic Hospital Management System',
    category: 'Full-Stack Web App',
    description:
      'Built patient and doctor workflows, appointment scheduling, and RESTful APIs for application data exchange. Implemented robust JWT-based authentication and Google OAuth sign-in security.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Google OAuth'],
    status: 'Completed',
    githubUrl: 'https://github.com/Jugal1406',
  },
  {
    id: 4,
    title: 'Remote-Sensing Vision-Language Model Research',
    category: 'Geospatial AI & Research',
    description:
      'Reviewed Vision-Language Model (VLM) approaches for natural-language analysis of satellite imagery, including sensor-fusion limitations and evaluation gaps. Explored a tool-assisted architecture combining LLMs with specialist geospatial tools.',
    technologies: ['Vision-Language Models', 'Satellite Imagery', 'Python', 'Geospatial AI'],
    status: 'Research',
    githubUrl: 'https://github.com/Jugal1406',
  },
];

export default function Projects() {
  return (
    <div className="page projects-page">
      <div className="page-header">
        <h1 className="page-title">Featured Projects</h1>
        <p className="page-subtitle">
          Showcasing student projects built with Python, AI/ML, React, and full-stack web engineering.
          Rendered dynamically using an array and <code>.map()</code>.
        </p>
      </div>

      <div className="projects-grid">
        {studentProjects.map((project) => (
          <div key={project.id} className="project-card card">
            <div className="project-header">
              <span className="project-category">{project.category}</span>
              <span className="project-id-badge">#{project.id}</span>
            </div>
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <div className="tech-stack">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-footer">
              <span className="project-status">✔ {project.status}</span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-placeholder"
              >
                GitHub &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}