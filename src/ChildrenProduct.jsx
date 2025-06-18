import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Importar serviço público de produtos
import { produtoPublicoService } from './services/produtoPublicoService';

// Simulação de dados - Usado apenas se a API falhar
const produtosMock = [
  {
    id: "7",
    nome: "Produto Infantil 1",
    marca: "Marca Kids A",
    imagem: "/icons/product_icon.svg",
    precoAntigo: 49.90,
    desconto: 15,
    preco: "R$ 42,41",
    categoria: "Produtos Infantis",
    departamento: "Pediátricos",
  },
  {
    id: "8",
    nome: "Produto Infantil 2",
    marca: "Marca Kids B",
    imagem: "/icons/product_icon.svg",
    precoAntigo: 79.90,
    desconto: 0,
    preco: "R$ 79,90",
    categoria: "Produtos Infantis",
    departamento: "Pediátricos",
  },
  {
    id: "9",
    nome: "Produto Infantil 3",
    marca: "Marca Kids C",
    imagem: "/icons/product_icon.svg",
    precoAntigo: 35.00,
    desconto: 5,
    preco: "R$ 33,25",
    categoria: "Produtos Infantis",
    departamento: "Pediátricos",
  }
];

// Funções auxiliares
const formatarParaMoedaBRL = (valorNum) => {
    if (isNaN(valorNum)) return "R$ 0,00";
    return `R$ ${valorNum.toFixed(2)}`.replace(".", ",");
};

const limparEConverterPreco = (precoStr) => {
    if (typeof precoStr !== 'string') {
        const num = parseFloat(precoStr);
        return isNaN(num) ? 0 : num;
    }
    const valorLimpo = precoStr.replace(/[^\d,.-]/g, "").replace(",", ".");
    const valorNum = parseFloat(valorLimpo);
    return isNaN(valorNum) ? 0 : valorNum;
};

