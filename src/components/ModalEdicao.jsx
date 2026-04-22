import React, { useState } from 'react';
import { updateVoluntario } from '../services/api';

const ModalEdicao = ({ voluntario, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...voluntario });
  const [novaFoto, setNovaFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(voluntario.foto || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      alert('Erro ao salvar alterações');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <h2>✏️ Editar Dados do Voluntário</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foto</label>
            {fotoPreview && (
              <div style={{ marginBottom: '10px' }}>
                <img src={fotoPreview} alt="Preview" style={{ maxWidth: '100px', borderRadius: '8px' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFotoChange} />
          </div>

          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gênero</label>
            <select name="genero" value={formData.genero || 'Masculino'} onChange={handleChange}>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value={formData.cargo || ''} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descrição do Cargo</label>
            <textarea name="descricao_cargo" value={formData.descricao_cargo || ''} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group">
            <label>Disponibilidade</label>
            <input type="text" name="disponibilidade" value={formData.disponibilidade || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Bairro onde mora</label>
            <input type="text" name="bairro_mora" value={formData.bairro_mora || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Bairro onde pode atuar</label>
            <input type="text" name="bairro_atuacao" value={formData.bairro_atuacao || ''} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status || 'disponivel'} onChange={handleChange}>
              <option value="disponivel">Disponível</option>
              <option value="ocupado">Em Treinamento</option>
              <option value="indisponivel">Indisponível</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn-primary">💾 Salvar</button>
            <button type="button" className="btn-warning" onClick={onClose}>❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicao;