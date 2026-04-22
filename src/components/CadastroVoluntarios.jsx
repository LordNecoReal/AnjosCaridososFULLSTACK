import React, { useState, useEffect } from 'react';
import { createVoluntario, getVoluntarios } from '../services/api';

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
  
  const [showLimitesEditor, setShowLimitesEditor] = useState(false);
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
    // Carregar limites salvos
    const savedLimites = localStorage.getItem('limitesCargos');
    if (savedLimites) {
      setLimitesCargos(JSON.parse(savedLimites));
    }
  }, []);

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
      localStorage.setItem('limitesCargos', JSON.stringify(novosLimites));
      carregarCargosInfo();
    }
  };

  const adicionarNovoCargo = () => {
    const novoCargo = prompt('Digite o nome do novo cargo:');
    if (novoCargo && !limitesCargos[novoCargo]) {
      const limite = prompt(`Defina o limite máximo para ${novoCargo}:`, '10');
      const novoLimite = parseInt(limite);
      if (!isNaN(novoLimite)) {
        const novosLimites = { ...limitesCargos, [novoCargo]: novoLimite };
        setLimitesCargos(novosLimites);
        localStorage.setItem('limitesCargos', JSON.stringify(novosLimites));
        carregarCargosInfo();
        setAlertMessage(`✅ Cargo "${novoCargo}" adicionado com limite de ${novoLimite}`);
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } else if (novoCargo && limitesCargos[novoCargo]) {
      setAlertMessage('❌ Este cargo já existe!');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
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
        setAlertMessage('❌ A imagem deve ter no máximo 5MB');
        setAlertType('danger');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
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
        console.log('Foto carregada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setAlertMessage('❌ Por favor, informe o nome completo');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!formData.telefone.trim()) {
      setAlertMessage('❌ Por favor, informe o telefone');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!formData.cargo.trim()) {
      setAlertMessage('❌ Por favor, informe o cargo');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const cargoExistente = cargosInfo.find(c => c.nome === formData.cargo);
    if (cargoExistente && cargoExistente.esgotado) {
      setAlertMessage(`❌ Vaga para ${formData.cargo} está esgotada!`);
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
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

      const response = await createVoluntario(voluntarioData);
      console.log('Cadastro realizado com sucesso:', response);
      
      setAlertMessage('✅ Cadastro realizado com sucesso!');
      setAlertType('success');
      setShowAlert(true);

      // Limpar formulário
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
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setAlertMessage('❌ Erro ao cadastrar. Tente novamente!');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
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
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          backgroundColor: document.body.classList.contains('dark-mode') ? 'rgba(61, 61, 61, 0.95)' : 'rgba(249, 249, 249, 0.95)'
        }}>
          <h3>⚙️ Configuração de Limites por Cargo</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
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
                        style={{ width: '80px', padding: '5px' }}
                        min="0"
                      />
                    </td>
                    <td>
                      {limite === 999 ? 'Ilimitado' : `${limite} voluntários`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={adicionarNovoCargo}
            className="btn-primary"
            style={{ marginTop: '15px' }}
          >
            + Adicionar Novo Cargo
          </button>
        </div>
      )}

      {/* Tabela de Vagas */}
      {!showLimitesEditor && (
        <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
          <h3>📊 Vagas Disponíveis por Cargo</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '300px', width: '100%' }}>
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
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Foto do Voluntário</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            style={{ marginBottom: '10px' }}
          />
          {formData.fotoPreview && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img 
                src={formData.fotoPreview} 
                alt="Preview" 
                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <p style={{ fontSize: '12px', marginTop: '5px' }}>Pré-visualização da foto</p>
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
          <small style={{ fontSize: '12px', opacity: 0.7 }}>
            Exemplo: (21) 99999-9999
          </small>
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

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
          ✅ Cadastrar Voluntário
        </button>
      </form>

      {showAlert && (
        <div className={`alert alert-${alertType}`}>
          <p>{alertMessage}</p>
          <button onClick={() => setShowAlert(false)} style={{ marginTop: '10px' }}>
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default CadastroVoluntarios;