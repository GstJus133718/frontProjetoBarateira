import React from "react";
import { useNavigate } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import Navbar from "./NavBar";

const LoginAdmin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navegar para a área admin sem verificação de login
    navigate("/area-admin");
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

            {/* Campo Usuário */}
            <TextField
              fullWidth
              variant="standard"
              margin="normal"
              placeholder="Usuário"
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
              sx={{ backgroundColor: "#0C58A3", color: "#fff", mt: 4 }}
              onClick={handleLogin}
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
