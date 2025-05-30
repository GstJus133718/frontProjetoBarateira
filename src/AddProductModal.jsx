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
    FormHelperText // Para exibir erro no Select
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
    "Remédios",
    "Produtos Infantis",
    "Higiene",
    "Perfumaria",
    "Vitaminas",
    "Dermocosméticos",
    "Outros",
];

const carregarFiliais = () => {
    const savedFiliais = localStorage.getItem("filiais");
    if (savedFiliais) {
        try {
            const filiaisData = JSON.parse(savedFiliais);
            if (Array.isArray(filiaisData)) {
                if (filiaisData.length > 0 && typeof filiaisData[0] === 'object' && filiaisData[0].nome) {
                    return filiaisData.map(f => f.nome);
                } else if (filiaisData.length > 0 && typeof filiaisData[0] === 'string') {
                    return filiaisData;
                }
            }
        } catch (e) {
            console.error("Erro ao carregar filiais do localStorage:", e);
        }
    }
    return ["Norte", "Sul", "Leste", "Oeste"]; // Mock como fallback
};

const AddProductModal = ({ open, handleClose, adicionarProduto }) => {
    const [nome, setNome] = useState("");
    const [principioAtivo, setPrincipioAtivo] = useState("");
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [filial, setFilial] = useState("");
    const [promocao, setPromocao] = useState("Não");
    const [desconto, setDesconto] = useState("");
    const [preco, setPreco] = useState("");
    const [imagem, setImagem] = useState(null);
    const [nomeArquivo, setNomeArquivo] = useState("");

    const [nomeError, setNomeError] = useState("");
    const [principioAtivoError, setPrincipioAtivoError] = useState("");
    const [marcaError, setMarcaError] = useState("");
    const [categoriaError, setCategoriaError] = useState("");
    const [quantidadeError, setQuantidadeError] = useState("");
    const [filialError, setFilialError] = useState("");
    const [descontoError, setDescontoError] = useState("");
    const [precoError, setPrecoError] = useState("");

    const [filiaisDisponiveis, setFiliaisDisponiveis] = useState([]);

    useEffect(() => {
        if (open) { // Executa apenas quando o modal abre
            setFiliaisDisponiveis(carregarFiliais());
            // Resetar campos
            setNome("");
            setPrincipioAtivo("");
            setMarca("");
            setCategoria("");
            setQuantidade("");
            setFilial("");
            setPromocao("Não");
            setDesconto("");
            setPreco("");
            setImagem(null);
            setNomeArquivo("");
            // Resetar erros
            setNomeError("");
            setPrincipioAtivoError("");
            setMarcaError("");
            setCategoriaError("");
            setQuantidadeError("");
            setFilialError("");
            setDescontoError("");
            setPrecoError("");
        }
    }, [open]);

    const handleQuantidadeChange = (e) => {
        const valor = e.target.value;
        if (valor === '' || /^\d+$/.test(valor)) {
            setQuantidade(valor);
            setQuantidadeError(valor === '' ? "Quantidade é obrigatória" : "");
        }
    };

    const handleDescontoChange = (e) => {
        const valor = e.target.value;
        if (valor === '' || (/^\d+$/.test(valor) && parseInt(valor) >= 0 && parseInt(valor) <= 100)) {
            setDesconto(valor);
            setDescontoError(promocao === "Sim" && valor === '' ? "Desconto é obrigatório para produtos em promoção" : "");
        }
    };

    const handlePrecoChange = (e) => {
        const valor = e.target.value;
        const valorLimpo = valor.replace(/[^\d,.]/g, '');
        setPreco(valorLimpo);
        setPrecoError(valorLimpo === '' ? "Preço é obrigatório" : "");
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
        if (!nome.trim()) { setNomeError("Nome é obrigatório"); isValid = false; } else { setNomeError(""); }
        if (!principioAtivo.trim()) { setPrincipioAtivoError("Princípio ativo é obrigatório"); isValid = false; } else { setPrincipioAtivoError(""); }
        if (!marca.trim()) { setMarcaError("Marca é obrigatória"); isValid = false; } else { setMarcaError(""); }
        if (!categoria) { setCategoriaError("Categoria é obrigatória"); isValid = false; } else { setCategoriaError(""); }
        if (!quantidade) { setQuantidadeError("Quantidade é obrigatória"); isValid = false; } else { setQuantidadeError(""); }
        if (!filial) { setFilialError("Filial é obrigatória"); isValid = false; } else { setFilialError(""); }
        if (promocao === "Sim" && (!desconto || parseInt(desconto) <= 0)) { setDescontoError("Desconto deve ser maior que 0 para produtos em promoção"); isValid = false; } else { setDescontoError(""); }
        if (!preco) { setPrecoError("Preço é obrigatório"); isValid = false; } else { setPrecoError(""); }
        return isValid;
    };

    const handleSubmit = () => {
        if (!validarFormulario()) return;

        const precoNumerico = parseFloat(preco.replace(",", "."));
        const precoFormatado = `R$${precoNumerico.toFixed(2)}`.replace(".", ",");

        const novoProduto = {
            nome: nome,
            principioAtivo: principioAtivo,
            marca: marca,
            categoria: categoria,
            quantidade: parseInt(quantidade),
            filial: filial,
            promocao: promocao === "Sim",
            desconto: parseInt(desconto || "0"),
            preco: precoFormatado,
            imagem: nomeArquivo
        };
        adicionarProduto(novoProduto);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Grid container spacing={2}>
                    {/* Nome */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Nome:</Typography>
                        <TextField placeholder="Nome" fullWidth size="small" value={nome} onChange={(e) => { setNome(e.target.value); if (e.target.value.trim()) setNomeError(""); }} error={!!nomeError} helperText={nomeError} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    {/* Princípio Ativo */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Princípio Ativo:</Typography>
                        <TextField placeholder="Princípio Ativo" fullWidth size="small" value={principioAtivo} onChange={(e) => { setPrincipioAtivo(e.target.value); if (e.target.value.trim()) setPrincipioAtivoError(""); }} error={!!principioAtivoError} helperText={principioAtivoError} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    {/* Marca */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Marca:</Typography>
                        <TextField placeholder="Marca" fullWidth size="small" value={marca} onChange={(e) => { setMarca(e.target.value); if (e.target.value.trim()) setMarcaError(""); }} error={!!marcaError} helperText={marcaError} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    {/* Categoria (Select) */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Categoria:</Typography>
                        {/* --- AJUSTE LAYOUT SELECT --- */}
                        <FormControl fullWidth size="small" error={!!categoriaError} sx={{ bgcolor: "#f5f5f5", borderRadius: 1, "& .MuiInputBase-root": { height: 40 } }}>
                            <InputLabel id="categoria-add-select-label">Categoria</InputLabel>
                            <Select
                                labelId="categoria-add-select-label"
                                id="categoria-add-select"
                                value={categoria}
                                label="Categoria"
                                onChange={(e) => {
                                    setCategoria(e.target.value);
                                    if (e.target.value) setCategoriaError("");
                                }}
                                // Garante que o Select interno ocupe a altura correta
                                sx={{ height: '100%' }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Selecione uma categoria</em>
                                </MenuItem>
                                {categoriasDisponiveis.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                            {categoriaError && <FormHelperText sx={{ pl: 2, mt: 0.5, position: 'absolute', bottom: -20 }}>{categoriaError}</FormHelperText>}
                        </FormControl>
                        {/* --- FIM AJUSTE --- */}
                    </Grid>
                    {/* Quantidade */}
                    <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Quantidade:</Typography>
                        <TextField placeholder="Qtd" fullWidth size="small" value={quantidade} onChange={handleQuantidadeChange} error={!!quantidadeError} helperText={quantidadeError} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    
                    {/* Filial (Select) */}
                    <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Filial:</Typography>
                        {/* --- AJUSTE LAYOUT SELECT --- */}
                        <FormControl fullWidth size="small" error={!!filialError} sx={{ bgcolor: "#f5f5f5", borderRadius: 1, "& .MuiInputBase-root": { height: 40 } }}>
                            <InputLabel id="filial-add-select-label">Filial</InputLabel>
                            <Select
                                labelId="filial-add-select-label"
                                id="filial-add-select"
                                value={filial}
                                label="Filial"
                                onChange={(e) => {
                                    setFilial(e.target.value);
                                    if (e.target.value) setFilialError("");
                                }}
                                sx={{ height: '100%' }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Selecione a filial</em>
                                </MenuItem>
                                {filiaisDisponiveis.map((f) => (
                                    <MenuItem key={f} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                            {filialError && <FormHelperText sx={{ pl: 2, mt: 0.5, position: 'absolute', bottom: -20 }}>{filialError}</FormHelperText>}
                        </FormControl>
                        {/* --- FIM AJUSTE --- */}
                    </Grid>
                    
                    {/* Promoção */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Promoção:</Typography>
                        <RadioGroup row value={promocao} onChange={(e) => { setPromocao(e.target.value); if (e.target.value !== "Sim") setDesconto("0"); }}>
                            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
                            <FormControlLabel value="Não" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </Grid>
                    {/* Desconto */}
                    <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Desconto:</Typography>
                        <TextField placeholder="%" fullWidth size="small" value={desconto} onChange={handleDescontoChange} disabled={promocao !== "Sim"} error={!!descontoError} helperText={descontoError} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    {/* Valor */}
                    <Grid item xs={6} sm={3}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Valor:</Typography>
                        <TextField placeholder="0,00" fullWidth size="small" value={preco} onChange={handlePrecoChange} error={!!precoError} helperText={precoError} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                    </Grid>
                    {/* Upload */}
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <TextField placeholder="Anexar arquivos" fullWidth size="small" value={nomeArquivo} disabled sx={{ bgcolor: "#f5f5f5", "& .MuiOutlinedInput-root": { borderRadius: 1 }, mr: 1 }} />
                            <Button variant="contained" component="label" sx={{ bgcolor: "#333", color: "white", "&:hover": { bgcolor: "#555" }, height: 40, borderRadius: 1 }}>
                                Upload
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button variant="contained" sx={{ px: 8, py: 1, background: "#0C58A3", borderRadius: 1, width: "100%", maxWidth: 400 }} onClick={handleSubmit}>
                        Adicionar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddProductModal;

