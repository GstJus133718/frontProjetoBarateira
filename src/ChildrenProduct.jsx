import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Simulação de dados - Em um app real, viria do localStorage ou API
const produtosMock = [
  {
    id: "7", // IDs diferentes dos outros mocks para evitar conflito
    nome: "Produto Infantil 1",
    marca: "Marca Kids A",
    imagem: "/icons/product_icon.svg",
    precoAntigo: 49.90,
    desconto: 15,
    preco: "R$ 42,41",
    categoria: "Produtos Infantis", // Categoria correta
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
  },
   {
    id: "10",
    nome: "Outro Produto", // Produto de outra categoria para teste de filtro
    marca: "Marca Outra",
    imagem: "/icons/product_icon.svg",
    precoAntigo: 100.00,
    desconto: 10,
    preco: "R$ 90,00",
    categoria: "Outra Categoria",
  },
];

// --- Funções Auxiliares (Copiar/Importar de Cards_sintaxe_corrigida.jsx ou definir aqui) ---
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
// --- Fim Funções Auxiliares ---

const ProdutosInfantis = () => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Carrega todos os produtos
    const storedProdutos = localStorage.getItem("produtos");
    let todosProdutos = [];
    if (storedProdutos) {
      try {
        todosProdutos = JSON.parse(storedProdutos);
      } catch (error) {
        console.error("Erro ao carregar produtos do localStorage:", error);
        todosProdutos = produtosMock;
      }
    } else {
      todosProdutos = produtosMock;
    }
    // Filtra pela categoria "Produtos Infantis" (case-insensitive)
    const produtosFiltrados = todosProdutos.filter(
        p => p.categoria && p.categoria.toLowerCase() === "produtos infantis"
    );
    setProdutos(produtosFiltrados);

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
    // Navega para a página de detalhes do produto
    navigate(`/admin/product/${produtoId}`);
  };

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
          minHeight: produtos.length === 0 ? 'auto' : 350 // Altura mínima para evitar colapso
        }}
      >
        {produtos.length === 0 ? (
            <Typography sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                Nenhum produto infantil encontrado.
            </Typography>
        ) : (
            produtos.map((produto) => {
              const precoAntigoNum = limparEConverterPreco(produto.precoAntigo);
              const descontoNum = parseFloat(produto.desconto) || 0;
              const temDescontoValido = descontoNum > 0 && !isNaN(precoAntigoNum) && precoAntigoNum > 0;

              const precoFinalNum = temDescontoValido 
                  ? precoAntigoNum * (1 - descontoNum / 100) 
                  : limparEConverterPreco(produto.preco);
              
              const precoFinalFormatado = formatarParaMoedaBRL(precoFinalNum);
              const precoAntigoFormatado = formatarParaMoedaBRL(precoAntigoNum);

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
                  {/* --- CARD PADRONIZADO (igual ao Cards_sintaxe_corrigida.jsx) --- */}
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
                      image={produto.imagem || "/icons/product_icon.svg"}
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
                    </CardContent>
                  </Card>
                  {/* --- FIM CARD PADRONIZADO --- */}
                </Box>
              );
            })
        )}
      </Box>
    </Box>
  );
};

export default ProdutosInfantis;

