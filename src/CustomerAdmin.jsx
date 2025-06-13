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
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModel";
import UserHeader from "./profile/userHeader";
import { useAuth } from "./utils/hook/useAuth";
import { clienteService } from "./services/clienteService";

const CustomerAdmin = () => {
    const { userRole, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Estados - Garantir que clientes seja sempre um array
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
    
    // Estados para feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [operationLoading, setOperationLoading] = useState(false);

    // Carregar clientes da API
    const carregarClientes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await clienteService.listar();
            
            console.log('Response da API carregarClientes:', response); // Debug
            
            // Extrair os clientes da resposta
            let clientesData = [];
            if (response && response.clientes && Array.isArray(response.clientes)) {
                clientesData = response.clientes;
            } else if (Array.isArray(response)) {
                clientesData = response;
            }
            
            // Formatar os dados dos clientes para o frontend
            const clientesFormatados = clientesData.map(cliente => formatarClienteDaAPI(cliente));
            
            setClientes(clientesFormatados);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setError('Erro ao carregar lista de clientes. Tente novamente.');
            setClientes([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar clientes ao montar o componente
    useEffect(() => {
        carregarClientes();
    }, []);

    // Função para formatar dados do cliente para a API
    const formatarClienteParaAPI = (clienteData) => {
        return {
            email: clienteData.email,
            senha: clienteData.senha || "123456",
            cpf: clienteData.cpfCnpj?.replace(/\D/g, ''),
            data_nasc: clienteData.dataNascimento ? 
                new Date(clienteData.dataNascimento).toISOString() : 
                new Date().toISOString(),
            nome: clienteData.nome,
            sobrenome: clienteData.sobrenome || ""
        };
    };

    // Função para formatar dados da API para o frontend
    const formatarClienteDaAPI = (clienteAPI) => {
        // A estrutura da API tem Usuario dentro do cliente
        const usuario = clienteAPI.Usuario || {};
        
        return {
            id: clienteAPI.ID || clienteAPI.id,
            nome: clienteAPI.nome || '',
            sobrenome: clienteAPI.sobrenome || '',
            cpf: usuario.cpf || '',
            email: usuario.email || '',
            data_nasc: usuario.data_nasc || '',
            // Campos para compatibilidade com o modal de edição
            cpfCnpj: usuario.cpf || '',
            dataNascimento: usuario.data_nasc ? 
                new Date(usuario.data_nasc).toISOString().split('T')[0] : '',
            // Manter dados originais para referência
            usuario_id: clienteAPI.usuario_id,
            Usuario: usuario
        };
    };

    // Função para formatar dados específicos para edição
    const formatarClienteParaEdicao = (responseCompleta) => {
        console.log('formatarClienteParaEdicao - dados recebidos:', responseCompleta); // Debug
        
        // Extrair o cliente da resposta da API
        const clienteCompleto = responseCompleta.cliente || responseCompleta;
        
        // Verificar se clienteCompleto tem dados válidos
        if (!clienteCompleto || (!clienteCompleto.ID && !clienteCompleto.id)) {
            console.error('Cliente completo inválido:', clienteCompleto);
            return null;
        }
        
        const usuario = clienteCompleto.Usuario || {};
        
        const clienteFormatado = {
            id: clienteCompleto.ID || clienteCompleto.id,
            nome: clienteCompleto.nome || '',
            sobrenome: clienteCompleto.sobrenome || '',
            cpf: usuario.cpf || '',
            cpfCnpj: usuario.cpf || '', // Para compatibilidade com o modal
            email: usuario.email || '',
            data_nasc: usuario.data_nasc || '',
            dataNascimento: usuario.data_nasc ? 
                new Date(usuario.data_nasc).toISOString().split('T')[0] : '',
            usuario_id: clienteCompleto.usuario_id,
            Usuario: usuario
        };
        
        console.log('Cliente formatado para edição:', clienteFormatado); // Debug
        return clienteFormatado;
    };

    const handleEditar = async (cliente) => {
        try {
            setOperationLoading(true);
            setError(null);
            
            console.log('Cliente selecionado para edição:', cliente); // Debug
            
            // Buscar dados completos do cliente na API
            const responseCompleta = await clienteService.buscarPorId(cliente.id);
            
            console.log('Response completa da API:', responseCompleta); // Debug
            
            // Verificar se recebeu dados válidos da API
            if (!responseCompleta) {
                throw new Error('Dados do cliente não encontrados');
            }
            
            // Formatar dados especificamente para edição
            const clienteFormatado = formatarClienteParaEdicao(responseCompleta);
            
            if (!clienteFormatado) {
                throw new Error('Erro ao formatar dados do cliente');
            }
            
            console.log('Cliente final para modal:', clienteFormatado); // Debug
            
            // Garantir que o cliente seja definido antes de abrir o modal
            setClienteSelecionado(clienteFormatado);
            
            // Aguardar um pouco para garantir que o estado foi atualizado
            setTimeout(() => {
                setOpenEditModal(true);
            }, 100);
            
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            setError('Erro ao carregar dados do cliente para edição.');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleExcluir = (cliente) => {
        setClienteParaExcluir(cliente);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = async () => {
        if (!clienteParaExcluir) return;

        try {
            setOperationLoading(true);
            await clienteService.deletar(clienteParaExcluir.id);
            setSuccess('Cliente excluído com sucesso!');
            await carregarClientes(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            setError('Erro ao excluir cliente. Tente novamente.');
        } finally {
            setOperationLoading(false);
            setOpenDeleteModal(false);
            setClienteParaExcluir(null);
        }
    };

    const adicionarCliente = async (novoCliente) => {
        try {
            setOperationLoading(true);
            const clienteFormatado = formatarClienteParaAPI(novoCliente);
            await clienteService.criar(clienteFormatado);
            setSuccess('Cliente adicionado com sucesso!');
            setOpenModal(false);
            await carregarClientes(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            setError('Erro ao adicionar cliente. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    const atualizarCliente = async (clienteAtualizado) => {
        try {
            setOperationLoading(true);
            const clienteFormatado = formatarClienteParaAPI(clienteAtualizado);
            await clienteService.atualizar(clienteAtualizado.id, clienteFormatado);
            setSuccess('Cliente atualizado com sucesso!');
            setOpenEditModal(false);
            setClienteSelecionado(null);
            await carregarClientes(); // Recarregar lista
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            setError('Erro ao atualizar cliente. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    // Filtrar clientes
    const clientesFiltrados = clientes.filter((cliente) => {
        const termoBusca = busca.toLowerCase();
        const nomeCompleto = `${cliente.nome || ''} ${cliente.sobrenome || ''}`.toLowerCase();
        return (
            nomeCompleto.includes(termoBusca) ||
            (cliente.cpf && cliente.cpf.includes(busca)) ||
            (cliente.email && cliente.email.toLowerCase().includes(termoBusca)) ||
            (cliente.data_nasc && cliente.data_nasc.includes(busca))
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
                        Adicionar Cliente
                    </Button>

                    <TextField
                        size="small"
                        placeholder="Buscar por nome, CPF ou email..."
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

                {/* Debug: Mostrar quantidade de clientes carregados */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {clientes.length} cliente(s) carregado(s)
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Data de Nascimento</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map((cliente) => (
                                    <TableRow key={cliente.id}>
                                        <TableCell>{cliente.id}</TableCell>
                                        <TableCell>
                                            {`${cliente.nome || ''} ${cliente.sobrenome || ''}`.trim()}
                                        </TableCell>
                                        <TableCell>{cliente.cpf || '-'}</TableCell>
                                        <TableCell>{cliente.email || '-'}</TableCell>
                                        <TableCell>
                                            {cliente.data_nasc ? 
                                                new Date(cliente.data_nasc).toLocaleDateString('pt-BR') : 
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ mr: 1, width: "5rem", background: "#0C58A3" }}
                                                onClick={() => handleEditar(cliente)}
                                                disabled={operationLoading}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{ width: "5rem", background: "#E84C3E" }}
                                                onClick={() => handleExcluir(cliente)}
                                                disabled={operationLoading}
                                            >
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {busca ? 'Nenhum cliente encontrado com os filtros aplicados.' : 'Nenhum cliente cadastrado.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal Adicionar Cliente */}
            <AddCustomerModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                adicionarCliente={adicionarCliente}
                loading={operationLoading}
            />

            {/* Modal Editar Cliente */}
            <EditCustomerModal
                open={openEditModal}
                handleClose={() => {
                    setOpenEditModal(false);
                    setClienteSelecionado(null);
                }}
                cliente={clienteSelecionado}
                atualizarCliente={atualizarCliente}
                loading={operationLoading}
            />

            {/* Dialog Confirmar Exclusão */}
            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o cliente{" "}
                        <strong>{clienteParaExcluir ? `${clienteParaExcluir.nome || ''} ${clienteParaExcluir.sobrenome || ''}`.trim() : ""}</strong>? 
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

export default CustomerAdmin;