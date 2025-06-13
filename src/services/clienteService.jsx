import api from '../api/client';

// Serviços de API para clientes
export const clienteService = {
  // Listar todos os clientes
  listar: async () => {
    try {
      const response = await api.get('/admin/clientes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Buscar cliente por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/admin/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  },

  // Criar novo cliente
  criar: async (clienteData) => {
    try {
      const response = await api.post('/admin/clientes', clienteData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  atualizar: async (id, clienteData) => {
    try {
      const response = await api.patch(`/admin/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  },

  // Deletar cliente
  deletar: async (id) => {
    try {
      const response = await api.delete(`/admin/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar cliente ${id}:`, error);
      throw error;
    }
  }
};