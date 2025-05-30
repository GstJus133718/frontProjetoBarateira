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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import AddPromotionArea from "./AddPromotionArea";
import EditPromotionArea from "./EditPromotionArea";

// Dados mockados de produtos do estoque (usados apenas se o localStorage estiver vazio)
const produtosMock = [
    {
        id: "01",
        nome: "Produto 01",
        principioAtivo: "Princípio 01",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 1,
        filial: "Norte",
        promocao: true,
        desconto: 15,
        preco: "R$10,00",
        status: "Ativo"
    },
    {
        id: "02",
        nome: "Produto 02",
        principioAtivo: "Princípio 02",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 2,
        filial: "Norte",
        promocao: true,
        desconto: 15,
        preco: "R$10,00",
        status: "Ativo"
    },
    {
        id: "03",
        nome: "Produto 03",
        principioAtivo: "Princípio 03",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 10,
        filial: "Norte",
        promocao: true,
        desconto: 15,
        preco: "R$10,00",
        status: "Ativo"
    },
    {
        id: "04",
        nome: "Produto 04",
        principioAtivo: "Princípio 04",
        marca: "Marca",
        categoria: "Medicamento",
        quantidade: 100,
        filial: "Norte",
        promocao: false,
        desconto: 0,
        preco: "R$10,00",
        status: "Ativo"
    },
];

// Função para converter string de preço para número
const precoParaNumero = (precoStr) => {
    if (!precoStr) return 0;
    // --- CORREÇÃO DE SINTAXE: Adicionada aspa simples faltante ---
    return parseFloat(precoStr.replace(/[^\d,]/g, '').replace(",", "."));
    // --- FIM DA CORREÇÃO ---
};

// Função para formatar número como preço
const formatarPreco = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
};

// Função para calcular valor com desconto
const calcularValorComDesconto = (preco, desconto) => {
    const precoNumerico = precoParaNumero(preco);
    const descontoNumerico = parseFloat(desconto) || 0;
    const valorDesconto = precoNumerico * (descontoNumerico / 100);
    return formatarPreco(precoNumerico - valorDesconto);
};

