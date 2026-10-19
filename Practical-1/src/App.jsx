import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

/**
 * Main App Component
 * Composes all portfolio components, manages active section state,
 * and passes props down to child components (Header, Skills, NavBar).
 */
function App() {
  // Student Data (as per Resume)
  const studentName = 'Jugal Kshatriya';
  const themeAccentColor = '#2563eb'; // Clean Royal Blue accent

  // Active section tracking for navigation highlighting
  const [activeSection, setActiveSection] = useState('about');

  // Skills dataset passed as props to Skills component based on resume
  const studentSkills = [
    {
      id: 'skill-1',
      name: 'Python, C, C++ & Java',
      category: 'Languages',
      level: 90,
      description: 'Core algorithmic problem solving, data structures, and object-oriented programming.',
      icon: '🐍',
    },
    {
      id: 'skill-2',
      name: 'Full-Stack JavaScript & Node.js',
      category: 'Web & Backend',
      level: 88,
      description: 'JavaScript (ES6+), HTML5, CSS3, Node.js, and Express.js application development.',
      icon: '🌐',
    },
    {
      id: 'skill-3',
      name: 'FastAPI, REST APIs & JWT Auth',
      category: 'Backend & APIs',
      level: 86,
      description: 'RESTful API architecture, JWT authentication, Google OAuth, and FastAPI services.',
      icon: '⚡',
    },
    {
      id: 'skill-4',
      name: 'TensorFlow, Keras & MobileNetV2',
      category: 'Deep Learning & CV',
      level: 84,
      description: 'CNN architectures, image classification, transfer learning, and model inference.',
      icon: '🧠',
    },
    {
      id: 'skill-5',
      name: 'Scikit-learn, Pandas & NumPy',
      category: 'Data & Machine Learning',
      level: 85,
      description: 'Data preprocessing, exploratory data analysis (EDA), feature engineering, model evaluation.',
      icon: '📊',
    },
    {
      id: 'skill-6',
      name: 'MySQL & MongoDB',
      category: 'Databases',
      level: 82,
      description: 'Relational schema design (MySQL) and flexible document-based databases (MongoDB).',
      icon: '🗄️',
    },
    {
      id: 'skill-7',
      name: 'Git, GitHub & Colab',
      category: 'Developer Tools',
      level: 88,
      description: 'Version control, Git-based collaborative workflows, VS Code, and Google Colab.',
      icon: '🐙',
    },
    {
      id: 'skill-8',
      name: 'Vision-Language & AI Pipelines',
      category: 'AI & Research',
      level: 80,
      description: 'VLM research, AI-led CRM pipelines, tool-assisted architectures, and API integrations.',
      icon: '🤖',
    },
  ];

  // Lightweight scroll spy to automatically highlight active navigation item
  useEffect(() => {
    const sectionIds = ['about', 'skills', 'projects', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset for navbar height

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="portfolio-app">
      {/* 5. NavBar with active section highlighting */}
      <NavBar
        activeSection={activeSection}
        onNavClick={(id) => setActiveSection(id)}
      />

      {/* 1. Header with dynamic props: name & themeColor (applied via inline style) */}
      <Header
        name={studentName}
        themeColor={themeAccentColor}
      />

      {/* Main content body */}
      <main className="main-content">
        {/* 2. About section with student bio */}
        <About />

        {/* 3. Skills section receiving skillList array via props & mapped dynamically */}
        <Skills
          skillList={studentSkills}
        />

        {/* 6. Projects section with 3 student projects */}
        <Projects />
      </main>

      {/* 4. Footer with contact info placeholders and copyright */}
      <Footer />
    </div>
  );
}

export default App;
