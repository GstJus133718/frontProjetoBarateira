import React, { useState } from "react"; // Importar useState
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Button
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; // Importar useNavigate

const Navbar = ({ hideSearch = false, hideAdminButton = false }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca
  const navigate = useNavigate(); // Hook para navegação

  // Função para lidar com a busca
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navega para a página de todos os produtos passando o termo como query param
      navigate(`/todos-produtos?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Função para lidar com o Enter no input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        <Box display="flex" alignItems="center">
          <Link to="/">
            <img src="/logo/logo_3.png" alt="Logo" style={{ width: 200 }} />
          </Link>
        </Box>

        {!hideSearch && (
          <Box sx={{ flex: 1, mx: 4 }}>
            <Box
              sx={{
                backgroundColor: "#eee",
                borderRadius: 50,
                display: "flex",
                alignItems: "center",
                padding: "4px 12px",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              <InputBase 
                placeholder="Buscar por nome, marca ou princípio ativo"
                sx={{ flex: 1, ml: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado
                onKeyPress={handleKeyPress} // Adiciona listener para Enter
              />
              <IconButton onClick={handleSearch}> {/* Adiciona onClick para o ícone */}
                <Search />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Botão Área Admin */}
        {!hideAdminButton && (
          <Button
            component={Link}
            to="/admin"
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              borderRadius: "50px",
              marginRight: "40px",
              px: 5.5,
              py: 1,
              textTransform: "none",
              fontWeight: "300",
              boxShadow: 1,
              display: "flex",
              alignItems: "center",
              color: "#000",
              gap: 1,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box 
                component="img"
                src="../public/icons/admin_icon.png" // Corrigir caminho se necessário
                alt="Ícone Admin"
                sx={{ 
                  width: 30, 
                  height: 30, 
                  mr: 3, // Verificar se este margin right é necessário
                }}
              />
            </Box>
            Área Admin
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

