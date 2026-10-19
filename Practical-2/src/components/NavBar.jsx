import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function NavBar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-badge">JK</span>
          <span className="brand-title">Jugal's Portfolio</span>
        </Link>
      </div>

      <div className="nav-links">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Projects
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Contact
        </NavLink>
      </div>

      <div className="nav-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle dark/light theme"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </nav>
  );
}