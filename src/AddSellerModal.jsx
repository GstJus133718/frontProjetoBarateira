import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormHelperText
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

const AddSellerModal = ({ open, handleClose, adicionarVendedor }) => {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [filial, setFilial] = useState("Norte");
    const [status, setStatus] = useState("Ativo");
    const [sobrenome, setSobrenome] = useState("");
    const [senha, setSenha] = useState("");
    const [comissao, setComissao] = useState("0");
    const [perfil, setPerfil] = useState("Vendedor");
    
    // Estados para validação
    const [cpfError, setCpfError] = useState("");
    const [nomeError, setNomeError] = useState("");

    // Função para formatar CPF (xxx.xxx.xxx-xx)
    const formatarCPF = (valor) => {
        // Remove todos os caracteres não numéricos
        const apenasNumeros = valor.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        const cpfLimitado = apenasNumeros.slice(0, 11);
        
        // Aplica a formatação
        let cpfFormatado = cpfLimitado;
        if (cpfLimitado.length > 3) {
            cpfFormatado = cpfLimitado.replace(/^(\d{3})(\d)/, '$1.$2');
        }
        if (cpfLimitado.length > 6) {
            cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        }
        if (cpfLimitado.length > 9) {
            cpfFormatado = cpfFormatado.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        }
        
        return cpfFormatado;
    };

    // Handler para mudança no campo CPF
    const handleCpfChange = (e) => {
        const valorFormatado = formatarCPF(e.target.value);
        setCpf(valorFormatado);
        
        // Validação do CPF
        const apenasNumeros = valorFormatado.replace(/\D/g, '');
        if (apenasNumeros.length === 0) {
            setCpfError("CPF é obrigatório");
        } else if (apenasNumeros.length < 11) {
            setCpfError("CPF deve ter 11 dígitos");
        } else {
            setCpfError("");
        }
    };

    // Validação do formulário
    const validarFormulario = () => {
        let isValid = true;
        
        // Validar CPF
        const apenasNumeros = cpf.replace(/\D/g, '');
        if (apenasNumeros.length === 0) {
            setCpfError("CPF é obrigatório");
            isValid = false;
        } else if (apenasNumeros.length < 11) {
            setCpfError("CPF deve ter 11 dígitos");
            isValid = false;
        } else {
            setCpfError("");
        }
        
        // Validar nome
        if (!nome.trim()) {
            setNomeError("Nome é obrigatório");
            isValid = false;
        } else {
            setNomeError("");
        }
        
        return isValid;
    };

    const handleSubmit = () => {
        // Validar formulário antes de enviar
        if (!validarFormulario()) {
            return;
        }
        
        // Criar objeto com os dados do novo vendedor
        const novoVendedor = {
            nome: nome,
            cpf: cpf,
            filial: filial,
            status: status,
            sobrenome: sobrenome,
            senha: senha,
            comissao: comissao + " %",
            perfil: perfil
        };

        // Chamar a função de adicionar vendedor passada como prop
        adicionarVendedor(novoVendedor);
        
        // Limpar os campos
        resetForm();
    };

    const resetForm = () => {
        setNome("");
        setCpf("");
        setFilial("Norte");
        setStatus("Ativo");
        setSobrenome("");
        setSenha("");
        setComissao("0");
        setPerfil("Vendedor");
        setCpfError("");
        setNomeError("");
    };

    const handleCloseModal = () => {
        resetForm();
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography onClick={handleCloseModal} sx={{ cursor: "pointer" }}>
                        X
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography sx={{ fontWeight: 300 }}>Nome:</Typography>
                        <TextField 
                            placeholder="Nome" 
                            fullWidth 
                            margin="dense" 
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value);
                                if (e.target.value.trim()) {
                                    setNomeError("");
                                }
                            }}
                            error={!!nomeError}
                            helperText={nomeError}
                            required
                        />
                        <Typography sx={{ fontWeight: 300 }}>CPF:</Typography>
                        <TextField 
                            placeholder="CPF" 
                            fullWidth 
                            margin="dense" 
                            value={cpf}
                            onChange={handleCpfChange}
                            error={!!cpfError}
                            helperText={cpfError}
                            required
                            inputProps={{
                                maxLength: 14 // 11 números + 3 caracteres de formatação
                            }}
                        />
                        <Typography sx={{ fontWeight: 300 }}>Filial:</Typography>
                        <TextField
                            placeholder="Selecione uma filial"
                            select
                            fullWidth
                            margin="dense"
                            value={filial}
                            onChange={(e) => setFilial(e.target.value)}
                        >
                            <MenuItem value="Norte">Norte</MenuItem>
                            <MenuItem value="Sul">Sul</MenuItem>
                        </TextField>
                        <Typography sx={{ fontWeight: 300 }}>Status</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={status === "Ativo"} 
                                    onChange={() => setStatus("Ativo")}
                                />
                            }
                            label="Ativo"
                            componentsProps={{ typography: { sx: { fontWeight: 300 } } }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={status === "Inativo"} 
                                    onChange={() => setStatus("Inativo")}
                                />
                            }
                            label="Inativo"
                            componentsProps={{ typography: { sx: { fontWeight: 300 } } }}
                        />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <Typography sx={{ fontWeight: 300 }}>Sobrenome:</Typography>
                        <TextField 
                            placeholder="Sobrenome" 
                            fullWidth 
                            margin="dense" 
                            value={sobrenome}
                            onChange={(e) => setSobrenome(e.target.value)}
                        />
                        <Typography sx={{ fontWeight: 300 }}>Senha:</Typography>
                        <TextField 
                            placeholder="Senha" 
                            fullWidth 
                            margin="dense" 
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 2 }}>
                                <Typography sx={{ fontWeight: 300 }}>Comissão:</Typography>
                                <TextField
                                    placeholder="Valor"
                                    margin="dense"
                                    fullWidth
                                    sx={{ width: "11rem" }}
                                    value={comissao}
                                    onChange={(e) => setComissao(e.target.value)}
                                    InputProps={{
                                        endAdornment: "%"
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 2 }}>
                                <Typography sx={{ fontWeight: 300 }}>Perfil:</Typography>
                                <TextField
                                    placeholder="Vendedor"
                                    select
                                    margin="dense"
                                    fullWidth
                                    sx={{ width: "12rem" }}
                                    value={perfil}
                                    onChange={(e) => setPerfil(e.target.value)}
                                >
                                    <MenuItem value="Vendedor">Vendedor</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                </TextField>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button 
                        variant="contained" 
                        sx={{ px: 8, py: 1, background: "#0C58A3" }}
                        onClick={handleSubmit}
                    >
                        Adicionar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddSellerModal;
