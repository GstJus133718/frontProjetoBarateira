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

// Simulação de dados - Usado apenas se o localStorage estiver vazio ou inválido
const produtosMock = [
  // ... (seu mock data aqui, se necessário como fallback)
];

// Função auxiliar para formatar moeda BRL
const formatarParaMoedaBRL = (valorNum) => {
    // Verifica se valorNum é um número válido
    if (typeof valorNum !== 'number' || isNaN(valorNum)) {
        // Tenta converter se for string
        const num = limparEConverterPreco(valorNum);
        if (isNaN(num)) return "R$ 0,00";
        valorNum = num;
    }
    return `R$ ${valorNum.toFixed(2)}`.replace(".", ",");
};

// Função auxiliar para limpar e converter preço para número
const limparEConverterPreco = (precoStr) => {
    if (typeof precoStr === 'number' && !isNaN(precoStr)) {
        return precoStr; // Já é um número válido
    }
    if (typeof precoStr !== 'string') {
        return 0; // Retorna 0 se não for string nem número
    }
    const valorLimpo = precoStr.replace(/[^\d,.-]/g, "").replace(",", ".");
    const valorNum = parseFloat(valorLimpo);
    return isNaN(valorNum) ? 0 : valorNum;
};

// Função segura para calcular preço com desconto
const calcularPrecoComDescontoSeguro = (precoOriginal, promocaoInfo) => {
    if (!promocaoInfo || typeof promocaoInfo !== 'object') {
        return precoOriginal;
    }

    let precoComDesconto = precoOriginal;

    // Tenta usar valorComDescontoPromocao (que veio de promocaoInfo.valorComDesconto)
    if (promocaoInfo.valorComDescontoPromocao) {
        const valorComDescontoNum = limparEConverterPreco(promocaoInfo.valorComDescontoPromocao);
        if (valorComDescontoNum > 0 && valorComDescontoNum < precoOriginal) {
            precoComDesconto = valorComDescontoNum;
            return precoComDesconto;
        }
    }

    // Tenta calcular pelo percentual (descontoPromocao veio de promocaoInfo.desconto)
    if (promocaoInfo.descontoPromocao && typeof promocaoInfo.descontoPromocao === 'string') {
        const percentualMatch = promocaoInfo.descontoPromocao.match(/(\d+)/);
        if (percentualMatch) {
            const percentual = parseFloat(percentualMatch[1]);
            if (percentual > 0 && percentual < 100) {
                const descontoValor = precoOriginal * (percentual / 100);
                const precoCalculado = precoOriginal - descontoValor;
                if (precoCalculado > 0 && precoCalculado < precoOriginal) {
                    precoComDesconto = precoCalculado;
                    return precoComDesconto;
                }
            }
        }
    }

    return precoOriginal;
};

