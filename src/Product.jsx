import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card, 
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Avatar,
    Divider,
    Paper, 
    Rating,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Link
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate, useParams } from "react-router-dom";

// Importar serviço público de produtos
import { produtoPublicoService } from './services/produtoPublicoService';

// Mock data (manter para fallback)
const produtosMock = [
    // ... (mock data mantido como fallback)
];

// Função auxiliar para limpar e converter preço para número
const limparEConverterPreco = (precoStr) => {
    if (typeof precoStr !== 'string') {
        const num = parseFloat(precoStr);
        return isNaN(num) ? 0 : num;
    }
    const valorLimpo = precoStr.replace(/[^\d,.-]/g, "").replace(",", ".");
    const valorNum = parseFloat(valorLimpo);
    return isNaN(valorNum) ? 0 : valorNum;
};

// Função auxiliar para formatar número como moeda BRL
const formatarParaMoedaBRL = (valorNum) => {
    if (isNaN(valorNum)) return "R$ 0,00";
    return `R$ ${valorNum.toFixed(2)}`.replace(".", ",");
};

const Product = () => {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarProduto = async () => {
            setLoading(true);
            setError(null);
            setProduto(null);
            setImagemPrincipal(0);

            try {
                console.log('Carregando produto da API pública, ID:', id);
                
                // Buscar produto da API pública
                const response = await produtoPublicoService.buscarPorId(id);
                console.log('Response da API produto público:', response);
                
                // Extrair dados do produto
                let produtoData = null;
                if (response && response.produto) {
                    produtoData = response.produto;
                } else if (response) {
                    produtoData = response;
                }
                
                if (produtoData) {
                    // Formatar produto da API para o frontend
                    const produtoFormatado = {
                        id: produtoData.id,
                        nome: produtoData.nome || '',
                        marca: produtoData.marca || 'Marca não informada',
                        principio_ativo: produtoData.principio_ativo || '',
                        departamento: produtoData.departamento || '',
                        categoria: produtoData.departamento || '', // Para compatibilidade
                        preco_unitario: produtoData.preco_unitario || 0,
                        valor_real: produtoData.valor_real || produtoData.preco_unitario || 0,
                        economia: produtoData.economia || 0,
                        em_promocao: produtoData.em_promocao || false,
                        desconto: produtoData.desconto || 0,
                        generico: produtoData.generico || false,
                        // Para compatibilidade com display
                        preco: formatarParaMoedaBRL(produtoData.valor_real || produtoData.preco_unitario || 0),
                        descricao: produtoData.descricao || "Sem descrição disponível.",
                        imagens: produtoData.imagens || [],
                        // Disponibilidade por filial
                        disponibilidadeFiliais: response.disponivel_em ? 
                            response.disponivel_em.map(filial => ({
                                filial: filial.filial_nome,
                                quantidade: filial.quantidade,
                                disponivel: filial.disponivel
                            })) : [],
                        // Manter dados originais
                        ...produtoData
                    };
                    
                    setProduto(produtoFormatado);
                } else {
                    throw new Error('Produto não encontrado na API');
                }
                
            } catch (error) {
                console.error('Erro ao carregar produto da API:', error);
                
                // Fallback: tentar carregar do localStorage
                console.log('Tentando fallback do localStorage...');
                
                try {
                    const storedProdutosStr = localStorage.getItem("produtos");
                    let todosProdutos = [];

                    if (storedProdutosStr) {
                        todosProdutos = JSON.parse(storedProdutosStr);
                        // Adaptação para estrutura antiga (se necessário)
                        todosProdutos = todosProdutos.map(p => {
                            if (!p.disponibilidadeFiliais && p.estoque !== undefined && p.filial) {
                                return { ...p, disponibilidadeFiliais: [{ filial: p.filial, quantidade: p.estoque }] };
                            }
                            if (!Array.isArray(p.disponibilidadeFiliais)) {
                                 p.disponibilidadeFiliais = [];
                            }
                            return p;
                        });
                    } else {
                        todosProdutos = produtosMock;
                    }

                    // Encontrar Produto no localStorage
                    const produtoEncontrado = todosProdutos.find(p => String(p.id) === String(id));

                    if (produtoEncontrado) {
                        // Garantir que disponibilidadeFiliais exista
                        if (!Array.isArray(produtoEncontrado.disponibilidadeFiliais)) {
                            produtoEncontrado.disponibilidadeFiliais = [];
                        }
                        setProduto(produtoEncontrado);
                    } else {
                        throw new Error('Produto não encontrado');
                    }
                    
                } catch (fallbackError) {
                    console.error('Erro no fallback:', fallbackError);
                    setError("Produto não encontrado.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            carregarProduto();
        }
    }, [id]);

    const handleImagemClick = (index) => setImagemPrincipal(index);

    const gerarLinkWhatsApp = () => {
        if (!produto) return "#";
        const numero = "5542998281755"; // Substituir pelo número correto
        const mensagem = `Olá! Tenho interesse no produto: ${produto.nome} (ID: ${produto.id}). Poderia me dar mais informações?`;
        return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Carregando produto...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!produto) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Typography>Não foi possível carregar o produto.</Typography>
            </Box>
        );
    }

    // Determinar preços e desconto com base nos novos campos da API
    let precoFinal = formatarParaMoedaBRL(produto.valor_real || produto.preco_unitario || 0);
    let precoAntigo = null;
    let descontoPercentual = produto.desconto || 0;
    let economia = produto.economia || 0;

    // Se tem promoção ativa, mostrar preço original e economia
    if (produto.em_promocao && economia > 0) {
        precoAntigo = formatarParaMoedaBRL(produto.preco_unitario || 0);
    }

    const imagensProduto = produto.imagens || [];
    const disponibilidade = produto.disponibilidadeFiliais || [];

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Navbar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: 1, backgroundColor: "#fff", boxShadow: 1 }}>
                {/* Logo e Botão Voltar */}
                 <Avatar src="/logo/logo_3.png" alt="A Barateira" variant="square" sx={{ width: 150, height: 'auto', objectFit: 'contain' }} />
                 <Button variant="outlined" onClick={() => navigate(-1)}>Voltar</Button>
            </Box>

            <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
                {/* Breadcrumbs */}
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                    Home &gt; {produto.categoria || produto.departamento || "Categoria"} &gt; {produto.nome}
                </Typography>

                {/* Card Único do Produto */}
                <Paper elevation={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 2 }}>
                    {/* Coluna da Esquerda: Imagens */}
                    <Box sx={{ width: { xs: '100%', md: '45%' }, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                        <CardMedia
                            component="img"
                            image={imagensProduto.length > 0 ? imagensProduto[imagemPrincipal] : "/icons/product_icon.svg"}
                            alt={produto.nome}
                            onError={(e) => e.target.src = "/icons/product_icon.svg"}
                            sx={{ width: '100%', height: { xs: 250, sm: 350 }, objectFit: "contain", mb: 2, border: '1px solid #eee', borderRadius: 1 }}
                        />
                        {/* Miniaturas */}
                        {imagensProduto.length > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: 'wrap', gap: 1 }}>
                                {imagensProduto.map((img, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={img}
                                        alt={`img${index}`}
                                        onError={(e) => e.target.src = "/icons/product_icon.svg"}
                                        sx={{ width: 60, height: 60, objectFit: "cover", border: index === imagemPrincipal ? "2px solid #0C58A3" : "1px solid #ccc", borderRadius: 1, cursor: "pointer", opacity: 0.7, '&:hover': { opacity: 1 } }}
                                        onClick={() => handleImagemClick(index)}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Coluna da Direita: Informações */}
                    <Box sx={{ width: { xs: '100%', md: '55%' }, p: { xs: 1, md: 2 } }}>
                        <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>{produto.nome}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>{produto.marca || "Marca não informada"}</Typography>
                        
                        {/* Princípio Ativo */}
                        {produto.principio_ativo && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Princípio Ativo:</strong> {produto.principio_ativo}
                            </Typography>
                        )}
                        
                        {/* Genérico */}
                        {produto.generico && (
                            <Typography variant="body2" color="info.main" sx={{ mb: 1, fontWeight: 'bold' }}>
                                💊 Medicamento Genérico
                            </Typography>
                        )}
                        
                        {/* Descrição */}
                        <Typography variant="body2" sx={{ mb: 2 }}>{produto.descricao || "Sem descrição disponível."}</Typography>

                        {/* Preços e Desconto */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 2, minHeight: '2.5em' }}>
                            {precoAntigo && economia > 0 && (
                                <Typography sx={{ textDecoration: "line-through", color: "text.secondary", mr: 1, fontSize: '1rem' }}>
                                    {precoAntigo}
                                </Typography>
                            )}
                            {descontoPercentual > 0 && (
                                <Box component="span" sx={{ 
                                    backgroundColor: '#F15A2B', 
                                    color: 'white', 
                                    borderRadius: 1, 
                                    px: 1, 
                                    py: 0.5, 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold', 
                                    mr: 1 
                                }}>
                                    -{descontoPercentual}%
                                </Box>
                            )}
                            <Typography variant="h6" color="#0C58A3" sx={{ fontWeight: 600 }}>
                                {precoFinal}
                            </Typography>
                        </Box>

                        {/* Mostrar economia se houver */}
                        {economia > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                                    🎉 Você economiza R$ {economia.toFixed(2).replace('.', ',')} neste produto!
                                </Typography>
                            </Box>
                        )}

                        {/* Disponibilidade */}
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Disponível em:</Typography>
                        {disponibilidade.length > 0 ? (
                            <List dense sx={{ p: 0, mb: 2 }}>
                                {disponibilidade.map((item, index) => (
                                    <ListItem key={index} sx={{ p: 0 }}>
                                        <ListItemText 
                                            primary={`${item.filial}: ${item.quantidade} unidades`}
                                            primaryTypographyProps={{ 
                                                variant: 'body2', 
                                                color: item.quantidade > 0 ? 'text.primary' : 'text.secondary',
                                                sx: { display: 'flex', alignItems: 'center', gap: 1 }
                                            }}
                                        />
                                        {item.disponivel ? (
                                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', ml: 1 }}>
                                                ✅ Disponível
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold', ml: 1 }}>
                                                ❌ Indisponível
                                            </Typography>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>Consulte disponibilidade.</Typography> 
                        )}

                        {/* Botão WhatsApp */}
                        <Button
                            variant="contained"
                            startIcon={<WhatsAppIcon />}
                            href={gerarLinkWhatsApp()}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ backgroundColor: '#0C58A3', '&:hover': { backgroundColor: '#08407B' }, width: '100%', mt: 'auto' }}
                        >
                            Entrar em contato
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Product;