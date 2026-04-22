import React, { useState, useEffect } from 'react';
import { createVoluntario, getVoluntarios } from '../services/api';
import './CadastroVoluntarios.scss';

const CadastroVoluntarios = () => {
  const [cargosInfo, setCargosInfo] = useState([]);
  const [limitesCargos, setLimitesCargos] = useState({
    'Psicólogo': 5,
    'Enfermeiro': 10,
    'Médico': 8,
    'Motorista': 15,
    'Assistente Social': 6,
    'Bombeiro': 12,
    'Coordenador': 3
  });
  
  const [limitesOriginais, setLimitesOriginais] = useState({});
  const [showLimitesEditor, setShowLimitesEditor] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    genero: 'Masculino',
    cargo: '',
    descricao_cargo: '',
    disponibilidade: '',
    bairro_mora: '',
    bairro_atuacao: '',
    status: 'disponivel',
    fotoBase64: null,
    fotoPreview: null
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    carregarCargosInfo();
    const savedLimites = localStorage.getItem('limitesCargos');
    if (savedLimites) {
      const parsed = JSON.parse(savedLimites);
      setLimitesCargos(parsed);
      setLimitesOriginais(JSON.parse(JSON.stringify(parsed)));
    } else {
      setLimitesOriginais(JSON.parse(JSON.stringify(limitesCargos)));
    }
  }, []);

  // Detectar mudanças nos limites
  useEffect(() => {
    const hasChanges = JSON.stringify(limitesCargos) !== JSON.stringify(limitesOriginais);
    setHasUnsavedChanges(hasChanges);
  }, [limitesCargos, limitesOriginais]);

  // Prevenir saída sem salvar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const carregarCargosInfo = async () => {
    try {
      const voluntarios = await getVoluntarios();
      const cargosMap = new Map();

      voluntarios.forEach(vol => {
        if (!cargosMap.has(vol.cargo)) {
          cargosMap.set(vol.cargo, { quantidade: 0, limite: limitesCargos[vol.cargo] || 999 });
        }
        cargosMap.get(vol.cargo).quantidade++;
      });

      const cargosArray = Array.from(cargosMap.entries()).map(([nome, dados]) => ({
        nome,
        quantidade: dados.quantidade,
        limite: dados.limite,
        esgotado: dados.quantidade >= dados.limite
      }));

      setCargosInfo(cargosArray);
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
    }
  };

  const handleLimiteChange = (cargo, novoLimite) => {
    const novoLimiteNum = parseInt(novoLimite);
    if (!isNaN(novoLimiteNum) && novoLimiteNum >= 0) {
      const novosLimites = { ...limitesCargos, [cargo]: novoLimiteNum };
      setLimitesCargos(novosLimites);
    }
  };

  const handleSaveLimites = () => {
    setShowConfirmAlert(true);
  };

  const confirmSaveLimites = () => {
    localStorage.setItem('limitesCargos', JSON.stringify(limitesCargos));
    setLimitesOriginais(JSON.parse(JSON.stringify(limitesCargos)));
    setHasUnsavedChanges(false);
    setShowConfirmAlert(false);
    mostrarAlerta('✅ Alterações salvas com sucesso!', 'success');
    carregarCargosInfo();
  };

  const handleCancelLimites = () => {
    if (hasUnsavedChanges) {
      setShowLeaveAlert(true);
      setPendingAction('cancel');
    } else {
      cancelChanges();
    }
  };

  const cancelChanges = () => {
    setLimitesCargos(JSON.parse(JSON.stringify(limitesOriginais)));
    setHasUnsavedChanges(false);
    setShowLeaveAlert(false);
    setPendingAction(null);
    mostrarAlerta('❌ Alterações canceladas', 'warning');
  };

  const handleLeaveWithoutSave = () => {
    setShowLeaveAlert(false);
    cancelChanges();
  };

  const adicionarNovoCargo = () => {
    const novoCargo = prompt('Digite o nome do novo cargo:');
    if (novoCargo && !limitesCargos[novoCargo]) {
      const limite = prompt(`Defina o limite máximo para ${novoCargo}:`, '10');
      const novoLimite = parseInt(limite);
      if (!isNaN(novoLimite)) {
        const novosLimites = { ...limitesCargos, [novoCargo]: novoLimite };
        setLimitesCargos(novosLimites);
        mostrarAlerta(`✅ Cargo "${novoCargo}" cadastrado com sucesso!`, 'success');
      }
    } else if (novoCargo && limitesCargos[novoCargo]) {
      mostrarAlerta('❌ Este cargo já existe!', 'danger');
    }
  };

  const mostrarAlerta = (mensagem, tipo) => {
    setAlertMessage(mensagem);
    setAlertType(tipo);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const formatted = formatTelefone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        mostrarAlerta('❌ A imagem deve ter no máximo 5MB', 'danger');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ 
          ...prev, 
          fotoBase64: base64String,
          fotoPreview: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      mostrarAlerta('❌ Por favor, informe o nome completo', 'danger');
      return;
    }

    if (!formData.telefone.trim()) {
      mostrarAlerta('❌ Por favor, informe o telefone', 'danger');
      return;
    }

    if (!formData.cargo.trim()) {
      mostrarAlerta('❌ Por favor, informe o cargo', 'danger');
      return;
    }

    const cargoExistente = cargosInfo.find(c => c.nome === formData.cargo);
    if (cargoExistente && cargoExistente.esgotado) {
      mostrarAlerta(`❌ Vaga para ${formData.cargo} está esgotada!`, 'danger');
      return;
    }

    try {
      const voluntarioData = {
        nome: formData.nome,
        telefone: formData.telefone,
        genero: formData.genero,
        cargo: formData.cargo,
        descricao_cargo: formData.descricao_cargo,
        disponibilidade: formData.disponibilidade,
        bairro_mora: formData.bairro_mora,
        bairro_atuacao: formData.bairro_atuacao,
        status: formData.status,
        fotoBase64: formData.fotoBase64
      };

      await createVoluntario(voluntarioData);
      
      mostrarAlerta('✅ Cadastro realizado com sucesso!', 'success');

      setFormData({
        nome: '',
        telefone: '',
        genero: 'Masculino',
        cargo: '',
        descricao_cargo: '',
        disponibilidade: '',
        bairro_mora: '',
        bairro_atuacao: '',
        status: 'disponivel',
        fotoBase64: null,
        fotoPreview: null
      });

      await carregarCargosInfo();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      mostrarAlerta('❌ Erro ao cadastrar. Tente novamente!', 'danger');
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <div className="cadastro-header">
          <h2>📝 Cadastro de Voluntários</h2>
          <button 
            onClick={() => setShowLimitesEditor(!showLimitesEditor)}
            className="btn-warning"
          >
            {showLimitesEditor ? '📋 Ver Vagas' : '⚙️ Editar Limites'}
          </button>
        </div>

        {/* Editor de Limites */}
        {showLimitesEditor && (
          <div className="limites-editor">
            <h3>⚙️ Configuração de Limites por Cargo</h3>
            <div className="tabela-limites">
              <table>
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Limite Máximo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(limitesCargos).map(([cargo, limite]) => (
                    <tr key={cargo}>
                      <td>{cargo}</td>
                      <td>
                        <input
                          type="number"
                          value={limite}
                          onChange={(e) => handleLimiteChange(cargo, e.target.value)}
                          min="0"
                        />
                      </td>
                      <td>{limite === 999 ? 'Ilimitado' : `${limite} voluntários`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Botões de ação */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCancelLimites}
                className="btn-warning"
              >
                ❌ Cancelar
              </button>
              <button 
                onClick={handleSaveLimites}
                className="btn-primary"
              >
                💾 Salvar Alterações
              </button>
            </div>
            
            <button 
              onClick={adicionarNovoCargo}
              className="btn-primary"
              style={{ marginTop: '15px', width: '100%' }}
            >
              + Adicionar Novo Cargo
            </button>
          </div>
        )}

        {/* Tabela de Vagas */}
        {!showLimitesEditor && (
          <div className="vagas-container">
            <h3>📊 Vagas Disponíveis por Cargo</h3>
            <table>
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Cadastrados</th>
                  <th>Limite</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {cargosInfo.map((cargo, index) => (
                  <tr key={index}>
                    <td>{cargo.nome}</td>
                    <td>{cargo.quantidade}</td>
                    <td>{cargo.limite === 999 ? '∞' : cargo.limite}</td>
                    <td className={cargo.esgotado ? 'vaga-esgotada' : 'vaga-disponivel'}>
                      {cargo.esgotado ? '❌ Esgotada' : '✅ Disponível'}
                    </td>
                  </tr>
                ))}
                {cargosInfo.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      Nenhum voluntário cadastrado ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Foto do Voluntário</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
            />
            {formData.fotoPreview && (
              <div className="foto-preview">
                <img src={formData.fotoPreview} alt="Preview" />
                <p>Pré-visualização da foto</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="form-group">
            <label>Telefone (WhatsApp) *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(21) 99999-9999"
              required
            />
            <small>Exemplo: (21) 99999-9999</small>
          </div>

          <div className="form-group">
            <label>Gênero *</label>
            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cargo/Profissão *</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              list="cargos-sugeridos"
              placeholder="Digite ou selecione um cargo"
              required
            />
            <datalist id="cargos-sugeridos">
              {Object.keys(limitesCargos).map(cargo => (
                <option key={cargo} value={cargo} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>Descrição do Cargo</label>
            <textarea
              name="descricao_cargo"
              value={formData.descricao_cargo}
              onChange={handleChange}
              rows="3"
              placeholder="Descreva suas atividades/experiência"
            />
          </div>

          <div className="form-group">
            <label>Disponibilidade</label>
            <input
              type="text"
              name="disponibilidade"
              value={formData.disponibilidade}
              onChange={handleChange}
              placeholder="Ex: Segunda a Sexta, 14h-18h"
            />
          </div>

          <div className="form-group">
            <label>Bairro onde mora</label>
            <input
              type="text"
              name="bairro_mora"
              value={formData.bairro_mora}
              onChange={handleChange}
              placeholder="Ex: Copacabana"
            />
          </div>

          <div className="form-group">
            <label>Bairro onde pode atuar *</label>
            <input
              type="text"
              name="bairro_atuacao"
              value={formData.bairro_atuacao}
              onChange={handleChange}
              placeholder="Ex: Centro"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="disponivel">Disponível</option>
              <option value="ocupado">Em Treinamento</option>
              <option value="indisponivel">Indisponível</option>
            </select>
          </div>

          <button type="submit" className="btn-primary btn-submit">
            ✅ Cadastrar Voluntário
          </button>
        </form>
      </div>

      {/* Modal de Confirmação para Salvar */}
      {showConfirmAlert && (
        <div className="modal-overlay" onClick={() => setShowConfirmAlert(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Confirmar Alterações</h3>
            <p>Tem certeza que deseja salvar as alterações nos limites dos cargos?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={confirmSaveLimites}>
                ✅ Sim, salvar
              </button>
              <button className="btn-warning" onClick={() => setShowConfirmAlert(false)}>
                ❌ Não, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Sair sem Salvar */}
      {showLeaveAlert && (
        <div className="modal-overlay" onClick={() => setShowLeaveAlert(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Alterações não salvas</h3>
            <p>Você ainda tem alterações não feitas. Deseja cancelar as alterações?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="btn-danger" onClick={handleLeaveWithoutSave}>
                ✅ Sim, cancelar
              </button>
              <button className="btn-primary" onClick={() => setShowLeaveAlert(false)}>
                ❌ Não, continuar editando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {showAlert && (
        <div className="toast-notification">
          <div className={`toast-content toast-${alertType}`}>
            <span className="toast-message">{alertMessage}</span>
            <span className="toast-close" onClick={() => setShowAlert(false)}>✕</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroVoluntarios;