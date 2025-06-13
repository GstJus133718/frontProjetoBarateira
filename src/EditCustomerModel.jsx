import React, { useState, useEffect } from "react";
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

const EditCustomerModal = ({ open, handleClose, cliente, atualizarCliente, loading = false }) => {
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [errors, setErrors] = useState({});

    // Efeito para popular os campos quando o cliente ou o estado open mudar
    useEffect(() => {
        console.log('useEffect - Cliente recebido:', cliente); // Debug
        console.log('useEffect - Modal open:', open); // Debug
        
        if (cliente && open) {
            console.log('Populando campos com dados do cliente:', cliente); // Debug
            
            // Preencher campos com os dados do cliente
            setNome(cliente.nome || "");
            setSobrenome(cliente.sobrenome || "");
            
            // Tentar diferentes propriedades para CPF
            const cpfValue = cliente.cpfCnpj || cliente.cpf || "";
            setCpfCnpj(cpfValue);
            
            setEmail(cliente.email || "");
            
            // Tentar diferentes propriedades para data
            let dataFormatada = "";
            if (cliente.dataNascimento) {
                dataFormatada = cliente.dataNascimento;
            } else if (cliente.data_nasc) {
                try {
                    // Se a data vem no formato ISO, converter para YYYY-MM-DD
                    const dataObj = new Date(cliente.data_nasc);
                    if (!isNaN(dataObj.getTime())) {
                        dataFormatada = dataObj.toISOString().split('T')[0];
                    }
                } catch (e) {
                    console.error('Erro ao formatar data:', e);
                    dataFormatada = "";
                }
            }
            setDataNascimento(dataFormatada);
            
            // Limpar erros quando um novo cliente for carregado
            setErrors({});
            
            console.log('Campos populados:', {
                nome: cliente.nome,
                sobrenome: cliente.sobrenome,
                cpfCnpj: cpfValue,
                email: cliente.email,
                dataNascimento: dataFormatada
            }); // Debug
        }
    }, [cliente, open]);

    // Efeito para limpar campos quando o modal fechar
    useEffect(() => {
        if (!open) {
            setNome("");
            setSobrenome("");
            setCpfCnpj("");
            setEmail("");
            setDataNascimento("");
            setErrors({});
        }
    }, [open]);

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

        if (!dataNascimento) {
            newErrors.dataNascimento = "Data de nascimento é obrigatória";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const clienteAtualizado = {
            ...cliente,
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            cpfCnpj: cpfCnpj.trim(),
            email: email.trim(),
            dataNascimento
        };

        console.log('Cliente enviado para atualização:', clienteAtualizado); // Debug
        atualizarCliente(clienteAtualizado);
    };

    const handleCloseModal = () => {
        if (!loading) {
            handleClose();
        }
    };

    // Se não há cliente selecionado, não renderizar o modal
    if (!cliente) {
        return null;
    }

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" component="h2">
                        Editar Cliente
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
                            onChange={(e) => {
                                setNome(e.target.value);
                                if (e.target.value.trim() && errors.nome) {
                                    setErrors(prev => ({ ...prev, nome: "" }));
                                }
                            }}
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
                        onChange={(e) => {
                            setCpfCnpj(e.target.value);
                            if (e.target.value.trim() && errors.cpfCnpj) {
                                setErrors(prev => ({ ...prev, cpfCnpj: "" }));
                            }
                        }}
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
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (e.target.value.trim() && errors.email) {
                                setErrors(prev => ({ ...prev, email: "" }));
                            }
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Data de Nascimento *"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => {
                            setDataNascimento(e.target.value);
                            if (e.target.value && errors.dataNascimento) {
                                setErrors(prev => ({ ...prev, dataNascimento: "" }));
                            }
                        }}
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
                            {loading ? <CircularProgress size={24} /> : 'Salvar'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditCustomerModal;