import React from 'react';

/**
 * Projects Component
 * Displays a hardcoded list of three student projects reflecting AI, ML, and Software Development.
 */
function Projects() {
  const projectList = [
    {
      id: 1,
      title: 'Crop Disease Detection Web App',
      category: 'Computer Vision & Deep Learning',
      description:
        'Trained a MobileNetV2-based chili leaf disease classifier end to end and tested sample images outside the training dataset. Performed dataset quality checks, class-distribution analysis, and duplicate-image review. Developing a crop-specific prediction workflow with confidence scores and downloadable prediction reports.',
      tags: ['Python', 'TensorFlow/Keras', 'MobileNetV2', 'FastAPI', 'EDA'],
      status: 'Active',
      githubUrl: 'https://github.com/Jugal1406/crop-disease-detection', // Update if repo name differs
      demoUrl: '', // Optional live demo link
    },
    {
      id: 2,
      title: 'AI Lead Qualification & Meeting Pipeline',
      category: 'AI Automation & CRM Integration',
      description:
        'Collaborating on a team project that connects AI-led lead qualification with CRM updates and automated meeting scheduling. Implemented provider-based CRM integration with HubSpot, Calendly booking link workflows, and surfacing meeting insights.',
      tags: ['Python', 'REST APIs', 'HubSpot', 'Calendly', 'AI Workflow'],
      status: 'In Progress',
      githubUrl: 'https://github.com/Jugal1406/ai-lead-pipeline', // Update if repo name differs
      demoUrl: '',
    },
    {
      id: 3,
      title: 'Samyak Ayurvedic Hospital Management System',
      category: 'Full-Stack Web Development',
      description:
        'Architected comprehensive patient and doctor workflows, appointment scheduling, and RESTful APIs for seamless application data exchange. Implemented robust JWT-based authentication and Google OAuth sign-in security.',
      tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'Google OAuth'],
      status: 'Completed',
      githubUrl: 'https://github.com/Jugal1406/samyak-hospital-management', // Update if repo name differs
      demoUrl: '',
    },
    {
      id: 4,
      title: 'Remote-Sensing Vision-Language Model Research',
      category: 'Geospatial AI & VLM Research',
      description:
        'Reviewed Vision-Language Model (VLM) paradigms for natural-language analysis of satellite imagery, analyzing sensor-fusion limitations and evaluation gaps. Explored a tool-assisted architecture combining language models with specialized geospatial tools and validation.',
      tags: ['Vision-Language Models', 'Satellite Imagery', 'Python', 'Geospatial AI', 'Research'],
      status: 'Research',
      githubUrl: 'https://github.com/Jugal1406/vlm-satellite-research', // Update if repo name differs
      demoUrl: '',
    },
  ];

  return (
    <section id="projects" className="section-container">
      <div className="section-header">
        <span className="section-badge">Portfolio Work</span>
        <h2 className="section-title">Featured Projects</h2>
        <div className="section-divider"></div>
        <p className="section-description">
          Practical applications, machine learning workflows, and full-stack projects showcasing real-world problem solving.
        </p>
      </div>

      <div className="projects-grid">
        {projectList.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card-header">
              <span className="project-category">{project.category}</span>
              <span className={`project-status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {project.status}
              </span>
            </div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-footer">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                🐙 Code Repository &rarr;
              </a>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  style={{ marginLeft: '16px' }}
                >
                  🚀 Live Demo &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
