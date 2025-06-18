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
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

// Importar serviços
import { produtoService } from './services/produtoService';
import { clienteService } from './services/clienteService';
import { filialService } from './services/filialService';
import { vendaService } from './services/vendaService';

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

const obterPrecoOriginalProduto = (produto) => {
    if (produto.preco_unitario !== undefined && produto.preco_unitario !== null) {
        return produto.preco_unitario;
    }
    return precoParaNumero(produto.preco || 0);
};

const Cart = () => {
    // Estados principais
    const [carrinho, setCarrinho] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [filiais, setFiliais] = useState([]);
    const [busca, setBusca] = useState("");
    const [buscaCliente, setBuscaCliente] = useState("");
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [filialSelecionada, setFilialSelecionada] = useState("");
    
    // Estados de loading e feedback
    const [loadingProdutos, setLoadingProdutos] = useState(false);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const [loadingVenda, setLoadingVenda] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Estados do modal de nota fiscal
    const [notaFiscalModal, setNotaFiscalModal] = useState(false);
    const [notaFiscalData, setNotaFiscalData] = useState(null);
    
    const navigate = useNavigate();

    // Carregar dados iniciais
    useEffect(() => {
        carregarFiliais();
        carregarCarrinhoSalvo();
    }, []);

    // Auto-clear mensagens
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Carregar filiais da API
    const carregarFiliais = async () => {
        try {
            const response = await filialService.listar();
            let filiaisData = [];
            
            if (response && response.filiais && Array.isArray(response.filiais)) {
                filiaisData = response.filiais;
            } else if (Array.isArray(response)) {
                filiaisData = response;
            }
            
            const filiaisFormatadas = filiaisData.map(filial => ({
                id: parseInt(filial.ID || filial.id), // ✅ Garantir que seja número
                nome: filial.nome || '',
                endereco: filial.endereco || '',
                ...filial
            }));
            
            setFiliais(filiaisFormatadas);
            
            // Selecionar primeira filial por padrão
            if (filiaisFormatadas.length > 0) {
                setFilialSelecionada(filiaisFormatadas[0].id);
            }
        } catch (error) {
            console.error('Erro ao carregar filiais:', error);
            setError('Erro ao carregar filiais.');
        }
    };

    // Carregar carrinho salvo
    const carregarCarrinhoSalvo = () => {
        try {
            const carrinhoSalvo = localStorage.getItem("carrinho_vendas");
            if (carrinhoSalvo) {
                const carrinhoParsed = JSON.parse(carrinhoSalvo);
                if (Array.isArray(carrinhoParsed)) {
                    setCarrinho(carrinhoParsed);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
        }
    };

    // Salvar carrinho no localStorage
    useEffect(() => {
        localStorage.setItem("carrinho_vendas", JSON.stringify(carrinho));
    }, [carrinho]);

    // Buscar produtos na API
    const buscarProdutos = async () => {
        if (!busca.trim()) return [];
        
        try {
            setLoadingProdutos(true);
            const response = await produtoService.listar();
            
            let produtosData = [];
            if (response && response.produtos && Array.isArray(response.produtos)) {
                produtosData = response.produtos;
            } else if (Array.isArray(response)) {
                produtosData = response;
            }
            
            // Formatar produtos da API
            const produtosFormatados = produtosData.map(produto => ({
                id: parseInt(produto.ID || produto.id), // ✅ Garantir que seja número
                nome: produto.nome || '',
                principio_ativo: produto.principio_ativo || '',
                marca: produto.marca || '',
                departamento: produto.departamento || '',
                preco_unitario: produto.preco_unitario || 0,
                valor_real: produto.valor_real || produto.preco_unitario || 0,
                economia: produto.economia || 0,
                em_promocao: produto.em_promocao || false,
                desconto: produto.desconto || 0,
                generico: produto.generico || false,
                // Para compatibilidade com display
                preco: produto.valor_real ? 
                    `R$ ${produto.valor_real.toFixed(2).replace('.', ',')}` : 
                    `R$ ${(produto.preco_unitario || 0).toFixed(2).replace('.', ',')}`,
                ...produto
            }));
            
            // Filtrar produtos pela busca
            const termoLower = busca.toLowerCase();
            const produtosFiltrados = produtosFormatados.filter(p =>
                p.nome?.toLowerCase().includes(termoLower) ||
                p.principio_ativo?.toLowerCase().includes(termoLower) ||
                p.marca?.toLowerCase().includes(termoLower) ||
                p.departamento?.toLowerCase().includes(termoLower)
            );
            
            setProdutos(produtosFiltrados);
            return produtosFiltrados;
            
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setError('Erro ao buscar produtos.');
            return [];
        } finally {
            setLoadingProdutos(false);
        }
    };

    // Buscar clientes na API
    const buscarClientes = async () => {
        if (!buscaCliente.trim()) return [];
        
        try {
            setLoadingClientes(true);
            const response = await clienteService.listar();
            
            let clientesData = [];
            if (response && response.clientes && Array.isArray(response.clientes)) {
                clientesData = response.clientes;
            } else if (Array.isArray(response)) {
                clientesData = response;
            }
            
            // Formatar clientes da API
            const clientesFormatados = clientesData.map(cliente => {
                const usuario = cliente.Usuario || {};
                return {
                    id: parseInt(cliente.ID || cliente.id), // ✅ Garantir que seja número
                    nome: cliente.nome || '',
                    sobrenome: cliente.sobrenome || '',
                    cpf: usuario.cpf || '',
                    email: usuario.email || '',
                    // Para compatibilidade
                    nomeCompleto: `${cliente.nome || ''} ${cliente.sobrenome || ''}`.trim(),
                    ...cliente
                };
            });
            
            // Filtrar clientes pela busca
            const termoLower = buscaCliente.toLowerCase();
            const termoNumerico = buscaCliente.replace(/\D/g, "");
            
            const clientesFiltrados = clientesFormatados.filter(c =>
                c.nome?.toLowerCase().includes(termoLower) ||
                c.nomeCompleto?.toLowerCase().includes(termoLower) ||
                (c.cpf && c.cpf.replace(/\D/g, "").includes(termoNumerico))
            );
            
            setClientes(clientesFiltrados);
            return clientesFiltrados;
            
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            setError('Erro ao buscar clientes.');
            return [];
        } finally {
            setLoadingClientes(false);
        }
    };

    // Executar busca de produtos quando o termo mudar
    useEffect(() => {
        if (busca.trim()) {
            const timeoutId = setTimeout(() => {
                buscarProdutos();
            }, 300); // Debounce de 300ms
            
            return () => clearTimeout(timeoutId);
        } else {
            setProdutos([]);
        }
    }, [busca]);

    // Executar busca de clientes quando o termo mudar
    useEffect(() => {
        if (buscaCliente.trim()) {
            const timeoutId = setTimeout(() => {
                buscarClientes();
            }, 300); // Debounce de 300ms
            
            return () => clearTimeout(timeoutId);
        } else {
            setClientes([]);
        }
    }, [buscaCliente]);

    const handleLogout = () => navigate("/admin");

    const aumentarQuantidade = (id) => {
        setCarrinho(carrinho.map(item => 
            item.id === id ? 
                { ...item, quantidade: item.quantidade + 1 } : 
                item
        ));
    };

    const diminuirQuantidade = (id) => {
        setCarrinho(carrinho.map(item => 
            item.id === id && item.quantidade > 1 ? 
                { ...item, quantidade: item.quantidade - 1 } : 
                item
        ));
    };

    const removerProduto = (id) => {
        setCarrinho(carrinho.filter(item => item.id !== id));
    };

    const selecionarCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setBuscaCliente("");
        setClientes([]);
    };

    const removerClienteSelecionado = () => setClienteSelecionado(null);

    const adicionarAoCarrinho = (produto) => {
        const produtoIdStr = String(produto.id);
        const produtoExistente = carrinho.find(item => String(item.id) === produtoIdStr);

        if (produtoExistente) {
            aumentarQuantidade(produto.id);
        } else {
            setCarrinho([...carrinho, { 
                ...produto, 
                id: produto.id, 
                quantidade: 1 
            }]);
        }
        setBusca("");
        setProdutos([]);
    };

    // Calcular valores do carrinho
    const calcularValoresCarrinho = () => {
        let subtotalOriginal = 0;
        let totalDesconto = 0;

        carrinho.forEach(item => {
            const precoOriginalItem = obterPrecoOriginalProduto(item);
            const precoFinalItem = obterPrecoFinalProduto(item);
            const quantidade = item.quantidade;
            
            subtotalOriginal += precoOriginalItem * quantidade;
            
            if (precoFinalItem < precoOriginalItem) {
                const descontoPorItem = precoOriginalItem - precoFinalItem;
                totalDesconto += descontoPorItem * quantidade;
            }
        });

        const subtotalComDesconto = subtotalOriginal - totalDesconto;

        return {
            subtotalOriginal,
            totalDesconto,
            subtotalComDesconto,
            totalFinal: subtotalComDesconto
        };
    };

    const { subtotalOriginal, totalDesconto, subtotalComDesconto, totalFinal } = calcularValoresCarrinho();

    // Finalizar compra com API
    const handleFinalizarCompra = async () => {
        if (carrinho.length === 0) {
            setError("O carrinho está vazio!");
            return;
        }
        if (!clienteSelecionado) {
            setError("Por favor, selecione um cliente para a venda.");
            return;
        }
        if (!filialSelecionada) {
            setError("Por favor, selecione uma filial.");
            return;
        }

        try {
            setLoadingVenda(true);
            setError(null);

            // Preparar dados da venda no formato da API
            const vendaData = {
                cliente_id: parseInt(clienteSelecionado.id),
                filial_id: parseInt(filialSelecionada),
                itens: carrinho.map(item => ({
                    produto_id: parseInt(item.id), // ✅ Converter para número
                    quantidade: parseInt(item.quantidade) // ✅ Garantir que quantidade também seja número
                }))
            };

            console.log('Enviando venda:', vendaData);

            // Criar venda na API
            const response = await vendaService.criar(vendaData);
            
            console.log('Venda criada com sucesso:', response);

            // Exibir nota fiscal
            setNotaFiscalData(response);
            setNotaFiscalModal(true);

            // Limpar carrinho e seleções
            setCarrinho([]);
            setClienteSelecionado(null);
            
            setSuccess('Venda finalizada com sucesso!');

        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            
            let mensagemErro = 'Erro ao finalizar compra. Tente novamente.';
            
            if (error.response?.data?.message) {
                mensagemErro = error.response.data.message;
            } else if (error.response?.data?.error) {
                mensagemErro = error.response.data.error;
            } else if (error.response?.status === 400) {
                mensagemErro = 'Dados inválidos. Verifique os produtos e quantidades.';
            } else if (error.response?.status === 404) {
                mensagemErro = 'Cliente ou filial não encontrado.';
            } else if (error.response?.status === 422) {
                mensagemErro = 'Estoque insuficiente para alguns produtos.';
            }
            
            setError(mensagemErro);
        } finally {
            setLoadingVenda(false);
        }
    };

    // Imprimir nota fiscal
    const handleImprimirNota = () => {
        if (!notaFiscalData?.nota_fiscal) return;
        
        // Gerar conteúdo para impressão
        const nf = notaFiscalData.nota_fiscal;
        
        const conteudoImpressao = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Nota Fiscal - ${nf.nota_fiscal.numero}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .section { margin: 15px 0; }
                    .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .table th { background-color: #f2f2f2; }
                    .total { font-weight: bold; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>NOTA FISCAL ELETRÔNICA</h1>
                    <p>Número: ${nf.nota_fiscal.numero} | Série: ${nf.nota_fiscal.serie}</p>
                    <p>Data: ${nf.nota_fiscal.data_emissao}</p>
                    <p>Chave de Acesso: ${nf.nota_fiscal.chave_acesso}</p>
                </div>
                
                <div class="section">
                    <h3>DADOS DA EMPRESA</h3>
                    <p><strong>${nf.filial.nome}</strong></p>
                    <p>CNPJ: ${nf.filial.cnpj}</p>
                    <p>Endereço: ${nf.filial.endereco}</p>
                </div>
                
                <div class="section">
                    <h3>DADOS DO CLIENTE</h3>
                    <p><strong>${nf.cliente.nome}</strong></p>
                    <p>CPF: ${nf.cliente.cpf}</p>
                    <p>Data Nascimento: ${nf.cliente.data_nasc}</p>
                </div>
                
                <div class="section">
                    <h3>ITENS DA NOTA FISCAL</h3>
                    <table class="table">
                        <tr>
                            <th>Produto</th>
                            <th>Marca</th>
                            <th>Qtd</th>
                            <th>Valor Unit.</th>
                            <th>Desconto</th>
                            <th>Valor Total</th>
                        </tr>
                        ${nf.itens.map(item => `
                            <tr>
                                <td>${item.produto}</td>
                                <td>${item.marca}</td>
                                <td>${item.quantidade}</td>
                                <td>R$ ${item.valor_unitario.toFixed(2).replace('.', ',')}</td>
                                <td>R$ ${item.desconto.toFixed(2).replace('.', ',')}</td>
                                <td>R$ ${item.valor_total.toFixed(2).replace('.', ',')}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div class="section">
                    <h3>RESUMO FINANCEIRO</h3>
                    <p>Valor dos Produtos: R$ ${nf.valores.valor_produtos.toFixed(2).replace('.', ',')}</p>
                    <p>Total de Descontos: R$ ${nf.valores.valor_descontos.toFixed(2).replace('.', ',')}</p>
                    <p class="total">Valor Líquido: R$ ${nf.valores.valor_liquido.toFixed(2).replace('.', ',')}</p>
                    <p>Forma de Pagamento: ${nf.resumo.forma_pagamento}</p>
                </div>
                
                <div class="section">
                    <p><strong>Vendedor:</strong> ${nf.vendedor.email}</p>
                    <p><strong>Comissão:</strong> R$ ${nf.valores.comissao.toFixed(2).replace('.', ',')}</p>
                </div>
            </body>
            </html>
        `;
        
        // Abrir janela de impressão
        const janelaImpressao = window.open('', '_blank');
        janelaImpressao.document.write(conteudoImpressao);
        janelaImpressao.document.close();
        janelaImpressao.print();
    };

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

            {/* Mensagens de Feedback */}
            {error && (
                <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ m: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Box sx={{ p: 3, width: "100vw" }}>
                <Grid container spacing={3} sx={{display: "flex", justifyContent: "center"}}>
                    {/* Coluna Esquerda: Busca e Carrinho */}
                    <Grid item xs={12} md={7} sx={{width: "70%"}}>
                        {/* Busca de Produtos */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
                            <TextField
                                placeholder="Buscar produto por nome, marca ou princípio ativo"
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
                                            {loadingProdutos ? <CircularProgress size={20} /> : <SearchIcon />}
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
                                {loadingProdutos ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : produtos.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {produtos.map((produto) => (
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
                                                        <Typography variant="body1" component="div" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                                                            {produto.nome}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                            {produto.marca} - {produto.principio_ativo}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            {produto.economia > 0 && (
                                                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                                                    R$ {produto.preco_unitario.toFixed(2).replace('.', ',')}
                                                                </Typography>
                                                            )}
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: produto.em_promocao ? 'error.main' : 'text.primary' }}>
                                                                R$ {produto.valor_real.toFixed(2).replace('.', ',')}
                                                            </Typography>
                                                            {produto.em_promocao && (
                                                                <Chip label={`-${produto.desconto}%`} color="error" size="small" sx={{ height: "18px", fontSize: "0.6rem" }} />
                                                            )}
                                                        </Box>
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
                                    <Typography variant="body2" color="text.secondary">
                                        {busca.trim() ? 'Nenhum produto encontrado.' : 'Digite para buscar produtos...'}
                                    </Typography>
                                )}
                            </Paper>
                        )}

                        {/* Lista de Produtos no Carrinho */}
                        <Typography variant="h6" sx={{ mb: 2 }}>Carrinho ({carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'})</Typography>
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
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                {item.marca} - {item.principio_ativo}
                                                            </Typography>
                                                            
                                                            {/* Exibição de Preço */}
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
                                                            
                                                            {/* Mostrar economia total se houver */}
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
                        {/* Seleção de Filial */}
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Filial</Typography>
                            <FormControl fullWidth size="small">
                                <InputLabel>Selecionar Filial</InputLabel>
                                <Select
                                    value={filialSelecionada}
                                    label="Selecionar Filial"
                                    onChange={(e) => setFilialSelecionada(e.target.value)}
                                >
                                    {filiais.map((filial) => (
                                        <MenuItem key={filial.id} value={filial.id}>
                                            {filial.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>

                        {/* Busca e Seleção de Cliente */}
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Cliente</Typography>
                            {!clienteSelecionado ? (
                                <Box>
                                    <TextField
                                        placeholder="Buscar cliente por nome ou CPF"
                                        variant="outlined" 
                                        fullWidth 
                                        value={buscaCliente}
                                        onChange={(e) => setBuscaCliente(e.target.value)}
                                        sx={{ backgroundColor: "#EBEBEB", borderRadius: "5px", "& fieldset": { border: "none" }, mb: buscaCliente.trim() ? 1 : 0 }}
                                        InputProps={{ 
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {loadingClientes ? <CircularProgress size={20} /> : <SearchIcon />}
                                                </InputAdornment>
                                            ) 
                                        }}
                                    />
                                    {buscaCliente.trim() && (
                                        <List sx={{ maxHeight: 150, overflowY: "auto", border: "1px solid #eee", borderRadius: 1 }}>
                                            {loadingClientes ? (
                                                <ListItem>
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                        <CircularProgress size={20} />
                                                    </Box>
                                                </ListItem>
                                            ) : clientes.length > 0 ? (
                                                clientes.map((cliente) => (
                                                    <ListItem button key={cliente.id} onClick={() => selecionarCliente(cliente)}>
                                                        <ListItemAvatar><Avatar><PersonIcon /></Avatar></ListItemAvatar>
                                                        <ListItemText 
                                                            primary={cliente.nomeCompleto || cliente.nome} 
                                                            secondary={cliente.cpf || cliente.email} 
                                                        />
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary="Nenhum cliente encontrado." />
                                                </ListItem>
                                            )}
                                        </List>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
                                    <Avatar sx={{ mr: 2 }}><PersonIcon /></Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body1">{clienteSelecionado.nomeCompleto || clienteSelecionado.nome}</Typography>
                                        <Typography variant="body2" color="text.secondary">{clienteSelecionado.cpf || clienteSelecionado.email}</Typography>
                                    </Box>
                                    <IconButton onClick={removerClienteSelecionado}><CloseIcon /></IconButton>
                                </Box>
                            )}
                        </Paper>

                        {/* Resumo da Compra */}
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
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">{formatarMoeda(totalFinal)}</Typography>
                            </Box>
                            <Button
                                variant="contained" 
                                fullWidth 
                                sx={{ background: "#0C58A3" }}
                                onClick={handleFinalizarCompra}
                                disabled={carrinho.length === 0 || !clienteSelecionado || !filialSelecionada || loadingVenda}
                                startIcon={loadingVenda ? <CircularProgress size={20} /> : null}
                            >
                                {loadingVenda ? 'Finalizando...' : 'Finalizar Compra'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Modal da Nota Fiscal */}
            <Dialog 
                open={notaFiscalModal} 
                onClose={() => setNotaFiscalModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Nota Fiscal Gerada
                </DialogTitle>
                <DialogContent>
                    {notaFiscalData?.nota_fiscal && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                NF: {notaFiscalData.nota_fiscal.nota_fiscal.numero}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Data: {notaFiscalData.nota_fiscal.nota_fiscal.data_emissao}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Cliente: {notaFiscalData.nota_fiscal.cliente.nome}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Filial: {notaFiscalData.nota_fiscal.filial.nome}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Valor Total: {formatarMoeda(notaFiscalData.nota_fiscal.valores.valor_liquido)}
                            </Typography>
                            <Typography variant="body2" color="success.main">
                                {notaFiscalData.message}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImprimirNota} startIcon={<PrintIcon />}>
                        Imprimir
                    </Button>
                    <Button onClick={() => setNotaFiscalModal(false)}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Cart;