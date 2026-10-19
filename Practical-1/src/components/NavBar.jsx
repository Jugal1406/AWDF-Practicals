import React from 'react';

/**
 * NavBar Component
 * Displays navigation links and highlights the current active section.
 * 
 * @param {Object} props
 * @param {string} props.activeSection - Currently active section ID
 * @param {Function} props.onNavClick - Click handler to change active section
 */
function NavBar({ activeSection, onNavClick }) {
  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#about" className="navbar-brand">
          <span className="brand-dot"></span>
          Jugal's Portfolio
        </a>
        <ul className="navbar-links">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="navbar-item">
                <a
                  href={`#${item.id}`}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                  onClick={() => onNavClick && onNavClick(item.id)}
                >
                  {item.label}
                  {isActive && <span className="active-indicator" />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
