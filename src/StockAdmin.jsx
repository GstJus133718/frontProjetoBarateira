import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Alert,
    Snackbar,
    Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import AddProductModal from "./AddProductModal"; 
import EditProductModal from "./EditProductModal";
import EstoqueModal from "./EstoqueModal";
import { produtoService } from './services/produtoService';

const StockAdmin = () => {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    
    // Novo estado para modal de estoque
    const [openEstoqueModal, setOpenEstoqueModal] = useState(false);
    const [produtoEstoqueSelecionado, setProdutoEstoqueSelecionado] = useState(null);
    
    // Estados para feedback e loading
    const [loading, setLoading] = useState(true);
    const [operationLoading, setOperationLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const navigate = useNavigate();

    // Carregar produtos da API
    const carregarProdutos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await produtoService.listar();
            
            console.log('Response da API produtos:', response);
            
            // Extrair os produtos da resposta
            let produtosData = [];
            if (response && response.produtos && Array.isArray(response.produtos)) {
                produtosData = response.produtos;
            } else if (Array.isArray(response)) {
                produtosData = response;
            }
            
            // Formatar os dados dos produtos para o frontend
            const produtosFormatados = produtosData.map(produto => ({
                id: produto.ID || produto.id,
                nome: produto.nome || '',
                principioAtivo: produto.principio_ativo || produto.principioAtivo || '',
                marca: produto.marca || '',
                categoria: produto.departamento || produto.categoria || '',
                departamento: produto.departamento || produto.categoria || '',
                // ✅ NOVO: Usar valor_real como preço de exibição
                preco: produto.valor_real ? `R$ ${produto.valor_real.toFixed(2).replace('.', ',')}` : 'R$ 0,00',
                preco_unitario: produto.preco_unitario || 0,
                valor_real: produto.valor_real || produto.preco_unitario || 0,
                economia: produto.economia || 0,
                em_promocao: produto.em_promocao || false,
                desconto: produto.desconto || 0,
                generico: produto.generico || false,
                // Estoque será carregado separadamente se necessário
                estoque_total: produto.estoque_total || 0,
                // Manter dados originais para referência
                ...produto
            }));
            
            setProdutos(produtosFormatados);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            setError('Erro ao carregar lista de produtos. Tente novamente.');
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar produtos ao montar o componente
    useEffect(() => {
        carregarProdutos();
    }, []);

    // Auto-fechar mensagens de sucesso e erro
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (produto) => {
        console.log('Produto selecionado para edição:', produto);
        setProdutoSelecionado(produto);
        setOpenEditModal(true);
    };

    const handleExcluir = (produto) => {
        setProdutoParaExcluir(produto);
        setOpenDeleteModal(true);
    };

    // Nova função para gerenciar estoque
    const handleGerenciarEstoque = (produto) => {
        console.log('Produto selecionado para gestão de estoque:', produto);
        setProdutoEstoqueSelecionado(produto);
        setOpenEstoqueModal(true);
    };

    const confirmarExclusao = async () => {
        if (produtoParaExcluir) {
            try {
                setOperationLoading(true);
                await produtoService.deletar(produtoParaExcluir.id);
                setSuccess('Produto excluído com sucesso!');
                await carregarProdutos(); // Recarregar lista
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                setError('Erro ao excluir produto. Tente novamente.');
            } finally {
                setOperationLoading(false);
                setOpenDeleteModal(false);
                setProdutoParaExcluir(null);
            }
        }
    };

    const adicionarProduto = async (novoProduto) => {
        try {
            setOperationLoading(true);
            setSuccess('Produto adicionado com sucesso!');
            setOpenModal(false);
            await carregarProdutos(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            setError('Erro ao adicionar produto. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    const atualizarProduto = async (produtoAtualizado) => {
        try {
            setOperationLoading(true);
            setSuccess('Produto atualizado com sucesso!');
            setOpenEditModal(false);
            setProdutoSelecionado(null);
            await carregarProdutos(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            setError('Erro ao atualizar produto. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    // Filtrar produtos
    const produtosFiltrados = produtos.filter((produto) => {
        const termoBusca = busca.toLowerCase();
        return (
            (produto.nome && produto.nome.toLowerCase().includes(termoBusca)) ||
            (produto.principioAtivo && produto.principioAtivo.toLowerCase().includes(termoBusca)) ||
            (produto.marca && produto.marca.toLowerCase().includes(termoBusca)) ||
            (produto.categoria && produto.categoria.toLowerCase().includes(termoBusca))
        );
    });

    // Função para renderizar status do estoque
    const renderizarStatusEstoque = (produto) => {
        const estoqueTotal = produto.estoque_total || 0;
        
        if (estoqueTotal === 0) {
            return <Chip label="Sem Estoque" color="error" size="small" />;
        } else if (estoqueTotal < 10) {
            return <Chip label={`${estoqueTotal} unidades`} color="warning" size="small" />;
        } else {
            return <Chip label={`${estoqueTotal} unidades`} color="success" size="small" />;
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    gap: 2
                }}>
                    <CircularProgress size={60} />
                    <Typography variant="body1" color="text.secondary">
                        Carregando produtos...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Header */}
            <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "16px 24px", 
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff", 
                boxShadow: 1,
            }}>
                <Avatar
                    src="/logo/logo_3.png"
                    alt="A Barateira"
                    variant="square"
                    sx={{ width: 200, height: 115, objectFit: "contain" }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography sx={{ color: "#666", mr: 2 }}>Área Administrativa</Typography>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{ textTransform: "none" }}
                    >
                        Sair
                    </Button>
                </Box>
            </Box>

            <Box sx={{ padding: "24px" }}>
                <Typography variant="h4" gutterBottom>
                    Gestão de Produtos e Estoque
                </Typography>

                {/* Mensagens de Sucesso e Erro */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Controles */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <TextField
                        placeholder="Buscar produto..."
                        variant="outlined"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        sx={{ width: "300px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => setOpenModal(true)}
                            disabled={operationLoading}
                            sx={{ backgroundColor: "#0C58A3", "&:hover": { backgroundColor: "#094a8a" } }}
                        >
                            Adicionar Produto
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/admin")}
                        >
                            Voltar
                        </Button>
                    </Box>
                </Box>

                {/* Debug: Mostrar quantidade de produtos carregados */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {produtos.length} produto(s) carregado(s)
                </Typography>

                {/* Tabela */}
                <TableContainer component={Paper}>
                    <Table>
                        
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Princípio Ativo</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Departamento</TableCell>
                                <TableCell>Preço Original</TableCell>
                                <TableCell>Preço Final</TableCell>
                                <TableCell>Economia</TableCell>
                                <TableCell>Genérico</TableCell>
                                <TableCell>Em Promoção</TableCell>
                                <TableCell>Estoque</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtosFiltrados.length > 0 ? (
                                produtosFiltrados.map((produto) => (
                                    <TableRow key={produto.id}>
                                        <TableCell>{produto.id}</TableCell>
                                        <TableCell>{produto.nome}</TableCell>
                                        <TableCell>{produto.principioAtivo}</TableCell>
                                        <TableCell>{produto.marca}</TableCell>
                                        <TableCell>{produto.categoria}</TableCell>
                                        <TableCell>
                                            {`R$ ${produto.preco_unitario.toFixed(2).replace('.', ',')}`}
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                variant="body2" 
                                                fontWeight={produto.em_promocao ? "bold" : "normal"}
                                                color={produto.em_promocao ? "primary" : "text.primary"}
                                            >
                                                {`R$ ${produto.valor_real.toFixed(2).replace('.', ',')}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {produto.economia > 0 ? (
                                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                                    R$ {produto.economia.toFixed(2).replace('.', ',')}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{produto.generico ? 'Sim' : 'Não'}</TableCell>
                                        <TableCell>
                                            {produto.em_promocao ? (
                                                <Chip 
                                                    label={`${produto.desconto}% OFF`} 
                                                    color="success" 
                                                    size="small" 
                                                />
                                            ) : (
                                                'Não'
                                            )}
                                        </TableCell>
                                        <TableCell>{renderizarStatusEstoque(produto)}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ minWidth: "auto", px: 1, background: "#0C58A3" }}
                                                    onClick={() => handleEditar(produto)}
                                                    disabled={operationLoading}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ minWidth: "auto", px: 1, background: "#E84C3E" }}
                                                    onClick={() => handleExcluir(produto)}
                                                    disabled={operationLoading}
                                                >
                                                    Excluir
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<InventoryIcon />}
                                                    sx={{ 
                                                        minWidth: "auto", 
                                                        px: 1, 
                                                        background: "#4CAF50",
                                                        '&:hover': { background: "#45a049" }
                                                    }}
                                                    onClick={() => handleGerenciarEstoque(produto)}
                                                    disabled={operationLoading}
                                                >
                                                    Estoque
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {busca ? 'Nenhum produto encontrado com os filtros aplicados.' : 'Nenhum produto cadastrado.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal de Adição */}
            <AddProductModal 
                open={openModal} 
                handleClose={() => setOpenModal(false)} 
                adicionarProduto={adicionarProduto}
            />
            
            {/* Modal de Edição */}
            <EditProductModal
                open={openEditModal}
                handleClose={() => {
                    setOpenEditModal(false);
                    setProdutoSelecionado(null);
                }}
                produto={produtoSelecionado}
                atualizarProduto={atualizarProduto}
            />

            {/* Modal de Gestão de Estoque */}
            <EstoqueModal
                open={openEstoqueModal}
                handleClose={() => {
                    setOpenEstoqueModal(false);
                    setProdutoEstoqueSelecionado(null);
                    // Recarregar produtos para atualizar estoque
                    carregarProdutos();
                }}
                produto={produtoEstoqueSelecionado}
            />

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={openDeleteModal}
                onClose={() => !operationLoading && setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o produto {produtoParaExcluir?.nome}?
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDeleteModal(false)}
                        disabled={operationLoading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={confirmarExclusao} 
                        color="error" 
                        autoFocus
                        disabled={operationLoading}
                        startIcon={operationLoading ? <CircularProgress size={16} /> : null}
                    >
                        {operationLoading ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbars para feedback */}
            <Snackbar 
                open={!!success} 
                autoHideDuration={5000} 
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!error} 
                autoHideDuration={8000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StockAdmin;