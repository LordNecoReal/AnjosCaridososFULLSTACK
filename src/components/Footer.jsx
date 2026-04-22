import React from 'react';
import './Footer.scss';

const Footer = ({ theme = 'dark' }) => {  // theme opcional, padrão escuro
  return (
    <footer className={`custom-footer ${theme === 'light' ? 'light-mode' : ''}`}>
      <p className="footer-text">
        Criado por <span className="author-name">Lord Neco Real</span>, 
        desafio <span className="challenge">empower + vai na web 2026</span>
      </p>
    </footer>
  );
};

export default Footer;