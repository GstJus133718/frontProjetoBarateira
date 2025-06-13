import React, { useState } from "react";
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

const AddBranchModal = ({ open, handleClose, adicionarFilial, loading = false }) => {
    const [novaFilial, setNovaFilial] = useState({
        nome: "",
        endereco: "",
        telefone: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovaFilial((prev) => ({
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

        if (!novaFilial.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        if (!novaFilial.endereco.trim()) {
            newErrors.endereco = "Endereço é obrigatório";
        }

        if (!novaFilial.telefone.trim()) {
            newErrors.telefone = "Telefone é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        adicionarFilial(novaFilial);
    };

    const resetForm = () => {
        setNovaFilial({ nome: "", endereco: "", telefone: "" });
        setErrors({});
    };

    const handleCloseModal = () => {
        if (!loading) {
            resetForm();
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar Filial</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Nome *"
                        name="nome"
                        value={novaFilial.nome}
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
                        value={novaFilial.endereco}
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
                        value={novaFilial.telefone}
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
                    {loading ? "Adicionando..." : "Adicionar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddBranchModal;