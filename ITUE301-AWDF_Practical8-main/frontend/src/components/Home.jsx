import React, { useState } from 'react';
import Header from './Header';
import About from './About';
import Skills from './Skills';

function Home({ studentInfo, skills }) {
  // useState variable for toggling UI visibility on Home page
  const [showOverview, setShowOverview] = useState(false);
  const [headerColor, setHeaderColor] = useState('#1d4ed8');

  return (
    <div className="home-page">
      {/* Dynamic Header Theme Switcher */}
      <div className="theme-bar">
        <span className="theme-label">Header Theme:</span>
        <button
          type="button"
          className={`color-dot blue ${headerColor === '#1d4ed8' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#1d4ed8')}
          title="Royal Blue"
        />
        <button
          type="button"
          className={`color-dot teal ${headerColor === '#0f766e' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#0f766e')}
          title="Teal"
        />
        <button
          type="button"
          className={`color-dot slate ${headerColor === '#334155' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#334155')}
          title="Slate"
        />
      </div>

      {/* Header Component */}
      <Header
        title="Student Developer Portfolio"
        name={`${studentInfo.name} (${studentInfo.id})`}
        themeColor={headerColor}
      />

      {/* UI Visibility Toggle using useState */}
      <div className="overview-toggle-container">
        <button
          type="button"
          className="toggle-btn"
          onClick={() => setShowOverview(!showOverview)}
        >
          {showOverview ? 'Hide Coursework Focus ▲' : 'Show Coursework Focus ▼'}
        </button>

        {showOverview && (
          <div className="overview-box">
            <h4>ITUE301 - Advanced Web Development Frameworks Roadmap</h4>
            <p>
              Current Stage: <strong>Practical 2 (State Management & Multi-Page Routing)</strong>.
              Transitioning from static component composition to full client-side SPA routing with React Router v6
              and reactive UI state driven by <code>useState</code>.
            </p>
          </div>
        )}
      </div>

      {/* About Component */}
      <About
        bio={studentInfo.bio}
        department={studentInfo.department}
        institution={studentInfo.institution}
      />

      {/* Skills Component */}
      <Skills skillList={skills} />
    </div>
  );
}

export default Home;
