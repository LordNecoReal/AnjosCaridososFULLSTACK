import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '15px',
      backgroundColor: 'rgba(51, 51, 51, 0.95)',
      color: 'white',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backdropFilter: 'blur(10px)',
      fontSize: '14px'
    }}>
      Criado por Lord Neco Real, desafio empower + vai na web 2026
    </footer>
  );
};

export default Footer;