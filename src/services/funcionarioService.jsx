import api from '../api/client';

// Serviços de API para funcionários
export const funcionarioService = {
  // Listar todos os funcionários
  listar: async () => {
    try {
      const response = await api.get('/admin/funcionarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      throw error;
    }
  },

  // Buscar funcionário por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/admin/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      throw error;
    }
  },

  // Criar novo funcionário
  criar: async (funcionarioData) => {
    try {
      const response = await api.post('/admin/funcionarios', funcionarioData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },

  // Atualizar funcionário
  atualizar: async (id, funcionarioData) => {
    try {
      const response = await api.patch(`/admin/funcionarios/${id}`, funcionarioData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário ${id}:`, error);
      throw error;
    }
  },

  // Deletar funcionário
  deletar: async (id) => {
    try {
      const response = await api.delete(`/admin/funcionarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar funcionário ${id}:`, error);
      throw error;
    }
  }
};