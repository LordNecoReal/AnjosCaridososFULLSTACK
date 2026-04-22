import React, { useState, useEffect } from 'react';
import { getVoluntarios, deleteVoluntario } from '../services/api';
import ModalEdicao from './ModalEdicao';
import './DadosVoluntarios.scss';

const DadosVoluntarios = () => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVoluntario, setSelectedVoluntario] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    carregarVoluntarios();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const carregarVoluntarios = async () => {
    try {
      setLoading(true);
      const data = await getVoluntarios();
      console.log('Voluntários carregados com fotos:', data);
      setVoluntarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar voluntários:', error);
      setVoluntarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteVoluntario(deleteId);
      await carregarVoluntarios();
      setShowDeleteAlert(false);
      setSuccessMessage('✅ Dado excluído com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao excluir voluntário');
    }
  };

  const handleEditClick = (voluntario) => {
    setSelectedVoluntario(voluntario);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    carregarVoluntarios();
    setShowEditModal(false);
    setSuccessMessage('✅ Dados atualizados com sucesso!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'disponivel': return '#4CAF50';
      case 'ocupado': return '#ff9800';
      case 'indisponivel': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'disponivel': return 'Disponível';
      case 'ocupado': return 'Em Treinamento';
      case 'indisponivel': return 'Indisponível';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="dados-page">
        <div className="dados-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>🔄 Carregando dados da API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dados-page">
      <div className="dados-card">
        <h2>📋 Dados dos Voluntários Cadastrados</h2>
        <p className="total-count">
          Total: <strong>{voluntarios.length}</strong> voluntário(s)
        </p>
        
        {successMessage && (
          <div className="alert-success">
            {successMessage}
          </div>
        )}

        {voluntarios.length === 0 ? (
          <div className="empty-state">
            <p>⚠️ Nenhum voluntário cadastrado ainda.</p>
          </div>
        ) : isMobile ? (
          // Cards para Mobile
          <div className="mobile-cards">
            {voluntarios.map(vol => (
              <div key={vol.id} className="voluntario-card">
                <div className="card-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {vol.foto ? (
                        <img src={vol.foto} alt={vol.nome} />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <h3>{vol.nome}</h3>
                  </div>
                  <div className="action-buttons">
                    <span onClick={() => handleEditClick(vol)}>✏️</span>
                    <span onClick={() => handleDeleteClick(vol.id)}>🗑️</span>
                  </div>
                </div>
                
                <div className="card-details">
                  <p><strong>📱 Telefone:</strong> {vol.telefone}</p>
                  <p><strong>👤 Gênero:</strong> {vol.genero}</p>
                  <p><strong>💼 Cargo:</strong> {vol.cargo}</p>
                  <p><strong>📝 Descrição:</strong> {vol.descricao_cargo || 'Não informada'}</p>
                  <p><strong>⏰ Disponibilidade:</strong> {vol.disponibilidade || 'Não informada'}</p>
                  <p><strong>🏠 Bairro (Mora):</strong> {vol.bairro_mora || 'Não informado'}</p>
                  <p><strong>📍 Bairro (Atuação):</strong> {vol.bairro_atuacao}</p>
                  <p>
                    <strong>📊 Status:</strong>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(vol.status) }}
                    >
                      {getStatusText(vol.status)}
                    </span>
                  </p>
                  {vol.data_cadastro && (
                    <p><strong>📅 Data Cadastro:</strong> {new Date(vol.data_cadastro).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tabela para Desktop
          <div className="desktop-table">
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Gênero</th>
                  <th>Cargo</th>
                  <th>Bairro Atuação</th>
                  <th>Status</th>
                  <th>Data Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {voluntarios.map(vol => (
                  <tr key={vol.id}>
                    <td>
                      {vol.foto ? (
                        <img 
                          src={vol.foto} 
                          alt={vol.nome} 
                          className="avatar-table"
                        />
                      ) : (
                        <span className="avatar-placeholder">👤</span>
                      )}
                    </td>
                    <td>{vol.id}</td>
                    <td><strong>{vol.nome}</strong></td>
                    <td>{vol.telefone}</td>
                    <td>{vol.genero}</td>
                    <td>{vol.cargo}</td>
                    <td>{vol.bairro_atuacao}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(vol.status) }}
                      >
                        {getStatusText(vol.status)}
                      </span>
                    </td>
                    <td>{vol.data_cadastro ? new Date(vol.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="action-icons">
                      <span onClick={() => handleEditClick(vol)}>✏️</span>
                      <span onClick={() => handleDeleteClick(vol.id)}>🗑️</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteAlert && (
        <div className="modal-overlay" onClick={() => setShowDeleteAlert(false)}>
          <div className="modal-content dados-card" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Tem certeza que deseja excluir esse dado?</h3>
            <div className="modal-buttons">
              <button className="btn-danger" onClick={confirmDelete}>
                Sim, excluir
              </button>
              <button className="btn-primary" onClick={() => setShowDeleteAlert(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {showEditModal && selectedVoluntario && (
        <ModalEdicao
          voluntario={selectedVoluntario}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default DadosVoluntarios;