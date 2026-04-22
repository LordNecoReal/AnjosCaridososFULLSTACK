import React from 'react';

const Principal = () => {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Sobre o Sistema Anjos Caridosos</h2>
      
      <div style={{ marginTop: '30px' }}>
        <h3>🎯 Objetivo do Site</h3>
        <p>
          O Anjos Caridosos é uma plataforma desenvolvida para conectar voluntários 
          a abrigos que resgatam pessoas afetadas por enchentes. Nosso objetivo é 
          organizar e gerenciar o cadastro de voluntários, garantindo que os abrigos 
          tenham acesso rápido a profissionais qualificados.
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>📋 Funcionalidades</h3>
        
        <div style={{ marginTop: '20px' }}>
          <h4>1. Cadastro de Voluntários</h4>
          <p>
            Preencha o formulário completo com seus dados pessoais, cargo, disponibilidade 
            e área de atuação. Você também pode adicionar uma foto (da galeria ou por link).
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>2. Controle de Vagas</h4>
          <p>
            O sistema mostra automaticamente quantos voluntários já estão cadastrados por 
            cargo e qual o limite máximo. Quando o limite é atingido, a vaga é marcada 
            como "Esgotada".
          </p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>3. Gerenciamento de Dados</h4>
          <p>
            Na seção "Dados de Voluntários", você pode visualizar todos os cadastros, 
            editar informações (ícone ✏️) ou excluir registros (ícone 🗑️).
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>📖 Tutorial de Uso</h3>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Para Voluntários:</h4>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Clique em "Cadastro de Voluntários" no menu superior</li>
            <li>Preencha todos os campos do formulário</li>
            <li>Selecione ou insira o link da sua foto</li>
            <li>Clique em "Cadastrar Voluntário"</li>
            <li>Confirme o alerta de sucesso</li>
          </ol>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Para Administradores:</h4>
          <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Acesse "Dados de Voluntários" para ver todos os cadastros</li>
            <li>Use ✏️ para editar informações de um voluntário</li>
            <li>Use 🗑️ para excluir um cadastro (com confirmação)</li>
            <li>Monitore a tabela de cargos para saber vagas disponíveis</li>
          </ol>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>⚙️ Dicas Importantes</h3>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>O telefone deve ser único no sistema (não é permitido duplicar)</li>
          <li>Para cargos não listados, digite manualmente - o sistema incluirá automaticamente</li>
          <li>Use o botão 🌙/☀️ no canto direito do menu para alternar entre temas claro e escuro</li>
          <li>Todos os dados são salvos em tempo real na nossa API


            
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Principal;