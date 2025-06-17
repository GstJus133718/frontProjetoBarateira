import api from '../api/client';
import { filialService } from './filialService';

// Serviços de API para estoque
export const estoqueService = {
  // Listar estoque por produto
  listarPorProduto: async (produtoId) => {
    try {
      const response = await api.get(`/staff/estoque/${produtoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar estoque do produto ${produtoId}:`, error);
      throw error;
    }
  },

  // Criar novo estoque
  criar: async (estoqueData) => {
    try {
      const response = await api.post('/staff/estoque', estoqueData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar estoque:', error);
      throw error;
    }
  },

  // Atualizar estoque
  atualizar: async (id, estoqueData) => {
    try {
      const response = await api.patch(`/staff/estoque/${id}`, estoqueData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar estoque ${id}:`, error);
      throw error;
    }
  },

  // Deletar estoque
  deletar: async (id) => {
    try {
      const response = await api.delete(`/admin/estoque/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar estoque ${id}:`, error);
      throw error;
    }
  },

  // Listar todas as filiais usando o serviço correto
  listarFiliais: async () => {
    try {
      // Usar o filialService que já está configurado
      return await filialService.listar();
    } catch (error) {
      console.error('Erro ao listar filiais para estoque:', error);
      throw error;
    }
  }
};