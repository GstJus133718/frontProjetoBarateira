import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Box,
    IconButton,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { estoqueService } from './services/estoqueService';

const EstoqueModal = ({ open, handleClose, produto }) => {
    const [estoques, setEstoques] = useState([]);
    const [filiais, setFiliais] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Estados para adicionar novo estoque
    const [novoEstoque, setNovoEstoque] = useState({
        filial_id: '',
        quantidade: ''
    });
    const [adicionandoEstoque, setAdicionandoEstoque] = useState(false);
    
    // Estados para edição
    const [editandoEstoque, setEditandoEstoque] = useState(null);
    const [quantidadeEditando, setQuantidadeEditando] = useState('');

    // Carregar dados quando o modal abrir
    useEffect(() => {
        if (open && produto) {
            carregarDados();
        }
    }, [open, produto]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Carregando dados para produto:', produto.id);
            
            // Carregar filiais e estoque em paralelo
            const [filiaisResponse, estoqueResponse] = await Promise.allSettled([
                estoqueService.listarFiliais(),
                estoqueService.listarPorProduto(produto.id)
            ]);

            // Processar filiais
            if (filiaisResponse.status === 'fulfilled') {
                console.log('Filiais carregadas:', filiaisResponse.value);
                let filiaisData = [];
                
                // Extrair filiais da resposta (pode vir como { filiais: [...] } ou diretamente [...])
                if (filiaisResponse.value && filiaisResponse.value.filiais && Array.isArray(filiaisResponse.value.filiais)) {
                    filiaisData = filiaisResponse.value.filiais;
                } else if (Array.isArray(filiaisResponse.value)) {
                    filiaisData = filiaisResponse.value;
                }
                
                // Formatar dados das filiais
                const filiaisFormatadas = filiaisData.map(filial => ({
                    id: filial.ID || filial.id,
                    nome: filial.nome || `Filial ${filial.ID || filial.id}`,
                    // Manter dados originais
                    ...filial
                }));
                
                console.log('Filiais formatadas:', filiaisFormatadas);
                setFiliais(filiaisFormatadas);
            } else {
                console.error('Erro ao carregar filiais:', filiaisResponse.reason);
                setFiliais([]);
            }

            // Processar estoque com a nova estrutura da API
            if (estoqueResponse.status === 'fulfilled') {
                console.log('Estoque carregado:', estoqueResponse.value);
                let estoqueData = [];
                
                // A nova estrutura da API tem { estoques: [...], produto: {...} }
                if (estoqueResponse.value && estoqueResponse.value.estoques && Array.isArray(estoqueResponse.value.estoques)) {
                    estoqueData = estoqueResponse.value.estoques;
                } else if (Array.isArray(estoqueResponse.value)) {
                    estoqueData = estoqueResponse.value;
                }
                
                // Formatar dados do estoque para o frontend
                const estoqueFormatado = estoqueData.map(estoque => ({
                    id: estoque.ID || estoque.id,
                    filial_id: estoque.filial_id,
                    quantidade: estoque.quantidade || 0,
                    // Dados da filial (se disponível)
                    nomeFilial: estoque.Filial?.nome || `Filial ${estoque.filial_id}`,
                    // Manter dados originais
                    ...estoque
                }));
                
                console.log('Estoque formatado:', estoqueFormatado);
                setEstoques(estoqueFormatado);
            } else {
                console.log('Nenhum estoque encontrado ou erro:', estoqueResponse.reason);
                setEstoques([]);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar dados do estoque.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdicionarEstoque = async () => {
        if (!novoEstoque.filial_id || !novoEstoque.quantidade) {
            setError('Filial e quantidade são obrigatórios.');
            return;
        }

        try {
            setAdicionandoEstoque(true);
            setError(null);

            const dadosEstoque = {
                produto_id: produto.id,
                filial_id: parseInt(novoEstoque.filial_id),
                quantidade: parseInt(novoEstoque.quantidade)
            };

            console.log('Adicionando estoque:', dadosEstoque);

            await estoqueService.criar(dadosEstoque);
            setSuccess('Estoque adicionado com sucesso!');
            setNovoEstoque({ filial_id: '', quantidade: '' });
            await carregarDados(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao adicionar estoque:', error);
            
            // Mensagens de erro específicas
            if (error.response?.status === 400) {
                setError('Já existe estoque para esta filial. Use a edição para alterar a quantidade.');
            } else if (error.response?.status === 404) {
                setError('Produto ou filial não encontrado.');
            } else {
                setError('Erro ao adicionar estoque. Tente novamente.');
            }
        } finally {
            setAdicionandoEstoque(false);
        }
    };

    const handleEditarEstoque = (estoque) => {
        setEditandoEstoque(estoque.id);
        setQuantidadeEditando(estoque.quantidade.toString());
    };

    const handleSalvarEdicao = async (estoqueId) => {
        if (!quantidadeEditando || parseInt(quantidadeEditando) < 0) {
            setError('Quantidade deve ser um número válido e não negativo.');
            return;
        }

        try {
            setError(null);

            const dadosAtualizacao = {
                quantidade: parseInt(quantidadeEditando)
            };

            console.log('Atualizando estoque:', { id: estoqueId, dados: dadosAtualizacao });

            await estoqueService.atualizar(estoqueId, dadosAtualizacao);
            setSuccess('Estoque atualizado com sucesso!');
            setEditandoEstoque(null);
            setQuantidadeEditando('');
            await carregarDados(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
            setError('Erro ao atualizar estoque.');
        }
    };

    const handleCancelarEdicao = () => {
        setEditandoEstoque(null);
        setQuantidadeEditando('');
    };

    const handleDeletarEstoque = async (estoqueId) => {
        if (!window.confirm('Tem certeza que deseja deletar este estoque?')) {
            return;
        }

        try {
            setError(null);
            console.log('Deletando estoque:', estoqueId);
            
            await estoqueService.deletar(estoqueId);
            setSuccess('Estoque deletado com sucesso!');
            await carregarDados(); // Recarregar dados

        } catch (error) {
            console.error('Erro ao deletar estoque:', error);
            setError('Erro ao deletar estoque.');
        }
    };

    const getNomeFilial = (filialId) => {
        // Primeiro tenta buscar pelo nome já incluído no estoque
        const estoqueAtual = estoques.find(e => e.filial_id === filialId);
        if (estoqueAtual && estoqueAtual.nomeFilial) {
            return estoqueAtual.nomeFilial;
        }
        
        // Se não encontrar, busca na lista de filiais
        const filial = filiais.find(f => f.id === filialId);
        return filial ? filial.nome : `Filial ${filialId}`;
    };

    const getFiliaisDisponiveis = () => {
        const filiaisComEstoque = estoques.map(e => e.filial_id);
        return filiais.filter(f => !filiaisComEstoque.includes(f.id));
    };

    // Auto-clear success message
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Auto-clear error message
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (!produto) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Gestão de Estoque - {produto.nome}
            </DialogTitle>
            
            <DialogContent>
                {/* Mensagens de feedback */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Carregando dados...</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Tabela de Estoque Atual */}
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Estoque Atual
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Filial</TableCell>
                                        <TableCell align="center">Quantidade</TableCell>
                                        <TableCell align="center">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {estoques.length > 0 ? (
                                        estoques.map((estoque) => (
                                            <TableRow key={estoque.id}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {getNomeFilial(estoque.filial_id)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {editandoEstoque === estoque.id ? (
                                                        <TextField
                                                            type="number"
                                                            size="small"
                                                            value={quantidadeEditando}
                                                            onChange={(e) => setQuantidadeEditando(e.target.value)}
                                                            sx={{ width: 80 }}
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {estoque.quantidade}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {editandoEstoque === estoque.id ? (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleSalvarEdicao(estoque.id)}
                                                                title="Salvar"
                                                            >
                                                                <SaveIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="secondary"
                                                                onClick={handleCancelarEdicao}
                                                                title="Cancelar"
                                                            >
                                                                <CancelIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEditarEstoque(estoque)}
                                                                title="Editar"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeletarEstoque(estoque.id)}
                                                                title="Deletar"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    Nenhum estoque cadastrado para este produto.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Adicionar Novo Estoque */}
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Adicionar Estoque
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <InputLabel>Filial</InputLabel>
                                <Select
                                    value={novoEstoque.filial_id}
                                    label="Filial"
                                    onChange={(e) => setNovoEstoque(prev => ({ ...prev, filial_id: e.target.value }))}
                                    disabled={adicionandoEstoque}
                                >
                                    {getFiliaisDisponiveis().length > 0 ? (
                                        getFiliaisDisponiveis().map((filial) => (
                                            <MenuItem key={filial.id} value={filial.id}>
                                                {filial.nome}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="" disabled>
                                            <em>Nenhuma filial disponível</em>
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Quantidade"
                                type="number"
                                size="small"
                                value={novoEstoque.quantidade}
                                onChange={(e) => setNovoEstoque(prev => ({ ...prev, quantidade: e.target.value }))}
                                disabled={adicionandoEstoque}
                                sx={{ width: 120 }}
                                inputProps={{ min: 0 }}
                            />

                            <Button
                                variant="contained"
                                startIcon={adicionandoEstoque ? <CircularProgress size={16} /> : <AddIcon />}
                                onClick={handleAdicionarEstoque}
                                disabled={adicionandoEstoque || !novoEstoque.filial_id || !novoEstoque.quantidade}
                                sx={{ 
                                    backgroundColor: '#0C58A3',
                                    '&:hover': { backgroundColor: '#094a8a' }
                                }}
                            >
                                {adicionandoEstoque ? 'Adicionando...' : 'Adicionar'}
                            </Button>
                        </Box>

                        {getFiliaisDisponiveis().length === 0 && filiais.length > 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Todas as filiais já possuem estoque cadastrado para este produto.
                            </Alert>
                        )}

                        {filiais.length === 0 && !loading && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Nenhuma filial encontrada. Cadastre filiais primeiro.
                            </Alert>
                        )}

                        {/* Debug info */}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                            Produto ID: {produto.id} | {filiais.length} filial(is) disponível(is) | {estoques.length} estoque(s) cadastrado(s)
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EstoqueModal;