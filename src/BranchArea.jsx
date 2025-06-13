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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import AddBranchModal from "./AddBranchModal";
import EditBranchModal from "./EditBranchModal";
import UserHeader from "./profile/userHeader";
import { useAuth } from "./utils/hook/useAuth";
import { filialService } from "./services/filialService";

const BranchArea = () => {
    const { userRole, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [filiais, setFiliais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [filialSelecionada, setFilialSelecionada] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [filialParaExcluir, setFilialParaExcluir] = useState(null);
    
    // Estados para feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [operationLoading, setOperationLoading] = useState(false);

    // Carregar filiais da API
    const carregarFiliais = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await filialService.listar();
            
            console.log('Response da API filiais:', response); // Debug
            
            // Extrair as filiais da resposta
            let filiaisData = [];
            if (response && response.filiais && Array.isArray(response.filiais)) {
                filiaisData = response.filiais;
            } else if (Array.isArray(response)) {
                filiaisData = response;
            }
            
            // Formatar os dados das filiais para o frontend
            const filiaisFormatadas = filiaisData.map(filial => ({
                id: filial.ID || filial.id,
                nome: filial.nome || '',
                endereco: filial.endereco || '',
                telefone: filial.telefone || '', // Preparado para quando adicionar no backend
                // Manter dados originais para referência
                ...filial
            }));
            
            setFiliais(filiaisFormatadas);
        } catch (error) {
            console.error('Erro ao carregar filiais:', error);
            setError('Erro ao carregar lista de filiais. Tente novamente.');
            setFiliais([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar filiais ao montar o componente
    useEffect(() => {
        carregarFiliais();
    }, []);

    // Função para formatar dados da filial para a API
    const formatarFilialParaAPI = (filialData) => {
        return {
            nome: filialData.nome,
            endereco: filialData.endereco,
            telefone: filialData.telefone || '' 
        };
    };

    const handleEditar = async (filial) => {
        try {
            setOperationLoading(true);
            setError(null);
            
            console.log('Filial selecionada para edição:', filial); 
          
            const filialCompleta = await filialService.buscarPorId(filial.id);
            
            console.log('Filial completa da API:', filialCompleta); 
            
            setFilialSelecionada(filialCompleta);
            setOpenEditModal(true);
        } catch (error) {
            console.error('Erro ao buscar filial:', error);
            setError('Erro ao carregar dados da filial para edição.');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleExcluir = (filial) => {
        setFilialParaExcluir(filial);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = async () => {
        if (!filialParaExcluir) return;

        try {
            setOperationLoading(true);
            await filialService.deletar(filialParaExcluir.id);
            setSuccess('Filial excluída com sucesso!');
            await carregarFiliais(); 
        } catch (error) {
            console.error('Erro ao excluir filial:', error);
            setError('Erro ao excluir filial. Tente novamente.');
        } finally {
            setOperationLoading(false);
            setOpenDeleteModal(false);
            setFilialParaExcluir(null);
        }
    };

    const adicionarFilial = async (novaFilial) => {
        try {
            setOperationLoading(true);
            const filialFormatada = formatarFilialParaAPI(novaFilial);
            await filialService.criar(filialFormatada);
            setSuccess('Filial adicionada com sucesso!');
            setOpenModal(false);
            await carregarFiliais(); 
        } catch (error) {
            console.error('Erro ao adicionar filial:', error);
            setError('Erro ao adicionar filial. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    const atualizarFilial = async (filialAtualizada) => {
        try {
            setOperationLoading(true);
            const filialFormatada = formatarFilialParaAPI(filialAtualizada);
            await filialService.atualizar(filialAtualizada.id, filialFormatada);
            setSuccess('Filial atualizada com sucesso!');
            setOpenEditModal(false);
            setFilialSelecionada(null);
            await carregarFiliais(); 
        } catch (error) {
            console.error('Erro ao atualizar filial:', error);
            setError('Erro ao atualizar filial. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    // Filtrar filiais
    const filiaisFiltradas = filiais.filter((filial) => {
        const termoBusca = busca.toLowerCase();
        return (
            (filial.nome && filial.nome.toLowerCase().includes(termoBusca)) ||
            (filial.endereco && filial.endereco.toLowerCase().includes(termoBusca))
        );
    });

    // Fechar mensagens de feedback
    const handleCloseError = () => setError(null);
    const handleCloseSuccess = () => setSuccess(null);

    // Loading inicial
    if (loading) {
        return (
            <Box sx={{ 
                minHeight: "100vh", 
                backgroundColor: "#f5f5f5",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <UserHeader />

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
                        disabled={operationLoading}
                    >
                        Adicionar Filial
                    </Button>

                    <TextField
                        size="small"
                        placeholder="Buscar por nome ou endereço..."
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

                {/* Role-specific message */}
                {isAdmin() && (
                    <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                        🔧 Modo Administrador - Acesso completo
                    </Typography>
                )}

                {/* Indicador de loading para operações */}
                {operationLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2">Processando...</Typography>
                    </Box>
                )}

                {/* Debug: Mostrar quantidade de filiais carregadas */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {filiais.length} filial(is) carregada(s)
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Endereço</TableCell>
                                <TableCell>Telefone</TableCell> {/* ✅ Agora visível */}
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filiaisFiltradas.length > 0 ? (
                                filiaisFiltradas.map((filial) => (
                                    <TableRow key={filial.id}>
                                        <TableCell>{filial.id}</TableCell>
                                        <TableCell>{filial.nome}</TableCell>
                                        <TableCell>{filial.endereco}</TableCell>
                                        <TableCell>{filial.telefone || '-'}</TableCell> {/* ✅ Mostra telefone */}
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                                onClick={() => handleEditar(filial)}
                                                disabled={operationLoading}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ width: "5rem", background: "#E84C3E" }}
                                                onClick={() => handleExcluir(filial)}
                                                disabled={operationLoading}
                                            >
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {busca ? 'Nenhuma filial encontrada com os filtros aplicados.' : 'Nenhuma filial cadastrada.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal Adicionar Filial */}
            <AddBranchModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                adicionarFilial={adicionarFilial}
                loading={operationLoading}
            />

            {/* Modal Editar Filial */}
            <EditBranchModal
                open={openEditModal}
                handleClose={() => {
                    setOpenEditModal(false);
                    setFilialSelecionada(null);
                }}
                filial={filialSelecionada}
                atualizarFilial={atualizarFilial}
                loading={operationLoading}
            />

            {/* Dialog Confirmar Exclusão */}
            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir a filial{" "}
                        <strong>{filialParaExcluir?.nome}</strong>? 
                        Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)} disabled={operationLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={confirmarExclusao} 
                        color="error" 
                        autoFocus
                        disabled={operationLoading}
                    >
                        {operationLoading ? <CircularProgress size={20} /> : 'Excluir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbars para feedback */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={4000} 
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BranchArea;