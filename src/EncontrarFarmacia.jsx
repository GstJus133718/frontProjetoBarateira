import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    CircularProgress,
    Alert,
    Snackbar,
    Button,
    TextField,
    InputAdornment
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import Navbar from './NavBar';
import Footer from './Footer';
import { filialService } from './services/filialService';

const EncontrarFarmacia = () => {
    const navigate = useNavigate();
    
    // Estados
    const [filiais, setFiliais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [error, setError] = useState(null);

    // Carregar filiais da API pública
    const carregarFiliais = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔍 Iniciando carregamento de filiais...');
            const response = await filialService.listarPublico();
            
            console.log('📦 Response recebida:', response);
            
            // Extrair as filiais da resposta
            let filiaisData = [];
            if (response && response.filiais && Array.isArray(response.filiais)) {
                filiaisData = response.filiais;
            } else if (Array.isArray(response)) {
                filiaisData = response;
            } else {
                console.error('❌ Estrutura de resposta inválida:', response);
                throw new Error('Estrutura de dados inválida recebida da API');
            }
            
            console.log('📊 Dados das filiais extraídos:', filiaisData);
            
            // Formatar os dados das filiais para o frontend
            const filiaisFormatadas = filiaisData.map(filial => ({
                id: filial.id,
                nome: filial.nome || '',
                endereco: filial.endereco || '',
                telefone: filial.telefone || 'Telefone não informado',
                // Manter dados originais para referência
                ...filial
            }));
            
            console.log('✅ Filiais formatadas:', filiaisFormatadas);
            setFiliais(filiaisFormatadas);
            
        } catch (error) {
            console.error('❌ Erro ao carregar filiais:', error);
            
            // Mostrar mensagem de erro específica baseada no tipo de erro
            let mensagemErro = 'Erro ao carregar lista de filiais.';
            
            if (error.code === 'ERR_NETWORK') {
                mensagemErro = 'Erro de rede. Verifique sua conexão e se o servidor está funcionando.';
            } else if (error.response?.status === 404) {
                mensagemErro = 'Endpoint não encontrado. Verifique se a API está rodando na porta correta.';
            } else if (error.response?.status >= 500) {
                mensagemErro = 'Erro interno do servidor. Tente novamente em alguns momentos.';
            }
            
            setError(mensagemErro);
            setFiliais([]);
        } finally {
            setLoading(false);
        }
    };

    // Carregar filiais ao montar o componente
    useEffect(() => {
        carregarFiliais();
    }, []);

    // Filtrar filiais
    const filiaisFiltradas = filiais.filter((filial) => {
        const termoBusca = busca.toLowerCase();
        return (
            (filial.nome && filial.nome.toLowerCase().includes(termoBusca)) ||
            (filial.endereco && filial.endereco.toLowerCase().includes(termoBusca)) ||
            (filial.telefone && filial.telefone.toLowerCase().includes(termoBusca))
        );
    });

    // Fechar mensagem de erro
    const handleCloseError = () => setError(null);

    // Tentar recarregar
    const handleTentarNovamente = () => {
        carregarFiliais();
    };

    // Loading inicial
    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
                <Navbar />
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    gap: 2
                }}>
                    <CircularProgress size={60} />
                    <Typography variant="body1" color="text.secondary">
                        Carregando filiais...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ mb: 3, textTransform: 'none' }}
                    >
                        Voltar
                    </Button>

                    <Typography variant="h3" component="h1" gutterBottom align="center" color="#0C58A3">
                        Encontre uma Farmácia
                    </Typography>
                    
                    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
                        Localize a unidade da Farmácia A Barateira mais próxima de você
                    </Typography>

                    {/* Mostrar erro se existir */}
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 3 }}
                            action={
                                <Button 
                                    color="inherit" 
                                    size="small" 
                                    onClick={handleTentarNovamente}
                                >
                                    Tentar Novamente
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Busca */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <TextField
                            placeholder="Buscar por nome, endereço ou telefone..."
                            variant="outlined"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            sx={{
                                width: "100%",
                                maxWidth: 500,
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>

                {/* Contador de resultados */}
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                    {filiaisFiltradas.length} filial(is) encontrada(s)
                    {busca && ` para "${busca}"`}
                </Typography>

                {/* Grid de Filiais */}
                {filiaisFiltradas.length > 0 ? (
                    <Grid container spacing={3}>
                        {filiaisFiltradas.map((filial) => (
                            <Grid item xs={12} sm={6} md={4} key={filial.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography 
                                            variant="h6" 
                                            component="h2" 
                                            gutterBottom
                                            color="#0C58A3"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {filial.nome}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                            <LocationOnIcon 
                                                sx={{ 
                                                    color: '#F15A2B', 
                                                    mr: 1, 
                                                    mt: 0.5,
                                                    fontSize: 20 
                                                }} 
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {filial.endereco}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PhoneIcon 
                                                sx={{ 
                                                    color: '#F15A2B', 
                                                    mr: 1,
                                                    fontSize: 20 
                                                }} 
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {filial.telefone}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                mt: 'auto',
                                                backgroundColor: '#0C58A3',
                                                '&:hover': {
                                                    backgroundColor: '#094a8a'
                                                }
                                            }}
                                            onClick={() => {
                                                const endereco = encodeURIComponent(filial.endereco);
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, '_blank');
                                            }}
                                        >
                                            Ver no Mapa
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    !error && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <LocationOnIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {busca ? 'Nenhuma filial encontrada' : 'Nenhuma filial disponível'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {busca 
                                    ? 'Tente buscar por outros termos ou verifique a ortografia.'
                                    : 'As filiais serão exibidas quando estiverem disponíveis.'
                                }
                            </Typography>
                        </Box>
                    )
                )}
            </Container>

            <Footer />

            {/* Snackbar para erros */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EncontrarFarmacia;