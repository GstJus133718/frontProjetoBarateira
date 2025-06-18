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
    Alert,
    Pagination,
    TextField,
    Chip,
    InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './NavBar';

// Importar serviço público de produtos
import { produtoPublicoService } from './services/produtoPublicoService';

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
    const location = useLocation();
    
    // Estados principais
    const [produtos, setProdutos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados de paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [limitePorPagina] = useState(20);
    
    // Estados dos filtros
    const [filtros, setFiltros] = useState({
        departamento: '',
        generico: '',
        promocao: '',
        marca: '',
        principio_ativo: '',
        nome: '',
        preco_min: '',
        preco_max: '',
        order_by: 'nome',
        order_dir: 'asc'
    });
    
    // Estado para termo de busca da URL
    const [termoBusca, setTermoBusca] = useState('');
    const [buscaLocal, setBuscaLocal] = useState('');

    // Carregar produtos da API pública
    const carregarProdutos = async (pagina = 1, filtrosAplicados = {}) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Carregando produtos públicos...', { pagina, filtrosAplicados });
            
            const parametros = {
                page: pagina,
                limit: limitePorPagina,
                ...filtrosAplicados
            };
            
            const response = await produtoPublicoService.listar(parametros);
            console.log('Response da API produtos públicos:', response);
            
            // Extrair dados da resposta
            const produtosData = response.produtos || [];
            const paginacao = response.pagination || {};
            
            // Formatar produtos para exibição
            const produtosFormatados = produtosData.map(produto => ({
                id: produto.id,
                nome: produto.nome || '',
                marca: produto.marca || 'Marca não informada',
                principio_ativo: produto.principio_ativo || '',
                departamento: produto.departamento || '',
                categoria: produto.departamento || '', // Para compatibilidade
                preco_unitario: produto.preco_unitario || 0,
                valor_real: produto.valor_real || produto.preco_unitario || 0,
                economia: produto.economia || 0,
                em_promocao: produto.em_promocao || false,
                desconto: produto.desconto || 0,
                generico: produto.generico || false,
                // Para compatibilidade com display
                preco: formatarParaMoedaBRL(produto.valor_real || produto.preco_unitario || 0),
                imagens: produto.imagens || [],
                ...produto
            }));
            
            setProdutos(produtosFormatados);
            setPaginaAtual(paginacao.page || pagina);
            setTotalPaginas(paginacao.total_pages || 1);
            setTotalProdutos(paginacao.total || produtosFormatados.length);
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            
            // Fallback para localStorage
            console.log('Tentando fallback do localStorage...');
            try {
                const storedProdutosStr = localStorage.getItem("produtos");
                let todosProdutos = [];

                if (storedProdutosStr) {
                    todosProdutos = JSON.parse(storedProdutosStr);
                    todosProdutos = todosProdutos.map(p => {
                        if (!Array.isArray(p.disponibilidadeFiliais)) {
                            p.disponibilidadeFiliais = [];
                        }
                        if (typeof p.preco !== 'string') {
                            p.preco = formatarParaMoedaBRL(p.preco || 0);
                        }
                        return p;
                    });
                } else {
                    todosProdutos = produtosMock;
                }

                setProdutos(todosProdutos);
                setTotalProdutos(todosProdutos.length);
                setTotalPaginas(1);
                setPaginaAtual(1);
                
            } catch (fallbackError) {
                console.error('Erro no fallback:', fallbackError);
                setError('Erro ao carregar produtos. Tente novamente.');
                setProdutos([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Carregar departamentos
    const carregarDepartamentos = async () => {
        try {
            const response = await produtoPublicoService.listarDepartamentos();
            setDepartamentos(response.departamentos || []);
        } catch (error) {
            console.error('Erro ao carregar departamentos:', error);
            // Usar departamentos do fallback se necessário
            const cats = [...new Set(produtos.map(p => p.categoria || p.departamento).filter(Boolean))];
            setDepartamentos(cats);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        carregarDepartamentos();
    }, []);

    // Ler termo de busca da URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q');
        setTermoBusca(query || '');
        setBuscaLocal(query || '');
        
        // Se há termo de busca, aplicar nos filtros
        if (query) {
            setFiltros(prev => ({ ...prev, nome: query }));
        }
    }, [location.search]);

    // Carregar produtos quando filtros mudarem
    useEffect(() => {
        const filtrosLimpos = Object.fromEntries(
            Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null)
        );
        carregarProdutos(1, filtrosLimpos);
        setPaginaAtual(1);
    }, [filtros]);

    // Função para atualizar filtros
    const atualizarFiltro = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    // Função para aplicar busca local
    const handleBuscar = () => {
        setFiltros(prev => ({ ...prev, nome: buscaLocal }));
        setTermoBusca(buscaLocal);
        
        // Atualizar URL
        if (buscaLocal) {
            const newUrl = `${window.location.pathname}?q=${encodeURIComponent(buscaLocal)}`;
            window.history.pushState({}, '', newUrl);
        } else {
            window.history.pushState({}, '', window.location.pathname);
        }
    };

    // Função para limpar filtros
    const limparFiltros = () => {
        setFiltros({
            departamento: '',
            generico: '',
            promocao: '',
            marca: '',
            principio_ativo: '',
            nome: '',
            preco_min: '',
            preco_max: '',
            order_by: 'nome',
            order_dir: 'asc'
        });
        setBuscaLocal('');
        setTermoBusca('');
        window.history.pushState({}, '', window.location.pathname);
    };

    // Função para mudar página
    const handleMudarPagina = (event, novaPagina) => {
        if (novaPagina !== paginaAtual) {
            const filtrosLimpos = Object.fromEntries(
                Object.entries(filtros).filter(([_, value]) => value !== '' && value !== null)
            );
            carregarProdutos(novaPagina, filtrosLimpos);
        }
    };

    // Função para navegar para detalhes do produto
    const handleCardClick = (id) => {
        navigate(`/admin/product/${id}`);
    };

    if (loading && produtos.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Carregando produtos...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Navbar />

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

                {/* Mensagem de erro */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Feedback da busca */}
                {termoBusca && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Resultados da busca por: <strong>"{termoBusca}"</strong>
                    </Alert>
                )}

                <Typography variant="h4" component="h1" gutterBottom>
                    {termoBusca ? 'Resultados da Busca' : 'Todos os Produtos'}
                </Typography>

                {/* Barra de busca local */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        placeholder="Buscar produtos por nome, marca ou princípio ativo..."
                        value={buscaLocal}
                        onChange={(e) => setBuscaLocal(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={handleBuscar} sx={{ minWidth: 'auto' }}>
                                        <SearchIcon />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Controles de Filtro Avançado */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Departamento */}
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel>Departamento</InputLabel>
                        <Select
                            value={filtros.departamento}
                            label="Departamento"
                            onChange={(e) => atualizarFiltro('departamento', e.target.value)}
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            {departamentos.map(dep => (
                                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Genérico */}
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel>Genérico</InputLabel>
                        <Select
                            value={filtros.generico}
                            label="Genérico"
                            onChange={(e) => atualizarFiltro('generico', e.target.value)}
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="true">Sim</MenuItem>
                            <MenuItem value="false">Não</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Promoção */}
                    <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel>Promoção</InputLabel>
                        <Select
                            value={filtros.promocao}
                            label="Promoção"
                            onChange={(e) => atualizarFiltro('promocao', e.target.value)}
                        >
                            <MenuItem value=""><em>Todos</em></MenuItem>
                            <MenuItem value="true">Em Promoção</MenuItem>
                            <MenuItem value="false">Preço Normal</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Preço Mínimo */}
                    <TextField
                        size="small"
                        label="Preço Mín."
                        type="number"
                        value={filtros.preco_min}
                        onChange={(e) => atualizarFiltro('preco_min', e.target.value)}
                        sx={{ width: 100 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                    />

                    {/* Preço Máximo */}
                    <TextField
                        size="small"
                        label="Preço Máx."
                        type="number"
                        value={filtros.preco_max}
                        onChange={(e) => atualizarFiltro('preco_max', e.target.value)}
                        sx={{ width: 100 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                    />

                    {/* Ordenação */}
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel>Ordenar por</InputLabel>
                        <Select
                            value={`${filtros.order_by}_${filtros.order_dir}`}
                            label="Ordenar por"
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split('_');
                                atualizarFiltro('order_by', field);
                                atualizarFiltro('order_dir', direction);
                            }}
                        >
                            <MenuItem value="nome_asc">Nome A-Z</MenuItem>
                            <MenuItem value="nome_desc">Nome Z-A</MenuItem>
                            <MenuItem value="preco_unitario_asc">Menor Preço</MenuItem>
                            <MenuItem value="preco_unitario_desc">Maior Preço</MenuItem>
                            <MenuItem value="desconto_desc">Maior Desconto</MenuItem>
                            <MenuItem value="created_at_desc">Mais Recentes</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Botão Limpar Filtros */}
                    <Button variant="outlined" onClick={limparFiltros}>
                        Limpar Filtros
                    </Button>
                </Box>

                {/* Informações de Paginação */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {totalProdutos} produto(s) encontrado(s) | Página {paginaAtual} de {totalPaginas}
                    </Typography>
                    
                    {/* Filtros Ativos */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Object.entries(filtros).map(([key, value]) => {
                            if (value && key !== 'order_by' && key !== 'order_dir') {
                                return (
                                    <Chip
                                        key={key}
                                        label={`${key}: ${value}`}
                                        size="small"
                                        onDelete={() => atualizarFiltro(key, '')}
                                        color="primary"
                                        variant="outlined"
                                    />
                                );
                            }
                            return null;
                        })}
                    </Box>
                </Box>

                {/* Grid de Produtos */}
                <Grid container spacing={3}>
                    {produtos.length > 0 ? (
                        produtos.map((produto) => (
                            <Grid item key={produto.id} xs={12} sm={6} md={4} lg={3}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        }
                                    }} 
                                    onClick={() => handleCardClick(produto.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={produto.imagem || produto.imagens?.[0] || "/icons/product_icon.svg"}
                                        alt={produto.nome}
                                        sx={{ objectFit: 'contain', pt: 1 }}
                                        onError={(e) => e.target.src = "/icons/product_icon.svg"}
                                    />
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                            {produto.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {produto.marca}
                                        </Typography>
                                        
                                        {/* Badges */}
                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                                            {produto.generico && (
                                                <Chip label="Genérico" size="small" color="info" />
                                            )}
                                            {produto.em_promocao && (
                                                <Chip label={`-${produto.desconto}%`} size="small" color="error" />
                                            )}
                                        </Box>

                                        {/* Preços */}
                                        <Box sx={{ mt: 'auto' }}>
                                            {produto.em_promocao && produto.economia > 0 ? (
                                                <Box>
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                                    >
                                                        R$ {produto.preco_unitario.toFixed(2).replace('.', ',')}
                                                    </Typography>
                                                    <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                                                        {produto.preco}
                                                    </Typography>
                                                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                                                        Economize R$ {produto.economia.toFixed(2).replace('.', ',')}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                    {produto.preco}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Nenhum produto encontrado
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {termoBusca 
                                        ? `Não encontramos produtos para "${termoBusca}". Tente outros termos ou ajuste os filtros.`
                                        : 'Nenhum produto encontrado com os filtros selecionados.'}
                                </Typography>
                                <Button variant="outlined" onClick={limparFiltros}>
                                    Limpar Filtros
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Paginação */}
                {totalPaginas > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPaginas}
                            page={paginaAtual}
                            onChange={handleMudarPagina}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            disabled={loading}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default TodosProdutos;