const PromotionArea = () => {
    // Função para inicializar produtos
    const getInitialProdutos = () => {
        const savedProdutos = localStorage.getItem("produtos");
        return savedProdutos ? JSON.parse(savedProdutos) : produtosMock;
    };

    // Função para inicializar promoções
    const getInitialPromocoes = () => {
        const savedPromocoes = localStorage.getItem("promocoes");
        return savedPromocoes ? JSON.parse(savedPromocoes) : [];
    };

    const [produtos, setProdutos] = useState(getInitialProdutos);
    const [promocoes, setPromocoes] = useState(getInitialPromocoes);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [promocaoSelecionada, setPromocaoSelecionada] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [promocaoParaExcluir, setPromocaoParaExcluir] = useState(null);
    const navigate = useNavigate();

    // Salvar produtos no localStorage (se necessário)
    useEffect(() => {
        // Apenas salva se produtos não for o array mock inicial para evitar sobrescrever
        // if (produtos !== produtosMock) { 
        //    localStorage.setItem("produtos", JSON.stringify(produtos));
        // }
        // Simplificado: sempre salva produtos. A lógica de inicialização já cuida de não sobrescrever.
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }, [produtos]);

    // Salvar promoções no localStorage
    useEffect(() => {
        localStorage.setItem("promocoes", JSON.stringify(promocoes));
    }, [promocoes]);

    // Adicionar listener para storage changes para sincronização reativa
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'promocoes') {
                console.log("Storage 'promocoes' changed in PromotionArea, reloading...");
                setPromocoes(getInitialPromocoes());
            }
            if (event.key === 'produtos') {
                console.log("Storage 'produtos' changed in PromotionArea, reloading...");
                setProdutos(getInitialProdutos());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Carrega os dados mais recentes ao montar o componente
        setPromocoes(getInitialPromocoes());
        setProdutos(getInitialProdutos());

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Executa apenas na montagem e desmontagem

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (promocao) => {
        setPromocaoSelecionada(promocao);
        setOpenEditModal(true);
    };

    const handleExcluir = (promocao) => {
        setPromocaoParaExcluir(promocao);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = () => {
        if (promocaoParaExcluir) {
            const novasPromocoes = promocoes.filter(
                (p) => p.id !== promocaoParaExcluir.id
            );
            setPromocoes(novasPromocoes);
            setOpenDeleteModal(false);
            setPromocaoParaExcluir(null);
        }
    };

    const adicionarPromocao = (novaPromocao) => {
        const produtoEstoque = produtos.find(p => p.nome === novaPromocao.produto);
        if (produtoEstoque) {
            const valorComDesconto = calcularValorComDesconto(
                produtoEstoque.preco,
                parseInt(novaPromocao.desconto)
            );
            const promocaoCompleta = {
                id: produtoEstoque.id,
                produto: novaPromocao.produto,
                valor: produtoEstoque.preco,
                desconto: `${novaPromocao.desconto} %`,
                valorComDesconto: valorComDesconto,
                status: novaPromocao.status || "Ativo"
            };
            const promocaoExistente = promocoes.find(p => p.id === promocaoCompleta.id);
            if (promocaoExistente) {
                atualizarPromocao(promocaoCompleta);
            } else {
                setPromocoes([...promocoes, promocaoCompleta]);
            }
            setOpenModal(false);
        }
    };

    const atualizarPromocao = (promocaoAtualizada) => {
        const produtoEstoque = produtos.find(p => p.nome === promocaoAtualizada.produto);
        if (produtoEstoque) {
            const descontoNumerico = parseInt(promocaoAtualizada.desconto.replace(/[^\d]/g, '')) || 0;
            const valorComDesconto = calcularValorComDesconto(
                produtoEstoque.preco,
                descontoNumerico
            );
            const promocaoCompleta = {
                ...promocaoAtualizada,
                id: produtoEstoque.id,
                valor: produtoEstoque.preco,
                desconto: `${descontoNumerico} %`,
                valorComDesconto: valorComDesconto
            };
            const novasPromocoes = promocoes.map(p =>
                p.id === promocaoCompleta.id ? promocaoCompleta : p
            );
            setPromocoes(novasPromocoes);
            setOpenEditModal(false);
            setPromocaoSelecionada(null);
        }
    };

    const promocoesFiltradas = promocoes.filter((promocao) => {
        const termoBusca = busca.toLowerCase();
        return (promocao.produto && promocao.produto.toLowerCase().includes(termoBusca)) ||
               (promocao.valor && promocao.valor.toLowerCase().includes(termoBusca)) ||
               (promocao.desconto && promocao.desconto.toLowerCase().includes(termoBusca)) ||
               (promocao.valorComDesconto && promocao.valorComDesconto.toLowerCase().includes(termoBusca)) ||
               (promocao.status && promocao.status.toLowerCase().includes(termoBusca));
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
                        Adicionar promoção
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

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produto</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>% de Desconto</TableCell>
                                <TableCell>Valor C/ Desconto</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {promocoesFiltradas.map((promocao) => (
                                <TableRow key={promocao.id}>
                                    <TableCell>{promocao.produto}</TableCell>
                                    <TableCell>{promocao.valor}</TableCell>
                                    <TableCell>{promocao.desconto}</TableCell>
                                    <TableCell>{promocao.valorComDesconto}</TableCell>
                                    <TableCell>{promocao.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                            onClick={() => handleEditar(promocao)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#E84C3E" }}
                                            onClick={() => handleExcluir(promocao)}
                                        >
                                            Excluir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modais */}
            {openModal && (
                <AddPromotionArea
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    adicionarPromocao={adicionarPromocao}
                    produtos={produtos}
                    promocoesExistentes={promocoes.map(p => p.produto)}
                />
            )}
            {openEditModal && (
                <EditPromotionArea
                    open={openEditModal}
                    handleClose={() => setOpenEditModal(false)}
                    promocao={promocaoSelecionada}
                    atualizarPromocao={atualizarPromocao}
                    produtos={produtos}
                />
            )}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir a promoção do produto {promocaoParaExcluir?.produto}?
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

export default PromotionArea;

