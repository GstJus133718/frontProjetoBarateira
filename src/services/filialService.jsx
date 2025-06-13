import api from '../api/client';

// Serviços de API para filiais
export const filialService = {
  listarPublico: async () => {
    try {
      console.log('🔍 Chamando API pública de filiais...');
      const response = await api.get('/filiais/lista');
      console.log('✅ Response da API filiais públicas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar filiais públicas:', error);
      
      // Log detalhado do erro para debug
      if (error.response) {
        console.error('Response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Setup error:', error.message);
      }
      
      throw error;
    }
  },

  // Listar todas as filiais (rota administrativa)
  listar: async () => {
    try {
      const response = await api.get('/admin/filiais');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar filiais:', error);
      throw error;
    }
  },

  // Buscar filial por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/admin/filiais/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar filial ${id}:`, error);
      throw error;
    }
  },

  // Criar nova filial
  criar: async (filialData) => {
    try {
      const response = await api.post('/admin/filiais', filialData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar filial:', error);
      throw error;
    }
  },

  // Atualizar filial
  atualizar: async (id, filialData) => {
    try {
      const response = await api.patch(`/admin/filiais/${id}`, filialData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar filial ${id}:`, error);
      throw error;
    }
  },

  // Deletar filial
  deletar: async (id) => {
    try {
      const response = await api.delete(`/admin/filiais/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar filial ${id}:`, error);
      throw error;
    }
  }
};