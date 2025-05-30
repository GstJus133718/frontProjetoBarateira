import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Grid,
    InputAdornment,
    FormHelperText,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel
} from "@mui/material";

const AddPromotionArea = ({ open, handleClose, adicionarPromocao, produtos }) => {
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [desconto, setDesconto] = useState("");
    const [status, setStatus] = useState("Ativo");
    const [valorOriginal, setValorOriginal] = useState("");
    const [valorComDesconto, setValorComDesconto] = useState("");
    
    // Estados para validação
    const [produtoError, setProdutoError] = useState("");
    const [descontoError, setDescontoError] = useState("");

    // Atualizar valor original quando o produto for selecionado
    useEffect(() => {
        if (produtoSelecionado) {
            const produto = produtos.find(p => p.nome === produtoSelecionado);
            if (produto) {
                setValorOriginal(produto.preco);
                calcularValorComDesconto(produto.preco, desconto);
            }
        } else {
            setValorOriginal("");
            setValorComDesconto("");
        }
    }, [produtoSelecionado, produtos]);

    // Calcular valor com desconto quando o desconto mudar
    useEffect(() => {
        if (valorOriginal && desconto) {
            calcularValorComDesconto(valorOriginal, desconto);
        }
    }, [desconto, valorOriginal]);

    // Função para calcular o valor com desconto
    const calcularValorComDesconto = (preco, desconto) => {
        if (!preco || !desconto) {
            setValorComDesconto("");
            return;
        }
        
        const precoNumerico = parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.'));
        const descontoNumerico = parseFloat(desconto);
        
        if (isNaN(precoNumerico) || isNaN(descontoNumerico)) {
            setValorComDesconto("");
            return;
        }
        
        const valorDesconto = precoNumerico * (descontoNumerico / 100);
        const valorFinal = precoNumerico - valorDesconto;
        setValorComDesconto(`R$ ${valorFinal.toFixed(2).replace('.', ',')}`);
    };

    // Handler para mudança no campo desconto
    const handleDescontoChange = (e) => {
        const valor = e.target.value;
        
        // Permite apenas números de 0 a 100
        if (valor === '' || (/^\d+$/.test(valor) && parseInt(valor) <= 100)) {
            setDesconto(valor);
            if (valor === '') {
                setDescontoError("Desconto é obrigatório");
            } else {
                setDescontoError("");
            }
        }
    };

    // Validação do formulário
    const validarFormulario = () => {
        let isValid = true;
        
        // Validar produto
        if (!produtoSelecionado) {
            setProdutoError("Produto é obrigatório");
            isValid = false;
        } else {
            setProdutoError("");
        }
        
        // Validar desconto
        if (!desconto) {
            setDescontoError("Desconto é obrigatório");
            isValid = false;
        } else {
            setDescontoError("");
        }
        
        return isValid;
    };

    const handleSubmit = () => {
        // Validar formulário antes de enviar
        if (!validarFormulario()) {
            return;
        }
        
        // Criar objeto com os dados da nova promoção
        const novaPromocao = {
            produto: produtoSelecionado,
            desconto: desconto,
            status: status
        };

        // Chamar a função de adicionar promoção passada como prop
        adicionarPromocao(novaPromocao);
        
        // Limpar os campos
        resetForm();
    };

    const resetForm = () => {
        setProdutoSelecionado("");
        setDesconto("");
        setStatus("Ativo");
        setValorOriginal("");
        setValorComDesconto("");
        setProdutoError("");
        setDescontoError("");
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Adicionar Promoção</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl 
                                fullWidth 
                                error={!!produtoError} 
                                sx={{ 
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5"
                                    }
                                }}
                            >
                                <InputLabel>Produto *</InputLabel>
                                <Select
                                    value={produtoSelecionado}
                                    onChange={(e) => {
                                        setProdutoSelecionado(e.target.value);
                                        setProdutoError("");
                                    }}
                                    label="Produto *"
                                >
                                    {produtos.map((produto) => (
                                        <MenuItem key={produto.id} value={produto.nome}>
                                            {produto.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {produtoError && (
                                    <FormHelperText error>{produtoError}</FormHelperText>
                                )}
                            </FormControl>

                            <TextField
                                label="Valor Original"
                                fullWidth
                                value={valorOriginal}
                                disabled
                                sx={{ 
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#f5f5f5"
                                    }
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
                                <FormLabel component="legend">Status</FormLabel>
                                <RadioGroup
                                    row
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <FormControlLabel value="Ativo" control={<Radio />} label="Ativo" />
                                    <FormControlLabel value="Inativo" control={<Radio />} label="Inativo" />
                                </RadioGroup>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="% de Desconto *"
                                        fullWidth
                                        value={desconto}
                                        onChange={handleDescontoChange}
                                        error={!!descontoError}
                                        helperText={descontoError}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        sx={{ 
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f5f5f5"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Valor com Desconto"
                                        fullWidth
                                        value={valorComDesconto}
                                        disabled
                                        sx={{ 
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f5f5f5"
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={() => {
                        resetForm();
                        handleClose();
                    }}
                    variant="outlined"
                    sx={{ mr: 1 }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ 
                        backgroundColor: "#0C58A3",
                        maxWidth: "200px"
                    }}
                >
                    Adicionar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPromotionArea;
