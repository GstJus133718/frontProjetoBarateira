import api from '../api/client';

// Serviços de API públicas para produtos (para clientes)
export const produtoPublicoService = {
  // Listar produtos com filtros avançados
  listar: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros apenas se tiverem valor
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/produtos/listar?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos públicos:', error);
      throw error;
    }
  },

  // Buscar apenas produtos em promoção
  listarPromocoes: async (page = 1, limit = 12) => {
    try {
      const response = await api.get(`/produtos/promocao?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos em promoção:', error);
      throw error;
    }
  },

  // Buscar produto específico por ID
  buscarPorId: async (id, filialId = null) => {
    try {
      const url = filialId ? `/produtos/${id}?filial_id=${filialId}` : `/produtos/${id}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  listarProdutosPediatricos: async (page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams();
      params.append('departamento', 'Pediátricos');
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('order_by', 'nome');
      params.append('order_dir', 'asc');
      
      const response = await api.get(`/produtos/listar?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos pediátricos:', error);
      throw error;
    }
  },


  // Listar departamentos disponíveis
  listarDepartamentos: async () => {
    try {
      const response = await api.get('/produtos/info/departamentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar departamentos:', error);
      throw error;
    }
  }
};