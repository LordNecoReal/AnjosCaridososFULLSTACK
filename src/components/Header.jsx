import React, { useState, useRef, useEffect } from 'react';

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

  // Fechar menu ao clicar fora (opcional)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header style={{
      backgroundColor: theme === 'dark' ? 'rgba(45, 45, 45, 0.95)' : 'rgba(76, 175, 80, 0.95)',
      color: 'white',
      padding: '15px 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(5deg); }
            75% { transform: translateY(5px) rotate(-5deg); }
          }
          
          @keyframes swing {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(10deg); }
          }
          
          .animated-angel {
            display: inline-block;
            animation: float 2s ease-in-out infinite;
          }
          
          .animated-angel:nth-child(2) {
            animation-delay: 0.3s;
          }
          
          .music-btn {
            transition: all 0.3s ease;
          }
          
          .music-btn:hover {
            transform: scale(1.1);
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .playing-indicator {
            animation: pulse 1.5s ease-in-out infinite;
          }

          /* Estilos responsivos */
          @media (max-width: 768px) {
            .header-buttons {
              display: none !important;
            }
            
            .mobile-menu-btn {
              display: block !important;
            }
          }

          @media (min-width: 769px) {
            .mobile-menu-btn {
              display: none !important;
            }
            
            .mobile-menu {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(18px, 5vw, 24px)' }}>
            <span className="animated-angel">😇</span>
            {' '}Anjos Caridosos{' '}
            <span className="animated-angel" style={{ animationDelay: '0.5s' }}>👼</span>
          </h1>
          <p style={{ margin: '5px 0 0 0', fontSize: 'clamp(11px, 3vw, 14px)' }}>
            Anjos na terra atuando como voluntários(as)
          </p>
        </div>
        
        {/* Botão do menu hambúrguer - AGORA VISÍVEL NO MOBILE */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background 0.3s'
          }}
          className="mobile-menu-btn"
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          ☰
        </button>

        {/* Botões do desktop */}
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
              fontSize: 'clamp(12px, 4vw, 14px)',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.3s'
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
              fontSize: 'clamp(12px, 4vw, 14px)',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.3s'
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
              fontSize: 'clamp(12px, 4vw, 14px)',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            Dados
          </button>
          
          {/* Botão do player de música */}
          <button 
            onClick={toggleMusic}
            className="music-btn"
            style={{
              background: 'none',
              fontSize: '20px',
              padding: '8px 12px',
              position: 'relative',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            title={isPlaying ? 'Pausar música' : 'Tocar música'}
          >
            {isPlaying ? '⏸️' : '▶️'} 🎵
            {isPlaying && (
              <span className="playing-indicator" style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                fontSize: '10px'
              }}>
                🎶
              </span>
            )}
          </button>
          
          {/* Botão do tema */}
          <button onClick={toggleTheme} className="theme-toggle" style={{
            background: 'none',
            fontSize: '20px',
            padding: '8px 12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Menu Mobile - AGORA FUNCIONAL */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: theme === 'dark' ? 'rgba(45, 45, 45, 0.98)' : 'rgba(76, 175, 80, 0.98)',
          flexDirection: 'column',
          padding: '15px',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.2)'
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
              margin: '8px 0',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s'
            }}
          >
            🏠 Principal
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
              margin: '8px 0',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s'
            }}
          >
            📝 Cadastro de Voluntários
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
              margin: '8px 0',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s'
            }}
          >
            📊 Dados de Voluntários
          </button>
          
          <div style={{ 
            height: '1px', 
            background: 'rgba(255,255,255,0.3)', 
            margin: '10px 0' 
          }} />
          
          {/* Player de música no menu mobile */}
          <button onClick={() => {
            toggleMusic();
            setMobileMenuOpen(false);
          }} style={{
            background: 'none',
            width: '100%',
            textAlign: 'center',
            margin: '8px 0',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px',
            transition: 'background 0.3s'
          }}>
            {isPlaying ? '⏸️ Pausar Música 🎵' : '▶️ Tocar Música 🎵'}
          </button>
          
          <button onClick={() => {
            toggleTheme();
            setMobileMenuOpen(false);
          }} style={{
            background: 'none',
            width: '100%',
            textAlign: 'center',
            margin: '8px 0',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px',
            transition: 'background 0.3s'
          }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;