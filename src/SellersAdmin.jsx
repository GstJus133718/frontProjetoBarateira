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
import AddFuncionarioModal from "./AddFuncionarioModal";
import EditFuncionarioModal from "./EditFuncionarioModal";
import { funcionarioService } from './services/funcionarioService';
import { filialService } from './services/filialService';

const FuncionariosAdmin = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [filiais, setFiliais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);
    
    // Estados para feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [operationLoading, setOperationLoading] = useState(false);
    
    const navigate = useNavigate();

    // Carregar funcionários da API
    const carregarFuncionarios = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await funcionarioService.listar();
            
            console.log('Response da API funcionários:', response);
            
            // Extrair os funcionários da resposta
            let funcionariosData = [];
            if (response && response.funcionarios && Array.isArray(response.funcionarios)) {
                funcionariosData = response.funcionarios;
            } else if (Array.isArray(response)) {
                funcionariosData = response;
            }
            
            // Formatar os dados dos funcionários para o frontend
            const funcionariosFormatados = funcionariosData.map(funcionario => formatarFuncionarioDaAPI(funcionario));
            
            setFuncionarios(funcionariosFormatados);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            setError('Erro ao carregar lista de funcionários. Tente novamente.');
            setFuncionarios([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar filiais para dropdowns
    const carregarFiliais = async () => {
        try {
            const response = await filialService.listar();
            
            let filiaisData = [];
            if (response && response.filiais && Array.isArray(response.filiais)) {
                filiaisData = response.filiais;
            } else if (Array.isArray(response)) {
                filiaisData = response;
            }
            
            const filiaisFormatadas = filiaisData.map(filial => ({
                id: filial.ID || filial.id,
                nome: filial.nome || '',
                ...filial
            }));
            
            setFiliais(filiaisFormatadas);
        } catch (error) {
            console.error('Erro ao carregar filiais:', error);
        }
    };

    // Carregar dados ao montar o componente
    useEffect(() => {
        carregarFuncionarios();
        carregarFiliais();
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

    // Função para formatar dados da API para o frontend
    const formatarFuncionarioDaAPI = (funcionarioAPI) => {
        // A estrutura da API tem Usuario dentro do funcionário
        const usuario = funcionarioAPI.Usuario || {};
        const filial = funcionarioAPI.Filial || {};
        
        return {
            id: funcionarioAPI.ID || funcionarioAPI.id,
            nome: funcionarioAPI.nome || '',
            sobrenome: funcionarioAPI.sobrenome || '',
            cpf: usuario.cpf || '',
            email: usuario.email || '',
            data_nasc: usuario.data_nasc || '',
            cargo: funcionarioAPI.cargo || '',
            salario: funcionarioAPI.salario || 0,
            filial_id: funcionarioAPI.filial_id,
            filial: filial.nome || `Filial ${funcionarioAPI.filial_id}`,
            // Campos para compatibilidade com os modais
            cpfCnpj: usuario.cpf || '',
            dataNascimento: usuario.data_nasc ? 
                new Date(usuario.data_nasc).toISOString().split('T')[0] : '',
            // Para compatibilidade com o sistema antigo
            comissao: funcionarioAPI.cargo === 'Vendedor' ? '5 %' : '0 %',
            perfil: funcionarioAPI.cargo === 'Vendedor' ? 'Vendedor' : 'Admin',
            status: 'Ativo', // Por padrão ativo, ajustar se a API tiver esse campo
            // Manter dados originais para referência
            usuario_id: funcionarioAPI.usuario_id,
            Usuario: usuario,
            Filial: filial
        };
    };

    // Função para formatar dados do frontend para a API
    const formatarFuncionarioParaAPI = (funcionarioData) => {
        return {
            email: funcionarioData.email,
            senha: funcionarioData.senha || "123456",
            cpf: funcionarioData.cpfCnpj?.replace(/\D/g, '') || funcionarioData.cpf?.replace(/\D/g, ''),
            data_nasc: funcionarioData.dataNascimento ? 
                new Date(funcionarioData.dataNascimento).toISOString() : 
                new Date().toISOString(),
            nome: funcionarioData.nome,
            sobrenome: funcionarioData.sobrenome || "",
            cargo: funcionarioData.cargo || funcionarioData.perfil || "Vendedor",
            salario: parseFloat(funcionarioData.salario) || 2500.00,
            filial_id: parseInt(funcionarioData.filial_id) || parseInt(funcionarioData.filial)
        };
    };

    const handleLogout = () => {
        navigate("/admin");
    };

    const handleEditar = async (funcionario) => {
        try {
            setOperationLoading(true);
            setError(null);
            
            console.log('Funcionário selecionado para edição:', funcionario);
            
            // Buscar dados completos do funcionário na API
            const responseCompleta = await funcionarioService.buscarPorId(funcionario.id);
            
            console.log('Response completa da API:', responseCompleta);
            
            // Verificar se recebeu dados válidos da API
            if (!responseCompleta) {
                throw new Error('Dados do funcionário não encontrados');
            }
            
            // Formatar dados especificamente para edição
            const funcionarioFormatado = formatarFuncionarioParaEdicao(responseCompleta);
            
            if (!funcionarioFormatado) {
                throw new Error('Erro ao formatar dados do funcionário');
            }
            
            console.log('Funcionário final para modal:', funcionarioFormatado);
            
            setFuncionarioSelecionado(funcionarioFormatado);
            
            setTimeout(() => {
                setOpenEditModal(true);
            }, 100);
            
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            setError('Erro ao carregar dados do funcionário para edição.');
        } finally {
            setOperationLoading(false);
        }
    };

    // Função para formatar dados específicos para edição
    const formatarFuncionarioParaEdicao = (responseCompleta) => {
        console.log('formatarFuncionarioParaEdicao - dados recebidos:', responseCompleta);
        
        const funcionarioCompleto = responseCompleta.funcionario || responseCompleta;
        
        if (!funcionarioCompleto || (!funcionarioCompleto.ID && !funcionarioCompleto.id)) {
            console.error('Funcionário completo inválido:', funcionarioCompleto);
            return null;
        }
        
        const usuario = funcionarioCompleto.Usuario || {};
        const filial = funcionarioCompleto.Filial || {};
        
        const funcionarioFormatado = {
            id: funcionarioCompleto.ID || funcionarioCompleto.id,
            nome: funcionarioCompleto.nome || '',
            sobrenome: funcionarioCompleto.sobrenome || '',
            cpf: usuario.cpf || '',
            cpfCnpj: usuario.cpf || '',
            email: usuario.email || '',
            data_nasc: usuario.data_nasc || '',
            dataNascimento: usuario.data_nasc ? 
                new Date(usuario.data_nasc).toISOString().split('T')[0] : '',
            cargo: funcionarioCompleto.cargo || '',
            salario: funcionarioCompleto.salario || 0,
            filial_id: funcionarioCompleto.filial_id,
            filial: filial.nome || `Filial ${funcionarioCompleto.filial_id}`,
            // Para compatibilidade
            perfil: funcionarioCompleto.cargo || 'Vendedor',
            comissao: funcionarioCompleto.cargo === 'Vendedor' ? '5' : '0',
            status: 'Ativo',
            usuario_id: funcionarioCompleto.usuario_id,
            Usuario: usuario,
            Filial: filial
        };
        
        console.log('Funcionário formatado para edição:', funcionarioFormatado);
        return funcionarioFormatado;
    };

    const handleExcluir = (funcionario) => {
        setFuncionarioParaExcluir(funcionario);
        setOpenDeleteModal(true);
    };

    const confirmarExclusao = async () => {
        if (!funcionarioParaExcluir) return;

        try {
            setOperationLoading(true);
            await funcionarioService.deletar(funcionarioParaExcluir.id);
            setSuccess('Funcionário excluído com sucesso!');
            await carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            setError('Erro ao excluir funcionário. Tente novamente.');
        } finally {
            setOperationLoading(false);
            setOpenDeleteModal(false);
            setFuncionarioParaExcluir(null);
        }
    };

    const adicionarFuncionario = async (novoFuncionario) => {
        try {
            setOperationLoading(true);
            const funcionarioFormatado = formatarFuncionarioParaAPI(novoFuncionario);
            await funcionarioService.criar(funcionarioFormatado);
            setSuccess('Funcionário adicionado com sucesso!');
            setOpenModal(false);
            await carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao adicionar funcionário:', error);
            setError('Erro ao adicionar funcionário. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    const atualizarFuncionario = async (funcionarioAtualizado) => {
        try {
            setOperationLoading(true);
            const funcionarioFormatado = formatarFuncionarioParaAPI(funcionarioAtualizado);
            await funcionarioService.atualizar(funcionarioAtualizado.id, funcionarioFormatado);
            setSuccess('Funcionário atualizado com sucesso!');
            setOpenEditModal(false);
            setFuncionarioSelecionado(null);
            await carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            setError('Erro ao atualizar funcionário. Verifique os dados e tente novamente.');
        } finally {
            setOperationLoading(false);
        }
    };

    // Filtrar funcionários
    const funcionariosFiltrados = funcionarios.filter((funcionario) => {
        const nomeCompleto = `${funcionario.nome} ${funcionario.sobrenome || ''}`.toLowerCase();
        const termoBusca = busca.toLowerCase();
        return (
            nomeCompleto.includes(termoBusca) ||
            (funcionario.cpf && funcionario.cpf.includes(busca)) ||
            (funcionario.email && funcionario.email.toLowerCase().includes(termoBusca)) ||
            (funcionario.cargo && funcionario.cargo.toLowerCase().includes(termoBusca)) ||
            (funcionario.filial && funcionario.filial.toLowerCase().includes(termoBusca))
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
            {/* Header */}
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

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Gestão de Funcionários
                </Typography>

                {/* Mensagens de Sucesso e Erro */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={handleCloseSuccess}>
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
                        {error}
                    </Alert>
                )}

                {/* Controles */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ width: "250px", backgroundColor: "#0C58A3", "&:hover": { backgroundColor: "#094a8a" } }}
                        onClick={() => setOpenModal(true)}
                        disabled={operationLoading}
                    >
                        Adicionar Funcionário
                    </Button>

                    <TextField
                        size="small"
                        placeholder="Buscar por nome, CPF, email ou cargo..."
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

                {/* Debug: Mostrar quantidade de funcionários carregados */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {funcionarios.length} funcionário(s) carregado(s)
                </Typography>

                {/* Tabela */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Cargo</TableCell>
                                <TableCell>Salário</TableCell>
                                <TableCell>Filial</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {funcionariosFiltrados.length > 0 ? (
                                funcionariosFiltrados.map((funcionario) => (
                                    <TableRow key={funcionario.id}>
                                        <TableCell>{funcionario.id}</TableCell>
                                        <TableCell>{`${funcionario.nome} ${funcionario.sobrenome || ''}`.trim()}</TableCell>
                                        <TableCell>{funcionario.cpf}</TableCell>
                                        <TableCell>{funcionario.email}</TableCell>
                                        <TableCell>{funcionario.cargo}</TableCell>
                                        <TableCell>R$ {funcionario.salario.toFixed(2).replace('.', ',')}</TableCell>
                                        <TableCell>{funcionario.filial}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ minWidth: "auto", px: 1, background: "#0C58A3" }}
                                                    onClick={() => handleEditar(funcionario)}
                                                    disabled={operationLoading}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ minWidth: "auto", px: 1, background: "#E84C3E" }}
                                                    onClick={() => handleExcluir(funcionario)}
                                                    disabled={operationLoading}
                                                >
                                                    Excluir
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ minWidth: "auto", px: 1, backgroundColor: "#414141" }}
                                                    disabled
                                                >
                                                    Vendas
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {busca ? 'Nenhum funcionário encontrado com os filtros aplicados.' : 'Nenhum funcionário cadastrado.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal de Adição */}
            <AddFuncionarioModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                adicionarFuncionario={adicionarFuncionario}
                filiais={filiais}
                loading={operationLoading}
            />

            {/* Modal de Edição */}
            <EditFuncionarioModal
                open={openEditModal}
                handleClose={() => {
                    setOpenEditModal(false);
                    setFuncionarioSelecionado(null);
                }}
                funcionario={funcionarioSelecionado}
                atualizarFuncionario={atualizarFuncionario}
                filiais={filiais}
                loading={operationLoading}
            />

            {/* Dialog Confirmar Exclusão */}
            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir o funcionário{" "}
                        <strong>{funcionarioParaExcluir ? `${funcionarioParaExcluir.nome || ''} ${funcionarioParaExcluir.sobrenome || ''}`.trim() : ""}</strong>?
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
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!error} 
                autoHideDuration={8000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FuncionariosAdmin;