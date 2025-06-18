import api from '../api/client';

// Serviços de API para vendas
export const vendaService = {
  // Criar nova venda
  criar: async (vendaData) => {
    try {
      const response = await api.post('/staff/vendas', vendaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      throw error;
    }
  },

  // Listar vendas (se necessário)
  listar: async () => {
    try {
      const response = await api.get('/staff/vendas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      throw error;
    }
  },

  // Buscar venda por ID (se necessário)
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/staff/vendas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar venda ${id}:`, error);
      throw error;
    }
  }
};