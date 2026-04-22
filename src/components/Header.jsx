import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';

const Header = ({ activePage, setActivePage, theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Criar elemento de áudio
    audioRef.current = new Audio('/musicas/Monoria Cathedral - Chrono Trigger.mp3');
    audioRef.current.loop = true;

    // Limpar ao desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Erro ao reproduzir música:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.custom-header')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <header className={`custom-header ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="header-container">
        {/* Área do logo/título */}
        <div className="logo-area">
          <h1>
            <span className="animated-angel">😇</span>
            {' '}Anjos Caridosos{' '}
            <span className="animated-angel">👼</span>
          </h1>
          <p>Anjos na terra atuando como voluntários(as)</p>
        </div>

        {/* Botão menu hambúrguer (mobile) */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        {/* Botões do desktop */}
        <div className="desktop-buttons">
          <button
            onClick={() => {
              setActivePage('principal');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'principal' ? 'active' : ''}
          >
            Principal
          </button>
          <button
            onClick={() => {
              setActivePage('cadastro');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'cadastro' ? 'active' : ''}
          >
            Cadastro
          </button>
          <button
            onClick={() => {
              setActivePage('dados');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'dados' ? 'active' : ''}
          >
            Dados
          </button>

          {/* Botão do player de música */}
          <button
            onClick={toggleMusic}
            className="music-btn"
            title={isPlaying ? 'Pausar música' : 'Tocar música'}
          >
            {isPlaying ? '⏸️' : '▶️'} 🎵
            {isPlaying && <span className="playing-indicator">🎶</span>}
          </button>

          {/* Botão do tema */}
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Menu Mobile (dropdown) */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${theme === 'dark' ? 'dark-menu' : 'light-menu'}`}>
          <button
            onClick={() => {
              setActivePage('principal');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'principal' ? 'active' : ''}
          >
            🏠 Principal
          </button>
          <button
            onClick={() => {
              setActivePage('cadastro');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'cadastro' ? 'active' : ''}
          >
            📝 Cadastro de Voluntários
          </button>
          <button
            onClick={() => {
              setActivePage('dados');
              setMobileMenuOpen(false);
            }}
            className={activePage === 'dados' ? 'active' : ''}
          >
            📊 Dados de Voluntários
          </button>

          <div className="menu-divider" />

          <button onClick={toggleMusic}>
            {isPlaying ? '⏸️ Pausar Música 🎵' : '▶️ Tocar Música 🎵'}
          </button>

          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;