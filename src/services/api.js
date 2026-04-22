import axios from 'axios';

const API_URL = 'https://desafiofinalbackendenchentevnw-2.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Armazenamento de fotos
const fotosStorage = {};

// Carregar fotos salvas do localStorage na inicialização
const carregarFotosSalvas = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('foto_')) {
      const id = key.replace('foto_', '');
      fotosStorage[id] = localStorage.getItem(key);
    }
  }
};

// Chamar ao iniciar
carregarFotosSalvas();

// Salvar foto
export const salvarFoto = async (id, fotoBase64) => {
  try {
    fotosStorage[id] = fotoBase64;
    localStorage.setItem(`foto_${id}`, fotoBase64);
    console.log(`Foto salva para o voluntário ${id}`);
    return true;
  } catch (error) {
    console.error('Erro ao salvar foto:', error);
    return false;
  }
};

// Recuperar foto
export const getFoto = (id) => {
  const foto = fotosStorage[id] || localStorage.getItem(`foto_${id}`);
  return foto;
};

// Mapear campos do backend para o frontend
const mapBackendToFrontend = (backendData) => {
  if (Array.isArray(backendData)) {
    return backendData.map(item => {
      const foto = getFoto(item.id);
      return {
        id: item.id,
        nome: item.nome,
        telefone: item.telefone,
        genero: item.sexo,
        cargo: item.funcao,
        descricao_cargo: item.descricao_funcao,
        disponibilidade: item.disponibilidade || 'Não informado',
        bairro_mora: item.bairro_mora || 'Não informado',
        bairro_atuacao: item.bairro_atuacao,
        status: item.status === 'Ativo' ? 'disponivel' : 
                item.status === 'Em Treinamento' ? 'ocupado' : 'indisponivel',
        cidade: item.cidade,
        estado: item.estado,
        data_cadastro: item.data_cadastro,
        foto: foto // Adicionar foto se existir
      };
    });
  }
  return backendData;
};

// Mapear campos do frontend para o backend
const mapFrontendToBackend = (frontendData) => {
  return {
    nome: frontendData.nome,
    telefone: frontendData.telefone,
    sexo: frontendData.genero,
    funcao: frontendData.cargo,
    descricao_funcao: frontendData.descricao_cargo,
    bairro_atuacao: frontendData.bairro_atuacao,
    bairro_mora: frontendData.bairro_mora || 'Não informado',
    disponibilidade: frontendData.disponibilidade || 'Não informado',
    status: frontendData.status === 'disponivel' ? 'Ativo' :
            frontendData.status === 'ocupado' ? 'Em Treinamento' : 'Inativo',
    cidade: 'Rio de Janeiro',
    estado: 'RJ'
  };
};

export const getVoluntarios = async () => {
  try {
    const response = await api.get('/voluntarios');
    console.log('Dados recebidos da API:', response.data);
    const mappedData = mapBackendToFrontend(response.data);
    console.log('Dados com fotos:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Erro ao buscar voluntários:', error);
    throw error;
  }
};

export const getVoluntarioById = async (id) => {
  try {
    const response = await api.get(`/voluntarios/${id}`);
    const mappedData = mapBackendToFrontend(response.data);
    return mappedData;
  } catch (error) {
    console.error('Erro ao buscar voluntário:', error);
    throw error;
  }
};

export const createVoluntario = async (voluntario) => {
  try {
    const backendData = mapFrontendToBackend(voluntario);
    const response = await api.post('/voluntarios', backendData);
    console.log('Voluntário criado:', response.data);
    
    // Salvar foto se existir
    if (voluntario.fotoBase64) {
      await salvarFoto(response.data.id, voluntario.fotoBase64);
      console.log(`Foto salva para o novo voluntário ID: ${response.data.id}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar voluntário:', error);
    throw error;
  }
};

export const updateVoluntario = async (id, voluntario) => {
  try {
    const backendData = mapFrontendToBackend(voluntario);
    const response = await api.put(`/voluntarios/${id}`, backendData);
    
    // Atualizar foto se existir
    if (voluntario.fotoBase64) {
      await salvarFoto(id, voluntario.fotoBase64);
      console.log(`Foto atualizada para o voluntário ID: ${id}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar voluntário:', error);
    throw error;
  }
};

export const deleteVoluntario = async (id) => {
  try {
    const response = await api.delete(`/voluntarios/${id}`);
    // Remover foto
    localStorage.removeItem(`foto_${id}`);
    delete fotosStorage[id];
    console.log(`Foto removida para o voluntário ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar voluntário:', error);
    throw error;
  }
};

export default api;