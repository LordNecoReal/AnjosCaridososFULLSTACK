import React, { useState, useEffect } from 'react';
import { getVoluntarios, deleteVoluntario } from '../services/api';
import ModalEdicao from './ModalEdicao';

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
    return <div className="card" style={{ textAlign: 'center' }}>
      <p>🔄 Carregando dados da API...</p>
    </div>;
  }

  return (
    <div className="card">
      <h2>📋 Dados dos Voluntários Cadastrados</h2>
      <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '20px' }}>
        Total: <strong>{voluntarios.length}</strong> voluntário(s)
      </p>
      
      {successMessage && (
        <div className="alert alert-success" style={{ position: 'static', marginBottom: '20px', transform: 'none' }}>
          {successMessage}
        </div>
      )}

      {voluntarios.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '30px', padding: '40px' }}>
          <p>⚠️ Nenhum voluntário cadastrado ainda.</p>
        </div>
      ) : isMobile ? (
        // Cards para Mobile
        <div>
          {voluntarios.map(vol => (
            <div key={vol.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(61, 61, 61, 0.95)' : 'rgba(255, 255, 255, 0.95)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {vol.foto ? (
                    <img 
                      src={vol.foto} 
                      alt={vol.nome} 
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      👤
                    </div>
                  )}
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{vol.nome}</h3>
                </div>
                <div>
                  <span onClick={() => handleEditClick(vol)} style={{ cursor: 'pointer', marginRight: '10px', fontSize: '20px' }}>✏️</span>
                  <span onClick={() => handleDeleteClick(vol.id)} style={{ cursor: 'pointer', fontSize: '20px' }}>🗑️</span>
                </div>
              </div>
              
              <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                <p><strong>📱 Telefone:</strong> {vol.telefone}</p>
                <p><strong>👤 Gênero:</strong> {vol.genero}</p>
                <p><strong>💼 Cargo:</strong> {vol.cargo}</p>
                <p><strong>📝 Descrição:</strong> {vol.descricao_cargo || 'Não informada'}</p>
                <p><strong>⏰ Disponibilidade:</strong> {vol.disponibilidade || 'Não informada'}</p>
                <p><strong>🏠 Bairro (Mora):</strong> {vol.bairro_mora || 'Não informado'}</p>
                <p><strong>📍 Bairro (Atuação):</strong> {vol.bairro_atuacao}</p>
                <p><strong>📊 Status:</strong> 
                  <span style={{
                    backgroundColor: getStatusColor(vol.status),
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginLeft: '8px',
                    display: 'inline-block'
                  }}>
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ minWidth: '1000px', width: '100%' }}>
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
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '24px' }}>👤</span>
                    )}
                  </td>
                  <td>{vol.id}</td>
                  <td><strong>{vol.nome}</strong></td>
                  <td>{vol.telefone}</td>
                  <td>{vol.genero}</td>
                  <td>{vol.cargo}</td>
                  <td>{vol.bairro_atuacao}</td>
                  <td>
                    <span style={{
                      backgroundColor: getStatusColor(vol.status),
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {getStatusText(vol.status)}
                    </span>
                   </td>
                  <td>{vol.data_cadastro ? new Date(vol.data_cadastro).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <span onClick={() => handleEditClick(vol)} style={{ cursor: 'pointer', marginRight: '10px', fontSize: '20px' }}>✏️</span>
                    <span onClick={() => handleDeleteClick(vol.id)} style={{ cursor: 'pointer', fontSize: '20px' }}>🗑️</span>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteAlert && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>⚠️ Tem certeza que deseja excluir esse dado?</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="btn-danger" onClick={confirmDelete}>Sim</button>
              <button className="btn-primary" onClick={() => setShowDeleteAlert(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

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