const ProdutosInfantis = () => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar produtos pediátricos da API
  const carregarProdutosPediatricos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando produtos pediátricos da API...');
      const response = await produtoPublicoService.listarProdutosPediatricos(1, 50); // Carregar até 50 produtos
      
      console.log('Response da API produtos pediátricos:', response);
      
      // Extrair dados da resposta
      const produtosData = response.produtos || [];
      
      // Formatar produtos para exibição
      const produtosFormatados = produtosData.map(produto => ({
        id: produto.id,
        nome: produto.nome || '',
        marca: produto.marca || 'Marca não informada',
        principio_ativo: produto.principio_ativo || '',
        departamento: produto.departamento || '',
        categoria: 'Produtos Infantis', // Para compatibilidade
        preco_unitario: produto.preco_unitario || 0,
        valor_real: produto.valor_real || produto.preco_unitario || 0,
        economia: produto.economia || 0,
        em_promocao: produto.em_promocao || false,
        desconto: produto.desconto || 0,
        generico: produto.generico || false,
        // Para compatibilidade com display
        preco: formatarParaMoedaBRL(produto.valor_real || produto.preco_unitario || 0),
        imagens: produto.imagens || [],
        // Campos para compatibilidade com estrutura antiga
        precoAntigo: produto.preco_unitario || 0,
        imagem: produto.imagens?.[0] || "/icons/product_icon.svg",
        ...produto
      }));
      
      setProdutos(produtosFormatados);
      
    } catch (error) {
      console.error('Erro ao carregar produtos pediátricos da API:', error);
      
      // Fallback: tentar carregar do localStorage
      console.log('Tentando fallback do localStorage...');
      try {
        const storedProdutos = localStorage.getItem("produtos");
        let todosProdutos = [];
        
        if (storedProdutos) {
          todosProdutos = JSON.parse(storedProdutos);
        } else {
          todosProdutos = produtosMock;
        }
        
        // Filtrar produtos pediátricos/infantis
        const produtosFiltrados = todosProdutos.filter(p => 
          (p.departamento && p.departamento.toLowerCase() === "pediátricos") ||
          (p.categoria && p.categoria.toLowerCase() === "produtos infantis")
        );
        
        setProdutos(produtosFiltrados);
        
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        setError('Erro ao carregar produtos infantis.');
        setProdutos(produtosMock); // Usar mock como último recurso
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutosPediatricos();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const isOverflowing =
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setShowArrows(isOverflowing);
      }
    };
    
    if (produtos.length > 0) {
      setTimeout(checkOverflow, 100);
    }
    
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [produtos]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (produtoId) => {
    navigate(`/admin/product/${produtoId}`);
  };

  if (loading) {
    return (
      <Box sx={{ px: 4, py: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
          Produtos Infantis
        </Typography>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando produtos infantis...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 4, py: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
          Produtos Infantis
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 6, position: "relative" }}>
      <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
        Produtos Infantis
      </Typography>

      {showArrows && produtos.length > 0 && (
        <>
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: 1,
              zIndex: 1,
              "&:hover": { backgroundColor: "#fff" },
            }}
          >
            <ArrowBackIos sx={{ pl: 0.5 }} />
          </IconButton>

          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: 1,
              zIndex: 1,
              "&:hover": { backgroundColor: "#fff" },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          alignItems: "stretch",
          overflowX: "auto",
          gap: 3,
          px: 1,
          py: 2,
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          minHeight: produtos.length === 0 ? 'auto' : 350
        }}
      >
        {produtos.length === 0 ? (
          <Typography sx={{ width: '100%', textAlign: 'center', py: 5 }}>
            Nenhum produto infantil encontrado.
          </Typography>
        ) : (
          produtos.map((produto) => {
            // ✅ NOVO: Usar campos da API (valor_real, economia, desconto)
            const precoFinalNum = produto.valor_real || produto.preco_unitario || limparEConverterPreco(produto.preco);
            const precoOriginalNum = produto.preco_unitario || limparEConverterPreco(produto.precoAntigo || produto.preco);
            const economia = produto.economia || 0;
            const descontoNum = produto.desconto || parseFloat(produto.desconto) || 0;
            
            const temDescontoValido = (produto.em_promocao && economia > 0) || (descontoNum > 0 && precoOriginalNum > precoFinalNum);
            
            const precoFinalFormatado = formatarParaMoedaBRL(precoFinalNum);
            const precoAntigoFormatado = formatarParaMoedaBRL(precoOriginalNum);

            return (
              <Box
                key={produto.id}
                sx={{
                  minWidth: 220,
                  maxWidth: 220,
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(produto.id)}
              >
                <Card
                  sx={{
                    textAlign: "center",
                    padding: 2,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={produto.imagem || produto.imagens?.[0] || "/icons/product_icon.svg"}
                    alt={produto.nome}
                    onError={(e) => e.target.src = "/icons/product_icon.svg"}
                    sx={{
                      height: 100,
                      width: "auto",
                      margin: "0 auto",
                      objectFit: "contain",
                      mb: 1,
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ 
                        minHeight: "2.5em",
                        lineHeight: 1.25,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {produto.nome}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      gutterBottom
                    >
                      {produto.marca || "Marca não informada"}
                    </Typography>

                    {temDescontoValido && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                        mt={0.5}
                        mb={0.5}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {precoAntigoFormatado}
                        </Typography>
                        <Box
                          height={20}
                          px={0.8}
                          backgroundColor={"#F15A2B"}
                          borderRadius={1}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Typography
                            variant="caption"
                            color="#fff"
                            fontWeight="bold"
                            textAlign={"center"}
                          >
                            -{descontoNum}%
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mt={temDescontoValido ? 0.5 : 1.5}
                      color={"#0C58A3"}
                    >
                      {precoFinalFormatado}
                    </Typography>
                    
                    {/* ✅ NOVO: Mostrar economia */}
                    {economia > 0 && (
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block', mt: 0.5 }}>
                        Economize R$ {economia.toFixed(2).replace('.', ',')}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ProdutosInfantis;