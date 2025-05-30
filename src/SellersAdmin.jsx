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
    IconButton,
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
import InputAdornment from "@mui/material/InputAdornment"
import AddSellerModal from "./AddSellerModal";
import EditSellerModal from "./EditSellerModal";

// Dados iniciais mockados
const vendedoresMock = [
    {
        id: "01",
        nome: "Vendedor",
        sobrenome: "Silva",
        cpf: "000.000.000-00",
        filial: "Norte",
        comissao: "15 %",
        perfil: "Vendedor",
        status: "Ativo",
    },
    {
        id: "02",
        nome: "Vendedor",
        sobrenome: "Santos",
        cpf: "000.000.000-01",
        filial: "Norte",
        comissao: "5 %",
        perfil: "Vendedor",
        status: "Ativo",
    },
    {
        id: "03",
        nome: "Vendedor",
        sobrenome: "Oliveira",
        cpf: "000.000.000-02",
        filial: "Sul",
        comissao: "5 %",
        perfil: "Vendedor",
        status: "Ativo",
    },
    {
        id: "04",
        nome: "Gerente",
        sobrenome: "Pereira",
        cpf: "000.000.000-03",
        filial: "Sul",
        comissao: "0 %",
        perfil: "Admin",
        status: "Inativo",
    },
    {
        id: "05",
        nome: "Gerente",
        sobrenome: "Costa",
        cpf: "000.000.000-03",
        filial: "Sul",
        comissao: "0 %",
        perfil: "Admin",
        status: "Ativo",
    },
];

const SellersAdmin = () => {
    // Verificar se há dados no localStorage, caso contrário usar os dados mockados
    const getInitialVendedores = () => {
        const savedVendedores = localStorage.getItem('vendedores');
        return savedVendedores ? JSON.parse(savedVendedores) : vendedoresMock;
    };

    const [vendedores, setVendedores] = useState(getInitialVendedores);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [vendedorParaExcluir, setVendedorParaExcluir] = useState(null);
    const navigate = useNavigate();

    // Salvar no localStorage sempre que vendedores mudar
    useEffect(() => {
        localStorage.setItem('vendedores', JSON.stringify(vendedores));
    }, [vendedores]);

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (vendedor) => {
        setVendedorSelecionado(vendedor);
        setOpenEditModal(true);
    };

    const handleExcluir = (vendedor) => {
        setVendedorParaExcluir(vendedor);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = () => {
        if (vendedorParaExcluir) {
            const novosVendedores = vendedores.filter(
                (v) => v.id !== vendedorParaExcluir.id
            );
            setVendedores(novosVendedores);
            setOpenDeleteModal(false);
            setVendedorParaExcluir(null);
        }
    };

    const adicionarVendedor = (novoVendedor) => {
        // Gerar ID único (em produção, isso seria feito pelo backend)
        const maxId = Math.max(...vendedores.map(v => parseInt(v.id)));
        const novoId = (maxId + 1).toString().padStart(2, '0');
        
        const vendedorComId = {
            ...novoVendedor,
            id: novoId
        };
        
        setVendedores([...vendedores, vendedorComId]);
        setOpenModal(false);
    };

    const atualizarVendedor = (vendedorAtualizado) => {
        const novosVendedores = vendedores.map(v => 
            v.id === vendedorAtualizado.id ? vendedorAtualizado : v
        );
        
        setVendedores(novosVendedores);
        setOpenEditModal(false);
        setVendedorSelecionado(null);
    };

    // Função para obter o nome completo
    const getNomeCompleto = (vendedor) => {
        return `${vendedor.nome} ${vendedor.sobrenome || ''}`.trim();
    };

    const vendedoresFiltrados = vendedores.filter((vendedor) => {
        const nomeCompleto = getNomeCompleto(vendedor).toLowerCase();
        return nomeCompleto.includes(busca.toLowerCase()) ||
            vendedor.cpf.includes(busca) ||
            vendedor.filial.toLowerCase().includes(busca.toLowerCase()) ||
            vendedor.perfil.toLowerCase().includes(busca.toLowerCase()) ||
            vendedor.status.toLowerCase().includes(busca.toLowerCase());
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
                    <Typography variant="body2" sx={{ mr: 3 }}>
                        <p style={{ margin: 0 }}>Olá,</p>
                        <strong>Vendedor</strong>
                    </Typography>
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
                    {/* Botão Adicionar Vendedor */}
                    <Button
                        variant="outlined"
                        sx={{ width: "250px" }}
                        onClick={() => setOpenModal(true)}
                    >
                        Adicionar Vendedor
                    </Button>

                    {/* Barra de busca */}
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

                    {/* Botão voltar */}
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
                                <TableCell>CPF</TableCell>
                                <TableCell>Filial</TableCell>
                                <TableCell>Comissão</TableCell>
                                <TableCell>Perfil</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendedoresFiltrados.map((vendedor) => (
                                <TableRow key={vendedor.id}>
                                    <TableCell>{vendedor.id}</TableCell>
                                    <TableCell>{getNomeCompleto(vendedor)}</TableCell>
                                    <TableCell>{vendedor.cpf}</TableCell>
                                    <TableCell>{vendedor.filial}</TableCell>
                                    <TableCell>{vendedor.comissao}</TableCell>
                                    <TableCell>{vendedor.perfil}</TableCell>
                                    <TableCell>{vendedor.status}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                            onClick={() => handleEditar(vendedor)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#E84C3E" }}
                                            onClick={() => handleExcluir(vendedor)}
                                        >
                                            Excluir
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ backgroundColor: "#414141", width: "5rem" }}
                                        >
                                            Vendas
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal de Adição */}
            <AddSellerModal 
                open={openModal} 
                handleClose={() => setOpenModal(false)} 
                adicionarVendedor={adicionarVendedor}
            />
            
            {/* Modal de Edição */}
            <EditSellerModal
                open={openEditModal}
                handleClose={() => setOpenEditModal(false)}
                vendedor={vendedorSelecionado}
                atualizarVendedor={atualizarVendedor}
            />

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o vendedor {vendedorParaExcluir ? getNomeCompleto(vendedorParaExcluir) : ''}?
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

export default SellersAdmin;
