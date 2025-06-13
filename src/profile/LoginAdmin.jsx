import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/hook/useAuth";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import Navbar from "../NavBar";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, clearErrorMessage } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/area-admin");
    }
  }, [isAuthenticated, navigate]);

  // Limpar erros quando os campos mudarem
  useEffect(() => {
    if (error) clearErrorMessage();
    if (localError) setLocalError("");
  }, [email, password]);

  const handleLogin = async () => {
    // Validações básicas
    if (!email.trim()) {
      setLocalError("Email é obrigatório");
      return;
    }
    
    if (!password.trim()) {
      setLocalError("Senha é obrigatória");
      return;
    }

    try {
      const result = await login({ email, password });
      
      if (result.type === 'auth/login') {
        // Login bem-sucedido, navegação será tratada pelo useEffect
        console.log("Login realizado com sucesso!");
      }
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Navbar hideSearch={true} hideAdminButton={true} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <Card
          sx={{
            width: '30%',
            height: '80%',
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            gap: 4,
          }}
        >
          <Avatar
            src="../public/logo/logo_1.png"
            alt="Logo da Farmácia"
            variant="square"
            sx={{ width: 150, height: 150 }}
          />

          <CardContent sx={{ width: "100%", maxWidth: 350 }}>
            {/* Exibir erros */}
            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {localError || error}
              </Alert>
            )}

            {/* Campo Email */}
            <TextField
              fullWidth
              variant="standard"
              margin="normal"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ color: "#666", mr: 1 }} />
                    </Box>
                  </InputAdornment>
                ),
                disableUnderline: false,
                sx: {
                  borderLeft: "1px solid #D4D4D4",
                  borderRight: "1px solid #D4D4D4",
                  borderBottom: "1px solid #D4D4D4",
                  borderTop: "none",
                  borderRadius: "5px",
                  py: 0.5,
                  px: 1,
                },
              }}
            />

            {/* Campo Senha */}
            <TextField
              fullWidth
              type="password"
              variant="standard"
              margin="normal"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LockIcon sx={{ color: "#666", mr: 1 }} />
                    </Box>
                  </InputAdornment>
                ),
                disableUnderline: false,
                sx: {
                  borderLeft: "1px solid #D4D4D4",
                  borderRight: "1px solid #D4D4D4",
                  borderBottom: "1px solid #D4D4D4",
                  borderTop: "none",
                  borderRadius: "5px",
                  py: 0.5,
                  px: 1,
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ 
                backgroundColor: "#0C58A3", 
                color: "#fff", 
                mt: 4,
                position: 'relative'
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginAdmin;