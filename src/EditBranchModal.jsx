import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    CircularProgress
} from "@mui/material";

const EditBranchModal = ({ open, handleClose, filial, atualizarFilial, loading = false }) => {
    const [filialEditada, setFilialEditada] = useState({
        nome: "",
        endereco: "",
        telefone: "",
    });

    const [errors, setErrors] = useState({});

    // Efeito para popular os campos quando a filial mudar ou o modal abrir
    useEffect(() => {
        console.log('EditBranchModal - Filial recebida:', filial); // Debug
        console.log('EditBranchModal - Modal open:', open); // Debug
        
        if (filial && open) {
            console.log('Populando campos com dados da filial:', filial); // Debug
            
            // A resposta da API pode vir com a estrutura { filial: { ... } } ou diretamente { ... }
            const dadosFilial = filial.filial || filial;
            
            setFilialEditada({
                id: dadosFilial.ID || dadosFilial.id || filial.id,
                nome: dadosFilial.nome || "",
                endereco: dadosFilial.endereco || "",
                telefone: dadosFilial.telefone || "",
            });
            
            // Limpar erros quando uma nova filial for carregada
            setErrors({});
            
            console.log('Campos populados:', {
                id: dadosFilial.ID || dadosFilial.id || filial.id,
                nome: dadosFilial.nome,
                endereco: dadosFilial.endereco,
                telefone: dadosFilial.telefone
            }); // Debug
        }
    }, [filial, open]);

    // Efeito para limpar campos quando o modal fechar
    useEffect(() => {
        if (!open) {
            setFilialEditada({ nome: "", endereco: "", telefone: "" });
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilialEditada((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!filialEditada.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        if (!filialEditada.endereco.trim()) {
            newErrors.endereco = "Endereço é obrigatório";
        }

        if (!filialEditada.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        console.log('Enviando filial atualizada:', filialEditada); // Debug
        atualizarFilial(filialEditada);
    };

    const handleCloseModal = () => {
        if (!loading) {
            handleClose();
        }
    };

    // Se não há filial selecionada, não renderizar o modal
    if (!filial) {
        return null;
    }

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Filial</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Nome *"
                        name="nome"
                        value={filialEditada.nome}
                        onChange={handleChange}
                        error={!!errors.nome}
                        helperText={errors.nome}
                        disabled={loading}
                        fullWidth
                        placeholder="Nome da filial"
                    />
                    
                    <TextField
                        label="Endereço *"
                        name="endereco"
                        value={filialEditada.endereco}
                        onChange={handleChange}
                        error={!!errors.endereco}
                        helperText={errors.endereco}
                        disabled={loading}
                        fullWidth
                        placeholder="Endereço completo da filial"
                        multiline
                        rows={2}
                    />
                    
                    <TextField
                        label="Telefone *"
                        name="telefone"
                        value={filialEditada.telefone}
                        onChange={handleChange}
                        error={!!errors.telefone}
                        helperText={errors.telefone}
                        disabled={loading}
                        fullWidth
                        placeholder="(00) 0000-0000"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal} disabled={loading}>
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBranchModal;