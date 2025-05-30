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
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModel";

const clientesMock = [
    {
        id: "01",
        nome: "Ana Souza",
        cpfCnpj: "000.000.000-00",
        email: "ana.souza@email.com",
        dataNascimento: "1990-05-12",
    },
    {
        id: "02",
        nome: "Carlos Lima",
        cpfCnpj: "111.111.111-11",
        email: "carlos.lima@email.com",
        dataNascimento: "1985-09-23",
    },
    {
        id: "03",
        nome: "Empresa ABC Ltda",
        cpfCnpj: "12.345.678/0001-99",
        email: "contato@empresaabc.com",
        dataNascimento: "2000-01-01",
    },
    {
        id: "04",
        nome: "Joana Silva",
        cpfCnpj: "222.222.222-22",
        email: "joana.silva@email.com",
        dataNascimento: "1995-12-15",
    },
];

const CustomerAdmin = () => {
    const getInitialClientes = () => {
        const savedClientes = localStorage.getItem("clientes");
        return savedClientes ? JSON.parse(savedClientes) : clientesMock;
    };

    const [clientes, setClientes] = useState(getInitialClientes);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("clientes", JSON.stringify(clientes));
    }, [clientes]);

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (cliente) => {
        setClienteSelecionado(cliente);
        setOpenEditModal(true);
    };

    const handleExcluir = (cliente) => {
        setClienteParaExcluir(cliente);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = () => {
        if (clienteParaExcluir) {
            const novosClientes = clientes.filter((c) => c.id !== clienteParaExcluir.id);
            setClientes(novosClientes);
            setOpenDeleteModal(false);
            setClienteParaExcluir(null);
        }
    };

    const adicionarCliente = (novoCliente) => {
        const numerosIds = clientes
            .map((c) => Number(c.id))
            .filter((n) => !isNaN(n));
        const maxId = numerosIds.length > 0 ? Math.max(...numerosIds) : 0;
        const novoId = String(maxId + 1).padStart(2, "0");

        const clienteComId = { ...novoCliente, id: novoId };
        setClientes([...clientes, clienteComId]);
        setOpenModal(false);
    };

    const atualizarCliente = (clienteAtualizado) => {
        const novosClientes = clientes.map((c) =>
            c.id === clienteAtualizado.id ? clienteAtualizado : c
        );
        setClientes(novosClientes);
        setOpenEditModal(false);
        setClienteSelecionado(null);
    };

    const clientesFiltrados = clientes.filter((cliente) => {
        return (
            cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
            cliente.cpfCnpj.includes(busca) ||
            cliente.email.toLowerCase().includes(busca.toLowerCase()) ||
            cliente.dataNascimento.includes(busca)
        );
    });

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
                        sx={{ borderRadius: 20, borderColor: "#e0e0e0", color: "#666", px: 4, py: 1 }}
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </Box>
            </Box>

            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Button variant="outlined" sx={{ width: "250px" }} onClick={() => setOpenModal(true)}>
                        Adicionar Cliente
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

                    <Button variant="outlined" sx={{ width: "150px" }} onClick={() => navigate("/area-admin")}>
                        Voltar
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF / CNPJ</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Data de Nascimento</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientesFiltrados.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.id}</TableCell>
                                    <TableCell>{cliente.nome}</TableCell>
                                    <TableCell>{cliente.cpfCnpj}</TableCell>
                                    <TableCell>{cliente.email}</TableCell>
                                    <TableCell>{cliente.dataNascimento}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                            onClick={() => handleEditar(cliente)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ width: "5rem", background: "#E84C3E" }}
                                            onClick={() => handleExcluir(cliente)}
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

            <AddCustomerModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                adicionarCliente={adicionarCliente}
            />
            <EditCustomerModal
                open={openEditModal}
                handleClose={() => setOpenEditModal(false)}
                cliente={clienteSelecionado}
                atualizarCliente={atualizarCliente}
            />

            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o cliente{" "}
                        {clienteParaExcluir ? clienteParaExcluir.nome : ""}? Esta ação não pode ser
                        desfeita.
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

export default CustomerAdmin;
