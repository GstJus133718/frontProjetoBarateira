import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    TextField,
    Avatar,
    Divider,
    Paper,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

// Dados mockados (serão carregados do localStorage)
const produtosEstoqueMock = [];
const clientesMock = [];
const promocoesMock = [];

// Função para formatar valores monetários
const formatarMoeda = (valor) => {
    if (typeof valor !== 'number' || isNaN(valor)) {
        return "R$ 0,00";
    }
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

// Função para converter string de preço para número
const precoParaNumero = (precoStr) => {
    if (typeof precoStr === 'number' && !isNaN(precoStr)) {
        return precoStr;
    }
    if (typeof precoStr !== 'string') {
        return 0;
    }

    const valorLimpo = precoStr.replace(/[^\d,.-]/g, "").replace(",", ".");
    const partes = valorLimpo.split('.');
    let valorFormatado = valorLimpo;
    if (partes.length > 2) {
        valorFormatado = partes.slice(0, -1).join('') + '.' + partes.slice(-1);
    }
    const valorNum = parseFloat(valorFormatado);
    return isNaN(valorNum) ? 0 : valorNum;
};

const obterPrecoFinalProduto = (produto) => {
    if (produto.valor_real !== undefined && produto.valor_real !== null) {
        return produto.valor_real;
    }
    return precoParaNumero(produto.preco || 0);
};

// ✅ NOVO: Função para obter preço original do produto
const obterPrecoOriginalProduto = (produto) => {
    // Se tem preco_unitario, usar ele como preço original
    if (produto.preco_unitario !== undefined && produto.preco_unitario !== null) {
        return produto.preco_unitario;
    }
    
    // Fallback para o sistema antigo
    return precoParaNumero(produto.preco || 0);
};

// <<< NOVA FUNÇÃO: Calcular preço com desconto de forma segura
const calcularPrecoComDescontoSeguro = (precoOriginal, promocao) => {
    if (!promocao || typeof promocao !== 'object') {
        return precoOriginal; // Sem promoção, retorna preço original
    }

    let precoComDesconto = precoOriginal;

    // 1. Tenta usar valorComDesconto se for válido
    if (promocao.valorComDesconto) {
        const valorComDescontoNum = precoParaNumero(promocao.valorComDesconto);
        // Verifica se é um número válido, maior que zero e menor que o original
        if (valorComDescontoNum > 0 && valorComDescontoNum < precoOriginal) {
            precoComDesconto = valorComDescontoNum;
            return precoComDesconto; // Retorna o valor com desconto válido
        }
    }

    // 2. Se valorComDesconto falhar, tenta calcular pelo percentual
    if (promocao.descontoPromocao && typeof promocao.descontoPromocao === 'string') {
        const percentualMatch = promocao.descontoPromocao.match(/(\d+)/);
        if (percentualMatch) {
            const percentual = parseFloat(percentualMatch[1]);
            if (percentual > 0 && percentual < 100) {
                const descontoValor = precoOriginal * (percentual / 100);
                const precoCalculado = precoOriginal - descontoValor;
                // Verifica se o preço calculado é válido
                if (precoCalculado > 0 && precoCalculado < precoOriginal) {
                    precoComDesconto = precoCalculado;
                    return precoComDesconto; // Retorna o preço calculado válido
                }
            }
        }
    }

    // 3. Se nada funcionar, retorna o preço original (sem desconto)
    return precoOriginal;
};

const Cart = () => {
    // Carregar dados do localStorage
    const getInitialData = (key, mockData = []) => {
        try {
            const savedData = localStorage.getItem(key);
            const parsedData = savedData ? JSON.parse(savedData) : mockData;
            return Array.isArray(parsedData) ? parsedData : mockData;
        } catch (error) {
            console.error(`Erro ao carregar ${key} do localStorage:`, error);
            return mockData;
        }
    };

    const [carrinho, setCarrinho] = useState(() => getInitialData("carrinho", []));
    const [produtosEstoque, setProdutosEstoque] = useState(() => getInitialData("produtos", produtosEstoqueMock));
    const [clientes, setClientes] = useState(() => getInitialData("clientes", clientesMock));
    const [promocoes, setPromocoes] = useState(() => getInitialData("promocoes", promocoesMock));
    const [busca, setBusca] = useState("");
    const [buscaCliente, setBuscaCliente] = useState("");
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [frete, setFrete] = useState("");
    const [valorFrete, setValorFrete] = useState(0);
    const [freteCalculado, setFreteCalculado] = useState(false);
    const navigate = useNavigate();
    const [promocoesAtivasMap, setPromocoesAtivasMap] = useState(new Map());

    // Salvar carrinho no localStorage
    useEffect(() => {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }, [carrinho]);

    // Listener para atualizações de storage
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "produtos") setProdutosEstoque(getInitialData("produtos", produtosEstoqueMock));
            if (event.key === "clientes") setClientes(getInitialData("clientes", clientesMock));
            if (event.key === "promocoes") setPromocoes(getInitialData("promocoes", promocoesMock));
        };
        window.addEventListener("storage", handleStorageChange);
        setProdutosEstoque(getInitialData("produtos", produtosEstoqueMock));
        setClientes(getInitialData("clientes", clientesMock));
        setPromocoes(getInitialData("promocoes", promocoesMock));
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Cria mapa de promoções ativas
    useEffect(() => {
        const promocoesAtivas = promocoes.filter(p => p.status === "Ativo");
        const map = new Map();
        promocoesAtivas.forEach(promo => {
            if (promo.id != null) map.set(String(promo.id), promo);
        });
        setPromocoesAtivasMap(map);
    }, [promocoes]);

    const handleLogout = () => navigate("/admin");

    const aumentarQuantidade = (id) => {
        const itemIdStr = String(id);
        setCarrinho(carrinho.map(item => String(item.id) === itemIdStr ? { ...item, quantidade: item.quantidade + 1 } : item));
    };

    const diminuirQuantidade = (id) => {
        const itemIdStr = String(id);
        setCarrinho(carrinho.map(item => String(item.id) === itemIdStr && item.quantidade > 1 ? { ...item, quantidade: item.quantidade - 1 } : item));
    };

    const removerProduto = (id) => {
        const itemIdStr = String(id);
        setCarrinho(carrinho.filter(item => String(item.id) !== itemIdStr));
    };

    const buscarProdutos = () => {
        if (!busca.trim()) return [];
        const termoLower = busca.toLowerCase();
        return produtosEstoque.filter(p =>
            p.nome?.toLowerCase().includes(termoLower) ||
            p.descricao?.toLowerCase().includes(termoLower) ||
            p.marca?.toLowerCase().includes(termoLower) ||
            p.principioAtivo?.toLowerCase().includes(termoLower)
        );
    };

    const buscarClientes = () => {
        if (!buscaCliente.trim()) return [];
        const termoLower = buscaCliente.toLowerCase();
        const termoNumerico = buscaCliente.replace(/\D/g, "");
        return clientes.filter(c =>
            c.nome?.toLowerCase().includes(termoLower) ||
            (c.cpf && c.cpf.replace(/\D/g, "").includes(termoNumerico))
        );
    };

    const selecionarCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setBuscaCliente("");
    };

    const removerClienteSelecionado = () => setClienteSelecionado(null);

    const adicionarAoCarrinho = (produto) => {
        const produtoIdStr = String(produto.id);
        const produtoExistente = carrinho.find(item => String(item.id) === produtoIdStr);

        if (produtoExistente) {
            aumentarQuantidade(produto.id);
        } else {
            const produtoDoEstoque = produtosEstoque.find(p => String(p.id) === produtoIdStr);
            if (produtoDoEstoque) {
                setCarrinho([...carrinho, { ...produtoDoEstoque, id: produtoIdStr, quantidade: 1 }]);
            } else {
                console.error("Produto não encontrado no estoque:", produto.id);
                setCarrinho([...carrinho, { ...produto, id: produtoIdStr, quantidade: 1, preco: produto.preco || "R$ 0,00" }]);
            }
        }
        setBusca("");
    };

    const calcularFrete = () => {
        if (!frete.trim()) return;
        const valorCalculado = Math.random() * 20 + 10;
        setValorFrete(valorCalculado);
        setFreteCalculado(true);
    };

    const removerFrete = () => {
        setValorFrete(0);
        setFreteCalculado(false);
        setFrete("");
    };

    // --- CORREÇÃO: Funções de Cálculo com Desconto Seguro ---
    const calcularValoresCarrinho = () => {
        let subtotalOriginal = 0;
        let totalDesconto = 0;

        carrinho.forEach(item => {
            const precoOriginalItem = obterPrecoOriginalProduto(item);
            const precoFinalItem = obterPrecoFinalProduto(item);
            const quantidade = item.quantidade;
            
            subtotalOriginal += precoOriginalItem * quantidade;
            
            // Se tem economia/desconto, calcular
            if (precoFinalItem < precoOriginalItem) {
                const descontoPorItem = precoOriginalItem - precoFinalItem;
                totalDesconto += descontoPorItem * quantidade;
            }
        });

        const subtotalComDesconto = subtotalOriginal - totalDesconto;
        const totalFinal = subtotalComDesconto + valorFrete;

        return {
            subtotalOriginal,
            totalDesconto,
            subtotalComDesconto,
            totalFinal
        };
    };

    const { subtotalOriginal, totalDesconto, subtotalComDesconto, totalFinal } = calcularValoresCarrinho();
    // --- FIM CORREÇÃO ---

    const handleFinalizarCompra = () => {
        if (carrinho.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }
        if (!clienteSelecionado) {
            alert("Por favor, vincule um cliente à venda.");
            return;
        }

        const valorTotalVenda = totalFinal;
        const comissaoCalculada = valorTotalVenda * 0.10;
        const vendedorAtual = "Vendedor 01";
        const filialAtual = "Norte";

        const historicoVendas = getInitialData("historicoVendas", []);
        const novoIdVenda = (historicoVendas.length + 1).toString().padStart(2, "0");
        const ultimaNf = Math.max(0, ...historicoVendas.map(v => parseInt(v.nf || 0)));
        const novaNf = (ultimaNf + 1).toString().padStart(5, "0");

        const novaVenda = {
            id: novoIdVenda,
            cliente: clienteSelecionado.nome,
            vendedor: vendedorAtual,
            filial: filialAtual,
            valor: formatarMoeda(valorTotalVenda),
            comissao: formatarMoeda(comissaoCalculada),
            nf: novaNf,
        };

        const novoHistorico = [...historicoVendas, novaVenda];
        localStorage.setItem("historicoVendas", JSON.stringify(novoHistorico));

        setCarrinho([]);
        setClienteSelecionado(null);
        removerFrete();

        alert(`Venda #${novoIdVenda} finalizada com sucesso! NF: ${novaNf}`);
    };

    const produtosFiltrados = buscarProdutos();
    const clientesFiltrados = buscarClientes();

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Navbar */}
            <Box
                sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 24px", borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#fff", boxShadow: 1,
                }}
            >
                <Avatar
                    src="../public/logo/logo_3.png"
                    alt="A Barateira"
                    variant="square"
                    sx={{ width: 200, height: 115, objectFit: "contain" }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "#666", mr: 1 }} />
                    <Box sx={{ color: "text.secondary", mr: 3 }}>
                        <Typography variant="body2" sx={{ m: 0 }}>Olá,</Typography>
                        <Typography variant="body2" sx={{ m: 0, fontWeight: "bold" }}>Vendedor</Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{ borderRadius: 20, borderColor: "#e0e0e0", color: "#666", px: 4, py: 1 }}
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </Box>
            </Box>

            <Box sx={{ p: 3, width: "100vw" }}>
                <Grid container spacing={3} sx={{display: "flex", justifyContent: "center"}}>
                    {/* Coluna Esquerda: Busca e Carrinho */}
                    <Grid item xs={12} md={7}sx={{width: "70%"}}>
                        {/* Busca de Produtos */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                            <TextField
                                placeholder="Buscar produto por nome, marca, descrição ou princípio ativo"
                                variant="outlined"
                                fullWidth
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                sx={{
                                    backgroundColor: "#EBEBEB", borderRadius: "5px",
                                    "& fieldset": { border: "none" }, maxWidth: "calc(100% - 120px)"
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                             <Button
                                variant="outlined"
                                sx={{ ml: 2, borderRadius: 2, px: 4, height: "56px" }}
                                onClick={() => navigate("/area-admin")}
                            >
                                Voltar
                            </Button>
                        </Box>

                        {/* Resultados da busca de produtos */}
                        {busca.trim() && (
                            <Paper sx={{ p: 2, mb: 3, maxHeight: 300, overflowY: "auto" }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>Resultados da busca</Typography>
                                {produtosFiltrados.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {produtosFiltrados.map((produto) => (
                                            <Grid item xs={12} sm={6} key={produto.id}>
                                                <Card sx={{ display: "flex", height: "100%" }}>
                                                    <CardMedia
                                                        component="img"
                                                        sx={{ width: 80, height: 80, objectFit: "contain", alignSelf: "center", p: 1 }}
                                                        image={produto.imagem || produto.imagens?.[0] || "/icons/product_icon.svg"}
                                                        alt={produto.nome}
                                                        onError={(e) => e.target.src = "/icons/product_icon.svg"}
                                                    />
                                                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 1, "&:last-child": { pb: 1 } }}>
                                                        <Typography variant="body1" component="div" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{produto.nome}</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{produto.preco}</Typography>
                                                        <Button
                                                            variant="contained" size="small"
                                                            sx={{ mt: "auto", alignSelf: "flex-start", background: "#0C58A3", fontSize: "0.75rem", p: "2px 8px" }}
                                                            onClick={() => adicionarAoCarrinho(produto)}
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">Nenhum produto encontrado.</Typography>
                                )}
                            </Paper>
                        )}

                        {/* Lista de Produtos no Carrinho */}
                        <Typography variant="h6" sx={{ mb: 2 }}>Carrinho</Typography>
                        <Paper sx={{ p: 2 }}>
                            {carrinho.length === 0 ? (
                                <Typography variant="body1" color="text.secondary">O carrinho está vazio.</Typography>
                            ) : (
                                <List>
                                     {carrinho.map((item) => {
                                        const precoOriginalUnitario = obterPrecoOriginalProduto(item);
                                        const precoFinalUnitario = obterPrecoFinalProduto(item);
                                        const temDesconto = precoFinalUnitario < precoOriginalUnitario;
                                        let descontoPercentual = 0;
                                        
                                        if (temDesconto && precoOriginalUnitario > 0) {
                                            descontoPercentual = Math.round(((precoOriginalUnitario - precoFinalUnitario) / precoOriginalUnitario) * 100);
                                        }

                                        return (
                                            <ListItem
                                                key={item.id}
                                                divider
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete" onClick={() => removerProduto(item.id)}>
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                }
                                                sx={{ alignItems: "flex-start" }}
                                            >
                                                <ListItemAvatar sx={{ mr: 1, mt: 1 }}>
                                                    <Avatar
                                                        variant="square"
                                                        src={item.imagem || item.imagens?.[0] || "/icons/product_icon.svg"}
                                                        alt={item.nome}
                                                        sx={{ width: 60, height: 60, objectFit: "contain" }}
                                                        imgProps={{ onError: (e) => e.target.src = "/icons/product_icon.svg" }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.nome}
                                                    secondary={
                                                        <React.Fragment>
                                                            {/* ✅ NOVO: Exibição de Preço com nova estrutura */}
                                                            {temDesconto ? (
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                                                                    <Typography sx={{ textDecoration: "line-through" }} component="span" variant="body2" color="text.secondary">
                                                                        {formatarMoeda(precoOriginalUnitario)}
                                                                    </Typography>
                                                                    <Typography sx={{ fontWeight: "bold" }} component="span" variant="body2" color="error">
                                                                        {formatarMoeda(precoFinalUnitario)}
                                                                    </Typography>
                                                                    {descontoPercentual > 0 && (
                                                                        <Chip label={`-${descontoPercentual}%`} color="error" size="small" sx={{ height: "18px", fontSize: "0.7rem" }} />
                                                                    )}
                                                                </Box>
                                                            ) : (
                                                                <Typography component="span" variant="body2" color="text.primary" sx={{ mb: 0.5, display: "block" }}>
                                                                    {formatarMoeda(precoFinalUnitario)}
                                                                </Typography>
                                                            )}
                                                            
                                                            {/* ✅ NOVO: Mostrar economia total se houver */}
                                                            {temDesconto && item.economia && (
                                                                <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                                    Economia: R$ {(item.economia * item.quantidade).toFixed(2).replace('.', ',')}
                                                                </Typography>
                                                            )}
                                                            
                                                            {/* Controle de Quantidade */}
                                                            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                                                <IconButton size="small" onClick={() => diminuirQuantidade(item.id)} disabled={item.quantidade <= 1}>
                                                                    <RemoveIcon fontSize="inherit" />
                                                                </IconButton>
                                                                <Typography sx={{ mx: 1 }}>{item.quantidade}</Typography>
                                                                <IconButton size="small" onClick={() => aumentarQuantidade(item.id)}>
                                                                    <AddIcon fontSize="inherit" />
                                                                </IconButton>
                                                            </Box>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Paper>
                    </Grid>

                    {/* Coluna Direita: Cliente e Resumo */}
                    <Grid item xs={12} md={5}>
                        {/* Busca e Seleção de Cliente */}
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Cliente</Typography>
                            {!clienteSelecionado ? (
                                <Box>
                                    <TextField
                                        placeholder="Buscar cliente por nome ou CPF"
                                        variant="outlined" fullWidth value={buscaCliente}
                                        onChange={(e) => setBuscaCliente(e.target.value)}
                                        sx={{ backgroundColor: "#EBEBEB", borderRadius: "5px", "& fieldset": { border: "none" }, mb: buscaCliente.trim() ? 1 : 0 }}
                                        InputProps={{ endAdornment: (<InputAdornment position="end"><SearchIcon /></InputAdornment>) }}
                                    />
                                    {buscaCliente.trim() && (
                                        <List sx={{ maxHeight: 150, overflowY: "auto", border: "1px solid #eee", borderRadius: 1 }}>
                                            {clientesFiltrados.length > 0 ? (
                                                clientesFiltrados.map((cliente) => (
                                                    <ListItem button key={cliente.id} onClick={() => selecionarCliente(cliente)}>
                                                        <ListItemAvatar><Avatar><PersonIcon /></Avatar></ListItemAvatar>
                                                        <ListItemText primary={cliente.nome} secondary={cliente.cpf} />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem><ListItemText primary="Nenhum cliente encontrado." /></ListItem>
                                            )}
                                        </List>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
                                    <Avatar sx={{ mr: 2 }}><PersonIcon /></Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1">{clienteSelecionado.nome}</Typography>
                                        <Typography variant="body2" color="text.secondary">{clienteSelecionado.cpf}</Typography>
                                    </Box>
                                    <IconButton onClick={removerClienteSelecionado}><CloseIcon /></IconButton>
                                </Box>
                            )}
                        </Paper>

                        {/* Resumo da Compra CORRIGIDO */}
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Resumo da Compra</Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography>Subtotal (sem desconto)</Typography>
                                <Typography>{formatarMoeda(subtotalOriginal)}</Typography>
                            </Box>
                            {totalDesconto > 0 && (
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "green" }}>
                                    <Typography>Descontos</Typography>
                                    <Typography>- {formatarMoeda(totalDesconto)}</Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, fontWeight: "normal" }}>
                                <Typography>
                                    Subtotal {totalDesconto > 0 ? "(com desconto)" : ""}
                                </Typography>
                                <Typography>
                                    {formatarMoeda(subtotalComDesconto)}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <TextField
                                    label="CEP"
                                    variant="outlined" size="small" value={frete}
                                    onChange={(e) => setFrete(e.target.value)}
                                    sx={{ flexGrow: 1, mr: 1 }}
                                    disabled={freteCalculado}
                                />
                                {!freteCalculado ? (
                                    <Button variant="outlined" onClick={calcularFrete} disabled={!frete.trim()}>Calcular</Button>
                                ) : (
                                    <Button variant="outlined" color="error" onClick={removerFrete}>Remover</Button>
                                )}
                            </Box>
                            {freteCalculado && (
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography>Frete</Typography>
                                    <Typography>{formatarMoeda(valorFrete)}</Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">{formatarMoeda(totalFinal)}</Typography>
                            </Box>
                            <Button
                                variant="contained" fullWidth sx={{ background: "#0C58A3" }}
                                onClick={handleFinalizarCompra}
                                disabled={carrinho.length === 0 || !clienteSelecionado}
                            >
                                Finalizar Compra
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Cart;

