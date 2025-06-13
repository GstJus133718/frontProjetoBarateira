import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress
} from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const AddCustomerModal = ({ open, handleClose, adicionarCliente, loading = false }) => {
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setNome("");
        setSobrenome("");
        setCpfCnpj("");
        setEmail("");
        setSenha("");
        setDataNascimento("");
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        if (!email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email inválido";
        }

        if (!cpfCnpj.trim()) {
            newErrors.cpfCnpj = "CPF é obrigatório";
        }

        if (!senha.trim()) {
            newErrors.senha = "Senha é obrigatória";
        } else if (senha.length < 6) {
            newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
        }

        if (!dataNascimento) {
            newErrors.dataNascimento = "Data de nascimento é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const novoCliente = {
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            cpfCnpj: cpfCnpj.trim(),
            email: email.trim(),
            senha: senha.trim(),
            dataNascimento
        };

        adicionarCliente(novoCliente);
    };

    const handleCloseModal = () => {
        if (!loading) {
            resetForm();
            handleClose();
        }
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" component="h2">
                        Adicionar Novo Cliente
                    </Typography>
                    {!loading && (
                        <Typography 
                            onClick={handleCloseModal} 
                            sx={{ cursor: "pointer", fontSize: 20, fontWeight: 'bold' }}
                        >
                            ×
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome *"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            error={!!errors.nome}
                            helperText={errors.nome}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Sobrenome"
                            value={sobrenome}
                            onChange={(e) => setSobrenome(e.target.value)}
                            disabled={loading}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="CPF *"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(e.target.value)}
                        error={!!errors.cpfCnpj}
                        helperText={errors.cpfCnpj}
                        disabled={loading}
                        placeholder="000.000.000-00"
                    />

                    <TextField
                        fullWidth
                        label="Email *"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Senha *"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        error={!!errors.senha}
                        helperText={errors.senha}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Data de Nascimento *"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        error={!!errors.dataNascimento}
                        helperText={errors.dataNascimento}
                        disabled={loading}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCloseModal}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Adicionar'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddCustomerModal;