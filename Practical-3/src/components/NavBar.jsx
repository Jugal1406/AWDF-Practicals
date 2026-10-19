import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar({ darkMode, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">Portfolio <span>SPA</span></NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Dark/Light mode toggle using useState */}
      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
