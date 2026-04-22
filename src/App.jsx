import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Principal from './components/Principal';
import CadastroVoluntarios from './components/CadastroVoluntarios';
import DadosVoluntarios from './components/DadosVoluntarios';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('principal');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = `${theme}-mode`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
    switch(activePage) {
      case 'principal':
        return <Principal />;
      case 'cadastro':
        return <CadastroVoluntarios />;
      case 'dados':
        return <DadosVoluntarios />;
      default:
        return <Principal />;
    }
  };

  return (
    <div className="app-container">
      <Header 
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="app-main">
        {renderPage()}
      </main>
      
      <Footer theme={theme} />  {/* ← ÚNICA MUDANÇA: passei o theme */}
    </div>
  );
}

export default App;