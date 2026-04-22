import React, { useState, useEffect } from 'react';
import { updateVoluntario } from '../services/api';
import './ModalEdicao.scss';

const ModalEdicao = ({ voluntario, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...voluntario });
  const [novaFoto, setNovaFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(voluntario.foto || null);

  // Prevenir scroll do body quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovaFoto(reader.result);
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosAtualizados = {
        ...formData,
        fotoBase64: novaFoto || formData.foto
      };
      await updateVoluntario(voluntario.id, dadosAtualizados);
      onSave();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('❌ Erro ao salvar alterações');
    }
  };

  return (
    <div className="modal-edicao-overlay" onClick={onClose}>
      <div className="modal-edicao-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Dados do Voluntário</h2>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>📸 Foto do Voluntário</label>
            {fotoPreview && (
              <div className="foto-preview">
                <img src={fotoPreview} alt="Preview" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFotoChange} />
            <small>Formatos: JPG, PNG, GIF (max 5MB)</small>
          </div>

          <div className="form-group">
            <label>👤 Nome Completo *</label>
            <input 
              type="text" 
              name="nome" 
              value={formData.nome || ''} 
              onChange={handleChange} 
              required 
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-group">
            <label>📱 Telefone *</label>
            <input 
              type="tel" 
              name="telefone" 
              value={formData.telefone || ''} 
              onChange={handleChange} 
              required 
              placeholder="(21) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label>⚧ Gênero *</label>
            <select name="genero" value={formData.genero || 'Masculino'} onChange={handleChange} required>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>💼 Cargo *</label>
            <input 
              type="text" 
              name="cargo" 
              value={formData.cargo || ''} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Psicólogo, Enfermeiro..."
            />
          </div>

          <div className="form-group">
            <label>📝 Descrição do Cargo</label>
            <textarea 
              name="descricao_cargo" 
              value={formData.descricao_cargo || ''} 
              onChange={handleChange} 
              rows="3"
              placeholder="Descreva suas atividades e experiência"
            />
          </div>

          <div className="form-group">
            <label>⏰ Disponibilidade</label>
            <input 
              type="text" 
              name="disponibilidade" 
              value={formData.disponibilidade || ''} 
              onChange={handleChange} 
              placeholder="Ex: Segunda a Sexta, 14h-18h"
            />
          </div>

          <div className="form-group">
            <label>🏠 Bairro onde mora</label>
            <input 
              type="text" 
              name="bairro_mora" 
              value={formData.bairro_mora || ''} 
              onChange={handleChange} 
              placeholder="Ex: Copacabana"
            />
          </div>

          <div className="form-group">
            <label>📍 Bairro onde pode atuar *</label>
            <input 
              type="text" 
              name="bairro_atuacao" 
              value={formData.bairro_atuacao || ''} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Centro"
            />
          </div>

          <div className="form-group">
            <label>📊 Status</label>
            <select name="status" value={formData.status || 'disponivel'} onChange={handleChange}>
              <option value="disponivel">✅ Disponível</option>
              <option value="ocupado">🔄 Em Treinamento</option>
              <option value="indisponivel">❌ Indisponível</option>
            </select>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn-warning" onClick={onClose}>
            ❌ Cancelar
          </button>
          <button type="submit" className="btn-primary" onClick={handleSubmit}>
            💾 Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdicao;