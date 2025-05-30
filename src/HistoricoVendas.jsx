import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import DownloadIcon from '@mui/icons-material/Download'; // Ícone para baixar NF

// Dados mockados para visualização inicial
const vendasMock = [
    {
        id: "01",
        cliente: "Cliente 01",
        vendedor: "Vendedor 01",
        filial: "Norte",
        valor: "R$ 50,00",
        comissao: "R$ 5,00",
        nf: "00001",
    },
    {
        id: "02",
        cliente: "Cliente 02",
        vendedor: "Vendedor 01",
        filial: "Norte",
        valor: "R$ 50,00",
        comissao: "R$ 5,00",
        nf: "00002",
    },
    {
        id: "03",
        cliente: "Cliente 03",
        vendedor: "Vendedor 01",
        filial: "Norte",
        valor: "R$ 50,00",
        comissao: "R$ 5,00",
        nf: "00003",
    },
    {
        id: "04",
        cliente: "Cliente 04",
        vendedor: "Vendedor 02",
        filial: "Sul",
        valor: "R$ 50,00",
        comissao: "R$ 5,00",
        nf: "00004",
    },
];

const HistoricoVendas = () => {
    // Função para inicializar histórico de vendas a partir do localStorage
    const getInitialHistorico = () => {
        const savedHistorico = localStorage.getItem("historicoVendas");
        // Se houver histórico salvo, retorna ele. Caso contrário, usa o mock.
        // Em produção, provavelmente começaria vazio ou buscaria de uma API.
        return savedHistorico ? JSON.parse(savedHistorico) : vendasMock;
    };

    const [historico, setHistorico] = useState(getInitialHistorico);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();

    // Efeito para carregar dados do localStorage na montagem
    // e talvez para ouvir mudanças se necessário (como nos outros componentes)
    useEffect(() => {
        setHistorico(getInitialHistorico());
        
        // Opcional: Adicionar listener para storage changes se outras partes
        // do sistema puderem modificar o histórico.
        const handleStorageChange = (event) => {
            if (event.key === 'historicoVendas') {
                console.log("Storage 'historicoVendas' changed, reloading...");
                setHistorico(getInitialHistorico());
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        // Adicionar lógica de logout se necessário, ex: limpar localStorage, redirecionar
        navigate("/admin"); // Ou para a tela de login apropriada
    };

    const handleBaixarNF = (nf) => {
        // Lógica para baixar a NF
        // Por enquanto, apenas um alerta
        alert(`Simulando download da NF: ${nf}`);
        // Em um caso real, poderia gerar um PDF ou buscar um arquivo
    };

    // Filtrar histórico com base na busca
    const historicoFiltrado = historico.filter((venda) => {
        const termoBusca = busca.toLowerCase();
        return (
            venda.id.toLowerCase().includes(termoBusca) ||
            venda.cliente.toLowerCase().includes(termoBusca) ||
            venda.vendedor.toLowerCase().includes(termoBusca) ||
            venda.filial.toLowerCase().includes(termoBusca) ||
            venda.valor.toLowerCase().includes(termoBusca) ||
            venda.comissao.toLowerCase().includes(termoBusca) ||
            venda.nf.toLowerCase().includes(termoBusca)
        );
    });

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            {/* Navbar */} 
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    boxShadow: 1,
                }}
            >
                <Avatar
                    src="../public/logo/logo_3.png" // Ajuste o caminho do logo se necessário
                    alt="A Barateira"
                    variant="square"
                    sx={{ width: 200, height: 115, objectFit: 'contain' }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonOutlineOutlinedIcon sx={{ color: "#666", mr: 1 }} />
                    <Box sx={{ color: "text.secondary", mr: 3 }}>
                        <Typography variant="body2" sx={{ m: 0 }}>Olá,</Typography>
                        <Typography variant="body2" sx={{ m: 0, fontWeight: 'bold' }}>Vendedor</Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 20,
                            borderColor: "#e0e0e0",
                            color: "#666",
                            px: 4,
                            py: 1,
                        }}
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </Box>
            </Box>

            {/* Conteúdo */} 
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    {/* Barra de busca */} 
                    <TextField
                        size="small"
                        placeholder="Buscar venda"
                        variant="outlined"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        sx={{
                            width: "calc(100% - 200px)", // Ocupa espaço menos o botão voltar
                            backgroundColor: "#EBEBEB",
                            borderRadius: "5px",
                            mr: 2, // Espaço antes do botão voltar
                            "& fieldset": { border: "none" },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Botão voltar */} 
                    <Button
                        variant="outlined"
                        sx={{ width: "150px" }}
                        onClick={() => navigate("/area-admin")} // Navega de volta para a área admin
                    >
                        Voltar
                    </Button>
                </Box>

                {/* Tabela de Histórico */} 
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Vendedor</TableCell>
                                <TableCell>Filial</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Comissão</TableCell>
                                <TableCell>NF</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historicoFiltrado.map((venda) => (
                                <TableRow key={venda.id}>
                                    <TableCell>{venda.id}</TableCell>
                                    <TableCell>{venda.cliente}</TableCell>
                                    <TableCell>{venda.vendedor}</TableCell>
                                    <TableCell>{venda.filial}</TableCell>
                                    <TableCell>{venda.valor}</TableCell>
                                    <TableCell>{venda.comissao}</TableCell>
                                    <TableCell>{venda.nf}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            sx={{ 
                                                backgroundColor: '#555', // Cor do botão como na imagem
                                                '&:hover': {
                                                    backgroundColor: '#444',
                                                }
                                            }}
                                            onClick={() => handleBaixarNF(venda.nf)}
                                        >
                                            Baixar NF
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Adiciona linhas vazias se houver poucas vendas para preencher a altura */} 
                            {Array.from({ length: Math.max(0, 10 - historicoFiltrado.length) }).map((_, index) => (
                                <TableRow key={`empty-${index}`} sx={{ height: 53 }}> {/* Altura aproximada de uma linha */} 
                                    <TableCell colSpan={8}></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default HistoricoVendas;

