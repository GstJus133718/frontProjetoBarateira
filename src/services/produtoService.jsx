import api from '../api/client';

export const produtoService = {
  // Listar todos os produtos com paginação
  listar: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/admin/produtos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Listar TODOS os produtos (sem paginação) - para busca
  listarTodos: async () => {
    try {
      const response = await api.get('/admin/produtos?limit=1000'); // Limite alto para pegar todos
      return response.data;
    } catch (error) {
      console.error('Erro ao listar todos os produtos:', error);
      throw error;
    }
  },

  // Buscar produto por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/admin/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  // Criar novo produto
  criar: async (produtoData) => {
    try {
      const response = await api.post('/admin/produtos', produtoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar produto
  atualizar: async (id, produtoData) => {
    try {
      const response = await api.patch(`/admin/produtos/${id}`, produtoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  // Deletar produto
  deletar: async (id) => {
    try {
      const response = await api.delete(`/admin/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  }
};