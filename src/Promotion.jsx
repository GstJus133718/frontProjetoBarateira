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

// Função auxiliar para formatar preço
const formatarParaMoedaBRL = (valorNum) => {
    if (isNaN(valorNum)) return "R$ 0,00";
    return `R$ ${valorNum.toFixed(2)}`.replace(".", ",");
};

const PromocoesDestaques = () => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar produtos em promoção da API usando a rota específica
  const carregarProdutosPromocao = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando produtos em promoção...');
      
      // Usar a rota exata que você mostrou
      const filtros = {
        page: 1,
        limit: 20,
        promocao: 'true',
        order_by: 'nome',
        order_dir: 'asc'
      };
      
      const response = await produtoPublicoService.listar(filtros);
      console.log('Response da API:', response);
      
      const produtosData = response.produtos || [];
      
      // Filtrar produtos que não são pediátricos
      const produtosFiltrados = produtosData.filter(produto => 
        produto.departamento && produto.departamento.toLowerCase() !== 'pediátricos'
      );
      
      setProdutos(produtosFiltrados);
      
    } catch (error) {
      console.error('Erro ao carregar produtos em promoção:', error);
      setError('Erro ao carregar promoções.');
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutosPromocao();
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const isOverflowing = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
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
          Promoções Destaques
        </Typography>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando promoções...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 4, py: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
          Promoções Destaques
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 6, position: "relative" }}>
      <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
        Promoções Destaques
      </Typography>

      {produtos.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Nenhuma promoção ativa no momento
        </Typography>
      ) : (
        <>
          {showArrows && (
            <>
              <IconButton
                onClick={() => scroll("left")}
                sx={{
                  position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: 1, zIndex: 1,
                  "&:hover": { backgroundColor: "#fff" }
                }}
              >
                <ArrowBackIos sx={{ pl: 0.5 }} />
              </IconButton>
              <IconButton
                onClick={() => scroll("right")}
                sx={{
                  position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: 1, zIndex: 1,
                  "&:hover": { backgroundColor: "#fff" }
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </>
          )}

          <Box
            ref={scrollRef}
            sx={{
              display: "flex", alignItems: "stretch", overflowX: "auto",
              gap: 3, px: 1, py: 2, scrollSnapType: "x mandatory",
              scrollBehavior: "smooth", scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {produtos.map((produto) => {
              return (
                <Box
                  key={produto.id}
                  sx={{ minWidth: 220, maxWidth: 220, scrollSnapAlign: "start", flexShrink: 0, cursor: "pointer" }}
                  onClick={() => handleCardClick(produto.id)}
                >
                  <Card
                    sx={{
                      textAlign: "center", padding: 2, boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                      height: "100%", display: "flex", flexDirection: "column",
                      justifyContent: "space-between", borderRadius: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="/icons/product_icon.svg"
                      alt={produto.nome}
                      sx={{ height: 100, width: "auto", margin: "0 auto", objectFit: "contain", mb: 1 }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 1 }}>
                      <Typography
                        variant="body1" fontWeight="bold" gutterBottom
                        sx={{ minHeight: "2.5em", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                      >
                        {produto.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        {produto.marca}
                      </Typography>

                      {/* Preço original riscado + Badge desconto */}
                      {produto.desconto > 0 && (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={0.5} mb={0.5}>
                          <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                            {formatarParaMoedaBRL(produto.preco_unitario)}
                          </Typography>
                          <Box height={20} px={0.8} backgroundColor={"#F15A2B"} borderRadius={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Typography variant="caption" color="#fff" fontWeight="bold">
                              -{produto.desconto}%
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Preço final */}
                      <Typography variant="h6" fontWeight="bold" mt={produto.desconto > 0 ? 0.5 : 1.5} color={"#0C58A3"}>
                        {formatarParaMoedaBRL(produto.valor_real)}
                      </Typography>
                      
                      {/* Economia */}
                      {produto.economia > 0 && (
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block', mt: 0.5 }}>
                          Economize R$ {produto.economia.toFixed(2).replace('.', ',')}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PromocoesDestaques;