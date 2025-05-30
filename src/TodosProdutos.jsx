import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Container,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Alert // Importar Alert para feedback da busca
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom'; // <<< Importar useLocation
import Navbar from './NavBar';

// Mock data (manter para fallback)
const produtosMock = [
    // ... (seu mock data aqui, se necessário como fallback)
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

const TodosProdutos = () => {
    const navigate = useNavigate();
    const location = useLocation(); // <<< Hook para ler a URL
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [filiais, setFiliais] = useState([]);

    // Estados dos filtros
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroFilial, setFiltroFilial] = useState('');
    const [ordenacao, setOrdenacao] = useState('');
    const [termoBusca, setTermoBusca] = useState(''); // <<< Estado para o termo de busca da URL

    // Efeito para carregar produtos iniciais e extrair filtros
    useEffect(() => {
        setLoading(true);
        const storedProdutosStr = localStorage.getItem("produtos");
        let todosProdutos = [];

        if (storedProdutosStr) {
            try {
                todosProdutos = JSON.parse(storedProdutosStr);
                 todosProdutos = todosProdutos.map(p => {
                     if (!p.disponibilidadeFiliais && p.estoque !== undefined && p.filial) {
                         return { ...p, disponibilidadeFiliais: [{ filial: p.filial, quantidade: p.estoque }] };
                     }
                     if (!Array.isArray(p.disponibilidadeFiliais)) {
                          p.disponibilidadeFiliais = [];
                     }
                     if (typeof p.preco !== 'string') {
                         p.preco = formatarParaMoedaBRL(p.preco || 0);
                     }
                     // Adicionar campo principioAtivo mockado se não existir (para teste)
                     // if (!p.principioAtivo) {
                     //     p.principioAtivo = `Princípio ${p.id}`;
                     // }
                     return p;
                 });
            } catch (e) {
                console.error("Erro ao parsear produtos do localStorage:", e);
                todosProdutos = produtosMock;
            }
        } else {
            todosProdutos = produtosMock;
        }

        setProdutos(todosProdutos);

        const cats = [...new Set(todosProdutos.map(p => p.categoria).filter(Boolean))];
        const fils = [...new Set(todosProdutos.flatMap(p => p.disponibilidadeFiliais?.map(f => f.filial)).filter(Boolean))];
        setCategorias(cats);
        setFiliais(fils);

        setLoading(false);
    }, []);

    // Efeito para ler o termo de busca da URL quando a localização mudar
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        setTermoBusca(query || ''); // Define o termo de busca ou vazio se não houver
    }, [location.search]);

    // Efeito para aplicar TODOS os filtros (busca, categoria, filial, ordenação)
    useEffect(() => {
        let produtosProcessados = [...produtos];

        // <<< 1. Filtrar pelo termo de busca (se existir)
        if (termoBusca) {
            const termoLower = termoBusca.toLowerCase();
            produtosProcessados = produtosProcessados.filter(p =>
                p.nome?.toLowerCase().includes(termoLower) ||
                p.marca?.toLowerCase().includes(termoLower) ||
                p.principioAtivo?.toLowerCase().includes(termoLower) // Busca no princípio ativo (se existir)
            );
        }

        // 2. Filtrar por categoria
        if (filtroCategoria) {
            produtosProcessados = produtosProcessados.filter(p => p.categoria === filtroCategoria);
        }

        // 3. Filtrar por filial
        if (filtroFilial) {
            produtosProcessados = produtosProcessados.filter(p =>
                p.disponibilidadeFiliais?.some(f => f.filial === filtroFilial && f.quantidade > 0)
            );
        }

        // 4. Ordenar
        if (ordenacao === 'preco_asc') {
            produtosProcessados.sort((a, b) => limparEConverterPreco(a.preco) - limparEConverterPreco(b.preco));
        } else if (ordenacao === 'preco_desc') {
            produtosProcessados.sort((a, b) => limparEConverterPreco(b.preco) - limparEConverterPreco(a.preco));
        }

        setProdutosFiltrados(produtosProcessados);

    }, [produtos, termoBusca, filtroCategoria, filtroFilial, ordenacao]); // <<< Adicionar termoBusca às dependências

    const handleCardClick = (id) => {
        navigate(`/admin/product/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Navbar /> {/* <<< Usar a Navbar com busca (renomear import se necessário) */}

            <Container sx={{ py: 2 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ textTransform: 'none' }}
                    >
                        Voltar
                    </Button>
                </Box>

                {/* <<< Mostrar feedback se houver termo de busca */}
                {termoBusca && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Resultados da busca por: <strong>"{termoBusca}"</strong>
                    </Alert>
                )}

                <Typography variant="h4" component="h1" gutterBottom>
                    {termoBusca ? 'Resultados da Busca' : 'Todos os Produtos'}
                </Typography>

                {/* Controles de Filtro e Ordenação */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel id="categoria-label">Categoria</InputLabel>
                        <Select
                            labelId="categoria-label"
                            value={filtroCategoria}
                            label="Categoria"
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {categorias.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel id="filial-label">Filial</InputLabel>
                        <Select
                            labelId="filial-label"
                            value={filtroFilial}
                            label="Filial"
                            onChange={(e) => setFiltroFilial(e.target.value)}
                        >
                            <MenuItem value=""><em>Todas</em></MenuItem>
                            {filiais.map(fil => (
                                <MenuItem key={fil} value={fil}>{fil}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180 }} size="small">
                        <InputLabel id="ordenacao-label">Ordenar por Preço</InputLabel>
                        <Select
                            labelId="ordenacao-label"
                            value={ordenacao}
                            label="Ordenar por Preço"
                            onChange={(e) => setOrdenacao(e.target.value)}
                        >
                            <MenuItem value=""><em>Padrão</em></MenuItem>
                            <MenuItem value="preco_asc">Menor para Maior</MenuItem>
                            <MenuItem value="preco_desc">Maior para Menor</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Grid de Produtos */}
                <Grid container spacing={3}>
                    {produtosFiltrados.length > 0 ? (
                        produtosFiltrados.map((produto) => (
                            <Grid item key={produto.id} xs={12} sm={6} md={4} lg={3}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => handleCardClick(produto.id)}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={produto.imagem || produto.imagens?.[0] || "/icons/product_icon.svg"}
                                        alt={produto.nome}
                                        sx={{ objectFit: 'contain', pt: 1 }}
                                        onError={(e) => e.target.src = "/icons/product_icon.svg"}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                                            {produto.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {produto.marca || 'Marca não informada'}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            {produto.preco}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                            {termoBusca 
                                ? `Nenhum produto encontrado para "${termoBusca}". Tente outros termos ou limpe os filtros.`
                                : 'Nenhum produto encontrado com os filtros selecionados.'}
                        </Typography>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default TodosProdutos;