const PromocoesDestaques = () => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [produtosEmPromocaoFiltrados, setProdutosEmPromocaoFiltrados] = useState([]);

  // Carrega produtos e promoções do localStorage na montagem
  useEffect(() => {
    let produtosCarregados = produtosMock;
    try {
      const storedProdutos = localStorage.getItem("produtos");
      if (storedProdutos) {
        const parsed = JSON.parse(storedProdutos);
        if (Array.isArray(parsed)) produtosCarregados = parsed;
      }
    } catch (error) {
      console.error("[PromocoesDestaques] Erro ao carregar/parsear produtos:", error);
    }
    setProdutos(produtosCarregados);

    let promocoesCarregadas = [];
    try {
      const storedPromocoes = localStorage.getItem("promocoes");
      if (storedPromocoes) {
        const parsed = JSON.parse(storedPromocoes);
        if (Array.isArray(parsed)) promocoesCarregadas = parsed;
      }
    } catch (error) {
      console.error("[PromocoesDestaques] Erro ao carregar/parsear promoções:", error);
    }
    setPromocoes(promocoesCarregadas);

  }, []);

  // Filtra os produtos que estão em promoção ativa e não são infantis
  useEffect(() => {
    const promocoesValidas = Array.isArray(promocoes) ? promocoes : [];
    const produtosValidos = Array.isArray(produtos) ? produtos : [];

    const promocoesAtivas = promocoesValidas.filter(p => p.status === "Ativo");

    const promocoesAtivasMap = new Map();
    promocoesAtivas.forEach(promo => {
        if (promo.id != null) {
             const promoIdNormalizado = String(promo.id);
             // Se já existe uma promoção para este ID, não sobrescreva (ou decida qual manter)
             // Por enquanto, a última encontrada para o ID prevalece.
             promocoesAtivasMap.set(promoIdNormalizado, promo);
        }
    });

    const produtosFiltrados = produtosValidos.filter(produto => {
        if (produto.id == null) return false;
        const produtoIdNormalizado = String(produto.id);
        const temPromocaoAtiva = promocoesAtivasMap.has(produtoIdNormalizado);
        const naoEhInfantil = produto.categoria?.toLowerCase() !== "produtos infantis";
        return temPromocaoAtiva && naoEhInfantil;
    });

    const produtosComDetalhesPromocao = produtosFiltrados.map(produto => {
        const produtoIdNormalizado = String(produto.id);
        const promocaoInfo = promocoesAtivasMap.get(produtoIdNormalizado);

        return {
            ...produto,
            descontoPromocao: promocaoInfo?.desconto,
            valorComDescontoPromocao: promocaoInfo?.valorComDesconto,
            precoOriginalPromocao: promocaoInfo?.valor
        };
    });

    setProdutosEmPromocaoFiltrados(produtosComDetalhesPromocao);

  }, [produtos, promocoes]);

  // Verifica overflow para mostrar setas de rolagem
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const isOverflowing =
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setShowArrows(isOverflowing);
      }
    };
    const timer = setTimeout(checkOverflow, 150);
    window.addEventListener("resize", checkOverflow);
    return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", checkOverflow);
    }
  }, [produtosEmPromocaoFiltrados]);

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
    if (produtoId == null) return;
    navigate(`/admin/product/${String(produtoId)}`);
  };

  return (
    <Box sx={{ px: 4, py: 6, position: "relative" }}>
      <Typography variant="h5" fontWeight="bold" mb={4} color="#000">
        Promoções Destaques
      </Typography>

      {produtosEmPromocaoFiltrados.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Em breve novidades
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
                  "&:hover": { backgroundColor: "#fff" }, mt: -3
                }}
              >
                <ArrowBackIos sx={{ pl: 0.5 }} />
              </IconButton>
              <IconButton
                onClick={() => scroll("right")}
                sx={{
                  position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", boxShadow: 1, zIndex: 1,
                  "&:hover": { backgroundColor: "#fff" }, mt: -3
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
            {produtosEmPromocaoFiltrados.map((produto) => {
              const descontoNum = parseInt(produto.descontoPromocao?.replace(/[^\d]/g, '') || 0);
              const temDescontoValido = descontoNum > 0;

              const precoOriginalBase = limparEConverterPreco(produto.precoOriginalPromocao || produto.preco);
              const precoFinalNum = calcularPrecoComDescontoSeguro(precoOriginalBase, produto);

              const precoFinalFormatado = formatarParaMoedaBRL(precoFinalNum);
              const precoAntigoFormatado = formatarParaMoedaBRL(precoOriginalBase);
              const mostrarPrecoAntigo = temDescontoValido && precoOriginalBase > precoFinalNum;

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
                      image={produto.imagem || produto.imagens?.[0] || "/icons/product_icon.svg"}
                      alt={produto.nome}
                      onError={(e) => e.target.src = "/icons/product_icon.svg"}
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
                        {produto.marca || "Marca não informada"}
                      </Typography>

                      {mostrarPrecoAntigo && (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={0.5} mb={0.5}>
                          <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                            {precoAntigoFormatado}
                          </Typography>
                          <Box height={20} px={0.8} backgroundColor={"#F15A2B"} borderRadius={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Typography variant="caption" color="#fff" fontWeight="bold" textAlign={"center"}>
                              -{descontoNum}%
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Typography variant="h6" fontWeight="bold" mt={mostrarPrecoAntigo ? 0.5 : 1.5} color={"#0C58A3"}>
                        {precoFinalFormatado}
                      </Typography>
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

