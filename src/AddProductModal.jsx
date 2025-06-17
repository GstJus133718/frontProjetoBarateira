import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    InputAdornment,
    Grid,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { produtoService } from './services/produtoService';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
};

const categoriasDisponiveis = [
    "analgesicos",
    "produtos-infantis",
    "higiene",
    "perfumaria",
    "vitaminas",
    "dermocosmticos",
    "outros"
];

const AddProductModal = ({ open, handleClose, adicionarProduto }) => {
    const [nome, setNome] = useState("");
    const [principioAtivo, setPrincipioAtivo] = useState("");
    const [marca, setMarca] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [precoUnitario, setPrecoUnitario] = useState("");
    const [emPromocao, setEmPromocao] = useState("Não");
    const [desconto, setDesconto] = useState("");
    const [generico, setGenerico] = useState("Não");
    const [imagem, setImagem] = useState(null);
    const [nomeArquivo, setNomeArquivo] = useState("");

    // Estados de erro
    const [nomeError, setNomeError] = useState("");
    const [principioAtivoError, setPrincipioAtivoError] = useState("");
    const [marcaError, setMarcaError] = useState("");
    const [departamentoError, setDepartamentoError] = useState("");
    const [precoUnitarioError, setPrecoUnitarioError] = useState("");
    const [descontoError, setDescontoError] = useState("");

    // Estado de loading
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    const resetForm = () => {
        setNome("");
        setPrincipioAtivo("");
        setMarca("");
        setDepartamento("");
        setPrecoUnitario("");
        setEmPromocao("Não");
        setDesconto("");
        setGenerico("Não");
        setImagem(null);
        setNomeArquivo("");
        
        // Resetar erros
        setNomeError("");
        setPrincipioAtivoError("");
        setMarcaError("");
        setDepartamentoError("");
        setPrecoUnitarioError("");
        setDescontoError("");
    };

    const handlePrecoChange = (e) => {
        const valor = e.target.value;
        // Permitir apenas números e ponto/vírgula
        const valorLimpo = valor.replace(/[^\d,.]/g, '');
        setPrecoUnitario(valorLimpo);
        setPrecoUnitarioError(valorLimpo === '' ? "Preço é obrigatório" : "");
    };

    const handleDescontoChange = (e) => {
        const valor = e.target.value;
        // Permitir apenas números e ponto/vírgula para desconto
        const valorLimpo = valor.replace(/[^\d,.]/g, '');
        if (valorLimpo === '' || (parseFloat(valorLimpo.replace(',', '.')) >= 0 && parseFloat(valorLimpo.replace(',', '.')) <= 100)) {
            setDesconto(valorLimpo);
            setDescontoError(emPromocao === "Sim" && valorLimpo === '' ? "Desconto é obrigatório para produtos em promoção" : "");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagem(file);
            setNomeArquivo(file.name);
        }
    };

    const validarFormulario = () => {
        let isValid = true;
        
        if (!nome.trim()) { 
            setNomeError("Nome é obrigatório"); 
            isValid = false; 
        } else { 
            setNomeError(""); 
        }
        
        if (!principioAtivo.trim()) { 
            setPrincipioAtivoError("Princípio ativo é obrigatório"); 
            isValid = false; 
        } else { 
            setPrincipioAtivoError(""); 
        }
        
        if (!marca.trim()) { 
            setMarcaError("Marca é obrigatória"); 
            isValid = false; 
        } else { 
            setMarcaError(""); 
        }
        
        if (!departamento) { 
            setDepartamentoError("Departamento é obrigatório"); 
            isValid = false; 
        } else { 
            setDepartamentoError(""); 
        }
        
        if (!precoUnitario) { 
            setPrecoUnitarioError("Preço é obrigatório"); 
            isValid = false; 
        } else { 
            setPrecoUnitarioError(""); 
        }
        
        if (emPromocao === "Sim" && (!desconto || parseFloat(desconto.replace(',', '.')) <= 0)) { 
            setDescontoError("Desconto deve ser maior que 0 para produtos em promoção"); 
            isValid = false; 
        } else { 
            setDescontoError(""); 
        }
        
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validarFormulario()) return;

        try {
            setLoading(true);

            // Converter valores para o formato da API
            const precoNumerico = parseFloat(precoUnitario.replace(',', '.'));
            const descontoNumerico = desconto ? parseFloat(desconto.replace(',', '.')) : 0;

            // Dados no formato da API
            const dadosProduto = {
                nome: nome.trim(),
                principio_ativo: principioAtivo.trim(),
                departamento: departamento,
                marca: marca.trim(),
                preco_unitario: precoNumerico,
                em_promocao: emPromocao === "Sim",
                desconto: descontoNumerico,
                generico: generico === "Sim"
            };

            console.log('Enviando produto para API:', dadosProduto);

            // Chamar API
            const produtoCriado = await produtoService.criar(dadosProduto);
            
            console.log('Produto criado com sucesso:', produtoCriado);

            // Chamar callback do componente pai
            if (adicionarProduto) {
                adicionarProduto(produtoCriado);
            }

            // Fechar modal
            handleClose();
            
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            
            // Tratar erros específicos da API
            if (error.response?.data?.message) {
                alert(`Erro: ${error.response.data.message}`);
            } else if (error.response?.data?.detail) {
                alert(`Erro: ${error.response.data.detail}`);
            } else {
                alert('Erro ao criar produto. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
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
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={handleCloseModal} size="small" disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                    Adicionar Produto
                </Typography>

                <Grid container spacing={2}>
                    {/* Nome */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Nome:</Typography>
                        <TextField 
                            placeholder="Nome do produto" 
                            fullWidth 
                            size="small" 
                            value={nome} 
                            onChange={(e) => { 
                                setNome(e.target.value); 
                                if (e.target.value.trim()) setNomeError(""); 
                            }} 
                            error={!!nomeError} 
                            helperText={nomeError} 
                            disabled={loading}
                            sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} 
                        />
                    </Grid>

                    {/* Princípio Ativo */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Princípio Ativo:</Typography>
                        <TextField 
                            placeholder="Princípio ativo" 
                            fullWidth 
                            size="small" 
                            value={principioAtivo} 
                            onChange={(e) => { 
                                setPrincipioAtivo(e.target.value); 
                                if (e.target.value.trim()) setPrincipioAtivoError(""); 
                            }} 
                            error={!!principioAtivoError} 
                            helperText={principioAtivoError} 
                            disabled={loading}
                            sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} 
                        />
                    </Grid>

                    {/* Marca */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Marca:</Typography>
                        <TextField 
                            placeholder="Marca do produto" 
                            fullWidth 
                            size="small" 
                            value={marca} 
                            onChange={(e) => { 
                                setMarca(e.target.value); 
                                if (e.target.value.trim()) setMarcaError(""); 
                            }} 
                            error={!!marcaError} 
                            helperText={marcaError} 
                            disabled={loading}
                            sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} 
                        />
                    </Grid>

                    {/* Departamento */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Departamento:</Typography>
                        <FormControl 
                            fullWidth 
                            size="small" 
                            error={!!departamentoError} 
                            disabled={loading}
                            sx={{ bgcolor: "#f5f5f5", borderRadius: 1, "& .MuiInputBase-root": { height: 40 } }}
                        >
                            <InputLabel id="departamento-add-select-label">Departamento</InputLabel>
                            <Select
                                labelId="departamento-add-select-label"
                                value={departamento}
                                label="Departamento"
                                onChange={(e) => {
                                    setDepartamento(e.target.value);
                                    if (e.target.value) setDepartamentoError("");
                                }}
                                sx={{ height: '100%' }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Selecione um departamento</em>
                                </MenuItem>
                                {categoriasDisponiveis.map((dep) => (
                                    <MenuItem key={dep} value={dep}>
                                        {dep.charAt(0).toUpperCase() + dep.slice(1).replace('-', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                            {departamentoError && (
                                <FormHelperText sx={{ pl: 2, mt: 0.5, position: 'absolute', bottom: -20 }}>
                                    {departamentoError}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Preço Unitário */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Preço Unitário:</Typography>
                        <TextField 
                            placeholder="0,00" 
                            fullWidth 
                            size="small" 
                            value={precoUnitario} 
                            onChange={handlePrecoChange} 
                            error={!!precoUnitarioError} 
                            helperText={precoUnitarioError} 
                            disabled={loading}
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start">R$</InputAdornment> 
                            }} 
                            sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} 
                        />
                    </Grid>

                    {/* Genérico */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Genérico:</Typography>
                        <RadioGroup 
                            row 
                            value={generico} 
                            onChange={(e) => setGenerico(e.target.value)}
                            disabled={loading}
                        >
                            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                            <FormControlLabel value="Não" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </Grid>
                    
                    {/* Em Promoção */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Em Promoção:</Typography>
                        <RadioGroup 
                            row 
                            value={emPromocao} 
                            onChange={(e) => { 
                                setEmPromocao(e.target.value); 
                                if (e.target.value !== "Sim") setDesconto(""); 
                            }}
                            disabled={loading}
                        >
                            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                            <FormControlLabel value="Não" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </Grid>

                    {/* Desconto */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Desconto:</Typography>
                        <TextField 
                            placeholder="0,0" 
                            fullWidth 
                            size="small" 
                            value={desconto} 
                            onChange={handleDescontoChange} 
                            disabled={emPromocao !== "Sim" || loading} 
                            error={!!descontoError} 
                            helperText={descontoError} 
                            InputProps={{ 
                                endAdornment: <InputAdornment position="end">%</InputAdornment> 
                            }} 
                            sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} 
                        />
                    </Grid>

                    {/* Upload */}
                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Imagem:</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <TextField 
                                placeholder="Anexar arquivo de imagem" 
                                fullWidth 
                                size="small" 
                                value={nomeArquivo} 
                                disabled 
                                sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 }, mr: 1 }} 
                            />
                            <Button 
                                variant="contained" 
                                component="label" 
                                disabled={loading}
                                sx={{ 
                                    bgcolor: "#333", 
                                    color: "white", 
                                    "&:hover": { bgcolor: "#555" }, 
                                    height: 40, 
                                    borderRadius: 1 
                                }}
                            >
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : null}
                        sx={{ 
                            px: 8, 
                            py: 1, 
                            background: "#0C58A3", 
                            borderRadius: 1, 
                            width: "100%", 
                            maxWidth: 400 
                        }}
                    >
                        {loading ? "Adicionando..." : "Adicionar"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddProductModal;