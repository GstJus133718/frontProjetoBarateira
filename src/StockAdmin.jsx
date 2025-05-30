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
    // Checkbox, // Removido pois a coluna Promoção foi removida
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import AddProductModal from "./AddProductModal"; 
import EditProductModal from "./EditProductModal";

// Dados iniciais mockados (usados apenas se o localStorage estiver vazio)
const produtosMock = [
    {
        id: "01",
        nome: "Remédio 01",
        principioAtivo: "Princípio 01",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 1,
        filial: "Norte",
        // promocao: true, // Campo removido da visualização
        // desconto: 15, // Campo removido da visualização
        preco: "R$10,00",
    },
    {
        id: "02",
        nome: "Remédio 02",
        principioAtivo: "Princípio 02",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 2,
        filial: "Norte",
        // promocao: true,
        // desconto: 10,
        preco: "R$10,00",
    },
    {
        id: "03",
        nome: "Remédio 03",
        principioAtivo: "Princípio 03",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 10,
        filial: "Norte",
        // promocao: true,
        // desconto: 50,
        preco: "R$10,00",
    },
    {
        id: "04",
        nome: "Remédio 04",
        principioAtivo: "Princípio 04",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 100,
        filial: "Norte",
        // promocao: false,
        // desconto: 0,
        preco: "R$10,00",
    },
];

