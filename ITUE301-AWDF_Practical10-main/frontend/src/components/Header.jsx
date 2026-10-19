import React from 'react';

function Header({ title, name, themeColor = '#1e3a8a' }) {
  // Theme color prop applied as an inline style as per supplementary requirements
  const headerStyle = {
    backgroundColor: themeColor,
    color: '#ffffff',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <header style={headerStyle} className="header-container">
      <h1 className="header-title">{title}</h1>
      <p className="header-subtitle">Welcome to the portfolio of <strong>{name}</strong></p>
      <span className="header-badge">Full Stack Development (ITUE301) - Practical 1</span>
    </header>
  );
}

export default Header;
