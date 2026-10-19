import React, { useState } from 'react';
import Header from './Header';
import About from './About';
import Skills from './Skills';

function Home({ studentInfo, skills }) {
  // useState variable for toggling UI visibility on Home page
  const [showOverview, setShowOverview] = useState(false);
  const [headerColor, setHeaderColor] = useState('#4f46e5');

  return (
    <div className="home-page">
      {/* Dynamic Header Theme Switcher */}
      <div className="theme-bar">
        <span className="theme-label">Accent Theme:</span>
        <button
          type="button"
          className={`color-dot indigo ${headerColor === '#4f46e5' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#4f46e5')}
          title="Vibrant Indigo"
        />
        <button
          type="button"
          className={`color-dot emerald ${headerColor === '#059669' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#059669')}
          title="Fresh Emerald"
        />
        <button
          type="button"
          className={`color-dot rose ${headerColor === '#e11d48' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#e11d48')}
          title="Crimson Rose"
        />
        <button
          type="button"
          className={`color-dot slate ${headerColor === '#1e293b' ? 'selected' : ''}`}
          onClick={() => setHeaderColor('#1e293b')}
          title="Dark Slate"
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
              Current Stage: <strong>Practical 3 (API Integration & Data Rendering in React)</strong>.
              Consuming public REST APIs using the <code>fetch</code> API, executing asynchronous requests
              on component mount with <code>useEffect</code>, and managing Loading, Success, and Error states.
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
