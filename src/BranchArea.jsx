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
import AddBranchModal from "./AddBranchModal";
import EditBranchModal from "./EditBranchModal";

// Dados iniciais mockados
const filiaisMock = [
    {
        id: "01",
        nome: "Filial Centro",
        endereco: "Rua Principal, 123",
        cidade: "São Paulo",
        telefone: "(11) 3333-4444",
        gerente: "Carlos Silva",
        status: "Ativo",
    },
    {
        id: "02",
        nome: "Filial Norte",
        endereco: "Av. Norte, 456",
        cidade: "Rio de Janeiro",
        telefone: "(21) 5555-6666",
        gerente: "Ana Oliveira",
        status: "Ativo",
    },
    {
        id: "03",
        nome: "Filial Sul",
        endereco: "Rua Sul, 789",
        cidade: "Curitiba",
        telefone: "(41) 7777-8888",
        gerente: "Pedro Santos",
        status: "Inativo",
    },
    {
        id: "04",
        nome: "Filial Leste",
        endereco: "Av. Leste, 1011",
        cidade: "Belo Horizonte",
        telefone: "(31) 9999-0000",
        gerente: "Mariana Costa",
        status: "Ativo",
    },
];

const BranchArea = () => {
    // Verificar se há dados no localStorage, caso contrário usar os dados mockados
    const getInitialFiliais = () => {
        const savedFiliais = localStorage.getItem('filiais');
        return savedFiliais ? JSON.parse(savedFiliais) : filiaisMock;
    };

    const [filiais, setFiliais] = useState(getInitialFiliais);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [filialSelecionada, setFilialSelecionada] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [filialParaExcluir, setFilialParaExcluir] = useState(null);
    const navigate = useNavigate();

    // Salvar no localStorage sempre que filiais mudar
    useEffect(() => {
        localStorage.setItem('filiais', JSON.stringify(filiais));
    }, [filiais]);

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = (filial) => {
        setFilialSelecionada(filial);
        setOpenEditModal(true);
    };

    const handleExcluir = (filial) => {
        setFilialParaExcluir(filial);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = () => {
        if (filialParaExcluir) {
            const novasFiliais = filiais.filter(
                (f) => f.id !== filialParaExcluir.id
            );
            setFiliais(novasFiliais);
            setOpenDeleteModal(false);
            setFilialParaExcluir(null);
        }
    };

    const adicionarFilial = (novaFilial) => {
        // Gerar ID único (em produção, isso seria feito pelo backend)
        const maxId = Math.max(...filiais.map(f => parseInt(f.id)));
        const novoId = (maxId + 1).toString().padStart(2, '0');

        const filialComId = {
            ...novaFilial,
            id: novoId
        };

        setFiliais([...filiais, filialComId]);
        setOpenModal(false);
    };

    const atualizarFilial = (filialAtualizada) => {
        const novasFiliais = filiais.map(f =>
            f.id === filialAtualizada.id ? filialAtualizada : f
        );

        setFiliais(novasFiliais);
        setOpenEditModal(false);
        setFilialSelecionada(null);
    };

    const filiaisFiltradas = filiais.filter((filial) => {
        return filial.nome.toLowerCase().includes(busca.toLowerCase()) ||
            filial.endereco.toLowerCase().includes(busca.toLowerCase()) ||
            filial.cidade.toLowerCase().includes(busca.toLowerCase()) ||
            filial.telefone.includes(busca) ||
            filial.gerente.toLowerCase().includes(busca.toLowerCase()) ||
            filial.status.toLowerCase().includes(busca.toLowerCase());
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
                    {/* Botão Adicionar Filial */}
                    <Button
                        variant="outlined"
                        sx={{ width: "250px" }}
                        onClick={() => setOpenModal(true)}
                    >
                        Adicionar Filial
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
                                <TableCell>Endereço</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filiaisFiltradas.map((filial) => (
                                <TableRow key={filial.id}>
                                    <TableCell>{filial.id}</TableCell>
                                    <TableCell>{filial.nome}</TableCell>
                                    <TableCell>{filial.endereco}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                            onClick={() => handleEditar(filial)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{ mr: 1, width: "5rem", background: "#E84C3E" }}
                                            onClick={() => handleExcluir(filial)}
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

            {/* Modal de Adição */}
            <AddBranchModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                adicionarFilial={adicionarFilial}
            />

            {/* Modal de Edição */}
            <EditBranchModal
                open={openEditModal}
                handleClose={() => setOpenEditModal(false)}
                filial={filialSelecionada}
                atualizarFilial={atualizarFilial}
            />

            {/* Modal de Confirmação de Exclusão */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir a filial {filialParaExcluir?.nome}?
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

export default BranchArea;
