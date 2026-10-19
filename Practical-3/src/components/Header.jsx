import React from 'react';

function Header({ title, name, themeColor = '#4f46e5' }) {
  // Theme color prop applied as an inline style as per supplementary requirements
  const headerStyle = {
    backgroundColor: themeColor,
    color: '#ffffff',
    padding: '2.25rem 1.5rem',
    textAlign: 'center',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    boxShadow: '0 8px 24px -4px rgba(79, 70, 229, 0.25)',
  };

  return (
    <header style={headerStyle} className="header-container">
      <h1 className="header-title">{title}</h1>
      <p className="header-subtitle">Welcome to the portfolio of <strong>{name}</strong></p>
      <span className="header-badge">Full Stack Development (ITUE301) - Practical 3</span>
    </header>
  );
}

export default Header;
