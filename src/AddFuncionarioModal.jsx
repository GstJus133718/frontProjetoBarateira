import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormHelperText,
    CircularProgress
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

const AddFuncionarioModal = ({ open, handleClose, adicionarFuncionario, filiais, loading }) => {
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("123456");
    const [cargo, setCargo] = useState("Vendedor");
    const [salario, setSalario] = useState("2500.00");
    const [filial_id, setFilialId] = useState("");
    
    // Estados para validação
    const [errors, setErrors] = useState({});

    // Função para formatar CPF (xxx.xxx.xxx-xx)
    const formatarCPF = (valor) => {
        const apenasNumeros = valor.replace(/\D/g, '');
        const cpfLimitado = apenasNumeros.slice(0, 11);
        
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
        setCpfCnpj(valorFormatado);
        
        // Validação do CPF
        const apenasNumeros = valorFormatado.replace(/\D/g, '');
        if (apenasNumeros.length === 0) {
            setErrors(prev => ({ ...prev, cpfCnpj: "CPF é obrigatório" }));
        } else if (apenasNumeros.length < 11) {
            setErrors(prev => ({ ...prev, cpfCnpj: "CPF deve ter 11 dígitos" }));
        } else {
            setErrors(prev => ({ ...prev, cpfCnpj: "" }));
        }
    };

    // Validação do formulário
    const validarFormulario = () => {
        const newErrors = {};
        
        // Validar nome
        if (!nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }
        
        // Validar CPF
        const apenasNumeros = cpfCnpj.replace(/\D/g, '');
        if (apenasNumeros.length === 0) {
            newErrors.cpfCnpj = "CPF é obrigatório";
        } else if (apenasNumeros.length < 11) {
            newErrors.cpfCnpj = "CPF deve ter 11 dígitos";
        }
        
        // Validar email
        if (!email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email deve ter um formato válido";
        }
        
        // Validar data de nascimento
        if (!dataNascimento) {
            newErrors.dataNascimento = "Data de nascimento é obrigatória";
        }
        
        // Validar salário
        const salarioNum = parseFloat(salario);
        if (!salario || isNaN(salarioNum) || salarioNum <= 0) {
            newErrors.salario = "Salário deve ser um valor válido maior que zero";
        }
        
        // Validar filial
        if (!filial_id) {
            newErrors.filial_id = "Filial é obrigatória";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validarFormulario()) {
            return;
        }
        
        const novoFuncionario = {
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            cpfCnpj: cpfCnpj,
            email: email.trim(),
            dataNascimento: dataNascimento,
            senha: senha || "123456",
            cargo: cargo,
            salario: salario,
            filial_id: filial_id
        };

        console.log('Enviando funcionário:', novoFuncionario);
        adicionarFuncionario(novoFuncionario);
    };

    const resetForm = () => {
        setNome("");
        setSobrenome("");
        setCpfCnpj("");
        setEmail("");
        setDataNascimento("");
        setSenha("123456");
        setCargo("Vendedor");
        setSalario("2500.00");
        setFilialId("");
        setErrors({});
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
                        Adicionar Funcionário
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
                    {/* Primeira linha */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Nome:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                value={nome}
                                onChange={(e) => {
                                    setNome(e.target.value);
                                    if (errors.nome) setErrors(prev => ({ ...prev, nome: "" }));
                                }}
                                error={!!errors.nome}
                                helperText={errors.nome}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Sobrenome:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                value={sobrenome}
                                onChange={(e) => setSobrenome(e.target.value)}
                                disabled={loading}
                            />
                        </Box>
                    </Box>

                    {/* Segunda linha */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>CPF:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                value={cpfCnpj}
                                onChange={handleCpfChange}
                                placeholder="000.000.000-00"
                                error={!!errors.cpfCnpj}
                                helperText={errors.cpfCnpj}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Email:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                }}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading}
                            />
                        </Box>
                    </Box>

                    {/* Terceira linha */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Data de Nascimento:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => {
                                    setDataNascimento(e.target.value);
                                    if (errors.dataNascimento) setErrors(prev => ({ ...prev, dataNascimento: "" }));
                                }}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.dataNascimento}
                                helperText={errors.dataNascimento}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Senha:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                disabled={loading}
                            />
                        </Box>
                    </Box>

                    {/* Quarta linha */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Cargo:</Typography>
                            <TextField
                                select
                                fullWidth
                                margin="dense"
                                value={cargo}
                                onChange={(e) => setCargo(e.target.value)}
                                disabled={loading}
                            >
                                <MenuItem value="Vendedor">Vendedor</MenuItem>
                                <MenuItem value="Gerente">Gerente</MenuItem>
                                <MenuItem value="Farmacêutico">Farmacêutico</MenuItem>
                                <MenuItem value="Caixa">Caixa</MenuItem>
                            </TextField>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Salário:</Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="number"
                                value={salario}
                                onChange={(e) => {
                                    setSalario(e.target.value);
                                    if (errors.salario) setErrors(prev => ({ ...prev, salario: "" }));
                                }}
                                InputProps={{
                                    startAdornment: "R$ "
                                }}
                                error={!!errors.salario}
                                helperText={errors.salario}
                                disabled={loading}
                            />
                        </Box>
                    </Box>

                    {/* Quinta linha */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 300 }}>Filial:</Typography>
                            <TextField
                                select
                                fullWidth
                                margin="dense"
                                value={filial_id}
                                onChange={(e) => {
                                    setFilialId(e.target.value);
                                    if (errors.filial_id) setErrors(prev => ({ ...prev, filial_id: "" }));
                                }}
                                error={!!errors.filial_id}
                                helperText={errors.filial_id}
                                disabled={loading}
                            >
                                {filiais.map((filial) => (
                                    <MenuItem key={filial.id} value={filial.id}>
                                        {filial.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{ flex: 1 }}></Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button 
                        variant="contained" 
                        sx={{ px: 8, py: 1, background: "#0C58A3" }}
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                    >
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddFuncionarioModal;