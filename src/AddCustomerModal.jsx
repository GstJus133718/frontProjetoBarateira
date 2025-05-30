import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel
} from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const AddCustomerModal = ({ open, handleClose, adicionarCliente }) => {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [status, setStatus] = useState("Ativo");
    const [cpfError, setCpfError] = useState("");
    const [nomeError, setNomeError] = useState("");
    const [emailError, setEmailError] = useState("");

    const formatarCPF = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);
        return apenasNumeros.replace(/(\d{3})(\d)/, "$1.$2")
                             .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                             .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    };

    const handleCpfChange = (e) => {
        const valor = formatarCPF(e.target.value);
        setCpf(valor);
        const apenasNumeros = valor.replace(/\D/g, '');
        setCpfError(!apenasNumeros ? "CPF é obrigatório" : apenasNumeros.length < 11 ? "CPF deve ter 11 dígitos" : "");
    };

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (e) => {
        const valor = e.target.value;
        setEmail(valor);
        setEmailError(!valor ? "Email é obrigatório" : !validarEmail(valor) ? "Email inválido" : "");
    };

    const validarFormulario = () => {
        const cpfNumeros = cpf.replace(/\D/g, '');
        let valido = true;

        if (!nome.trim()) {
            setNomeError("Nome é obrigatório");
            valido = false;
        } else setNomeError("");

        if (!cpfNumeros) {
            setCpfError("CPF é obrigatório");
            valido = false;
        } else if (cpfNumeros.length < 11) {
            setCpfError("CPF deve ter 11 dígitos");
            valido = false;
        } else setCpfError("");

        if (!email) {
            setEmailError("Email é obrigatório");
            valido = false;
        } else if (!validarEmail(email)) {
            setEmailError("Email inválido");
            valido = false;
        } else setEmailError("");

        return valido;
    };

    const resetForm = () => {
        setNome(""); setCpf(""); setEmail(""); setDataNascimento(""); setStatus("Ativo");
        setCpfError(""); setNomeError(""); setEmailError("");
    };

    const handleSubmit = () => {
        if (!validarFormulario()) return;

        adicionarCliente({ nome, cpf, email, dataNascimento, status });
        resetForm();
    };

    const handleCloseModal = () => {
        resetForm();
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography onClick={handleCloseModal} sx={{ cursor: "pointer" }}>X</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography sx={{ fontWeight: 300 }}>Nome:</Typography>
                        <TextField fullWidth margin="dense" placeholder="Nome" value={nome} onChange={(e) => {
                            setNome(e.target.value);
                            if (e.target.value.trim()) setNomeError("");
                        }} error={!!nomeError} helperText={nomeError} required />

                        <Typography sx={{ fontWeight: 300 }}>CPF / CNPJ:</Typography>
                        <TextField fullWidth margin="dense" placeholder="CPF / CNPJ" value={cpf} onChange={handleCpfChange} error={!!cpfError} helperText={cpfError} required inputProps={{ maxLength: 18 }} />

                        <Typography sx={{ fontWeight: 300 }}>Email:</Typography>
                        <TextField fullWidth margin="dense" placeholder="Email" type="email" value={email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required />

                        <Typography sx={{ fontWeight: 300 }}>Data de Nascimento:</Typography>
                        <TextField fullWidth margin="dense" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} InputLabelProps={{ shrink: true }} />

                        <FormControl component="fieldset" sx={{ mt: 1 }}>
                            <FormLabel component="legend" sx={{ fontWeight: 300 }}>Status</FormLabel>
                            <RadioGroup
                                row
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <FormControlLabel
                                    value="Ativo"
                                    control={<Radio />}
                                    label="Ativo"
                                />
                                <FormControlLabel
                                    value="Inativo"
                                    control={<Radio />}
                                    label="Inativo"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button variant="contained" sx={{ px: 8, py: 1, background: "#0C58A3" }} onClick={handleSubmit}>
                        Adicionar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddCustomerModal;