const StockAdmin = () => {
    // Função para inicializar produtos
    const getInitialProdutos = () => {
        const savedProdutos = localStorage.getItem("produtos");
        // Se houver produtos salvos, usa eles, senão usa o mock.
        // A estrutura dos produtos salvos pode não ter mais 'promocao' ou 'desconto'
        // dependendo de onde são atualizados.
        return savedProdutos ? JSON.parse(savedProdutos) : produtosMock;
    };
    
    // Removido estado e lógica de promoções pois as colunas foram removidas
    // const getInitialPromocoes = () => { ... };
    // const [promocoes, setPromocoes] = useState(getInitialPromocoes);

    const [produtos, setProdutos] = useState(getInitialProdutos);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
    const navigate = useNavigate();

    // Salvar produtos no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }, [produtos]);

    // Removido useEffect para salvar promoções
    // useEffect(() => { localStorage.setItem("promocoes", JSON.stringify(promocoes)); }, [promocoes]);

    // Removido listener de storage para promoções
    /*
    useEffect(() => {
        const handleStorageChange = () => {
            // Apenas recarrega produtos se necessário
            const currentProdutos = localStorage.getItem("produtos");
            if (currentProdutos) {
                 setProdutos(JSON.parse(currentProdutos));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    */
   // Simplificado: Carrega produtos na montagem inicial
    useEffect(() => {
        setProdutos(getInitialProdutos());
    }, []);

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (produto) => {
        setProdutoSelecionado(produto);
        setOpenEditModal(true);
    };

    const handleExcluir = (produto) => {
        setProdutoParaExcluir(produto);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = () => {
        if (produtoParaExcluir) {
            // Remove o produto
            const novosProdutos = produtos.filter(
                (p) => p.id !== produtoParaExcluir.id
            );
            setProdutos(novosProdutos);
            
            // Remove a promoção associada, se existir (ainda necessário para consistência dos dados)
            const savedPromocoes = localStorage.getItem("promocoes");
            let promocoes = savedPromocoes ? JSON.parse(savedPromocoes) : [];
            const novasPromocoes = promocoes.filter(
                (promo) => promo.id !== produtoParaExcluir.id
            );
            localStorage.setItem("promocoes", JSON.stringify(novasPromocoes));

            setOpenDeleteModal(false);
            setProdutoParaExcluir(null);
        }
    };

    const adicionarProduto = (novoProduto) => {
        const novoId = (Math.max(0, ...produtos.map(p => parseInt(p.id))) + 1).toString().padStart(2, '0');
        const produtoComId = {
            ...novoProduto,
            id: novoId,
            // Não adiciona mais campos de promoção/desconto aqui
        };
        setProdutos([...produtos, produtoComId]);
        setOpenModal(false);
    };

    const atualizarProduto = (produtoAtualizado) => {
        const novosProdutos = produtos.map(p => 
            p.id === produtoAtualizado.id ? produtoAtualizado : p
        );
        setProdutos(novosProdutos);
        setOpenEditModal(false);
        setProdutoSelecionado(null);
    };

    // Removida função handlePromocaoChange
    // const handlePromocaoChange = (id, checked) => { ... };

    const produtosFiltrados = produtos.filter((produto) => {
        const termoBusca = busca.toLowerCase();
        // Ajustar a busca para não incluir campos removidos se necessário
        return (produto.nome && produto.nome.toLowerCase().includes(termoBusca)) ||
            (produto.principioAtivo && produto.principioAtivo.toLowerCase().includes(termoBusca)) ||
            (produto.marca && produto.marca.toLowerCase().includes(termoBusca)) ||
            (produto.categoria && produto.categoria.toLowerCase().includes(termoBusca)) ||
            (produto.filial && produto.filial.toLowerCase().includes(termoBusca)) ||
            (produto.preco && produto.preco.toLowerCase().includes(termoBusca));
    });

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Navbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    boxShadow: 1,
                }}
            >
                <Avatar
                    src="../public/logo/logo_3.png"
                    alt="A Barateira"
                    variant="square"
                    sx={{ width: 200, height: 115 }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "#666", mr: 1 }} />
                    <Box sx={{ color: "text.secondary", mr: 3 }}>
                        <Typography variant="body2" sx={{ m: 0 }}>Olá,</Typography>
                        <Typography variant="body2" sx={{ m: 0, fontWeight: 'bold' }}>Vendedor</Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 20,
                            borderColor: "#e0e0e0",
                            color: "#666",
                            px: 4,
                            py: 1,
                        }}
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </Box>
            </Box>

            {/* Conteúdo */}
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{ width: "250px" }}
                        onClick={() => setOpenModal(true)}
                    >
                        Adicionar Produto
                    </Button>
                    <TextField
                        size="small"
                        placeholder="Buscar..."
                        variant="outlined"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        sx={{
                            width: "600px",
                            backgroundColor: "#EBEBEB",
                            borderRadius: "5px",
                            "& fieldset": { border: "none" },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="outlined"
                        sx={{ width: "150px" }}
                        onClick={() => navigate("/area-admin")}
                    >
                        Voltar
                    </Button>
                </Box>

                {/* Tabela */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Princípio Ativo</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Filial</TableCell>
                                {/* <TableCell>Promoção</TableCell> */} {/* Coluna Removida */}
                                {/* <TableCell>Desconto (%)</TableCell> */} {/* Coluna Removida */}
                                <TableCell>Preço</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtosFiltrados.map((produto) => {
                                // Removida lógica para buscar promoção ativa e desconto
                                // const promocaoDoProduto = promocoes.find(promo => promo.id === produto.id);
                                // const isPromocaoAtiva = promocaoDoProduto && promocaoDoProduto.status === "Ativo";
                                // const descontoDaPromocao = isPromocaoAtiva ? promocaoDoProduto.desconto : "0 %";
                                
                                return (
                                    <TableRow key={produto.id}>
                                        <TableCell>{produto.id}</TableCell>
                                        <TableCell>{produto.nome}</TableCell>
                                        <TableCell>{produto.principioAtivo}</TableCell>
                                        <TableCell>{produto.marca}</TableCell>
                                        <TableCell>{produto.categoria}</TableCell>
                                        <TableCell>{produto.quantidade}</TableCell>
                                        <TableCell>{produto.filial}</TableCell>
                                        {/* Coluna Promoção Removida 
                                        <TableCell>
                                            <Checkbox 
                                                checked={isPromocaoAtiva} 
                                                disabled={!promocaoDoProduto} 
                                                onChange={(e) => handlePromocaoChange(produto.id, e.target.checked)}
                                            />
                                        </TableCell>
                                        */}
                                        {/* Coluna Desconto Removida 
                                        <TableCell>{descontoDaPromocao}</TableCell> 
                                        */}
                                        <TableCell>{produto.preco}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                                onClick={() => handleEditar(produto)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ mr: 1, width: "5rem", background: "#E84C3E" }}
                                                onClick={() => handleExcluir(produto)}
                                            >
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal de Adição */}
            {openModal && (
                <AddProductModal 
                    open={openModal} 
                    handleClose={() => setOpenModal(false)} 
                    adicionarProduto={adicionarProduto}
                />
            )}
            
            {/* Modal de Edição */}
            {openEditModal && (
                <EditProductModal
                    open={openEditModal}
                    handleClose={() => setOpenEditModal(false)}
                    produto={produtoSelecionado}
                    atualizarProduto={atualizarProduto}
                />
            )}

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o produto {produtoParaExcluir?.nome}?
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
                    <Button onClick={confirmarExclusao} color="error" autoFocus>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StockAdmin;

