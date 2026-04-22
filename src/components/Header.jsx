import React, { useState } from 'react';

const Header = ({ activePage, setActivePage, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      backgroundColor: theme === 'dark' ? 'rgba(45, 45, 45, 0.95)' : 'rgba(76, 175, 80, 0.95)',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(18px, 5vw, 24px)' }}>Anjos Caridosos</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: 'clamp(11px, 3vw, 14px)' }}>
            Anjos na terra atuando como voluntários(as)
          </p>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        <div className="header-buttons" style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => {
              setActivePage('principal');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'principal' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              padding: '8px 16px',
              fontSize: 'clamp(12px, 4vw, 14px)'
            }}
          >
            Principal
          </button>
          <button 
            onClick={() => {
              setActivePage('cadastro');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'cadastro' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              padding: '8px 16px',
              fontSize: 'clamp(12px, 4vw, 14px)'
            }}
          >
            Cadastro
          </button>
          <button 
            onClick={() => {
              setActivePage('dados');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'dados' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              padding: '8px 16px',
              fontSize: 'clamp(12px, 4vw, 14px)'
            }}
          >
            Dados
          </button>
          <button onClick={toggleTheme} className="theme-toggle" style={{
            background: 'none',
            fontSize: '20px',
            padding: '8px 12px'
          }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: theme === 'dark' ? 'rgba(45, 45, 45, 0.98)' : 'rgba(76, 175, 80, 0.98)',
          flexDirection: 'column',
          padding: '10px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }} className="mobile-menu">
          <button 
            onClick={() => {
              setActivePage('principal');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'principal' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              width: '100%',
              textAlign: 'center',
              margin: '5px 0'
            }}
          >
            Principal
          </button>
          <button 
            onClick={() => {
              setActivePage('cadastro');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'cadastro' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              width: '100%',
              textAlign: 'center',
              margin: '5px 0'
            }}
          >
            Cadastro de Voluntários
          </button>
          <button 
            onClick={() => {
              setActivePage('dados');
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: activePage === 'dados' ? 'rgba(56, 142, 60, 0.9)' : 'transparent',
              color: 'white',
              width: '100%',
              textAlign: 'center',
              margin: '5px 0'
            }}
          >
            Dados de Voluntários
          </button>
          <button onClick={() => {
            toggleTheme();
            setMobileMenuOpen(false);
          }} style={{
            background: 'none',
            width: '100%',
            textAlign: 'center',
            margin: '5px 0'
          }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;