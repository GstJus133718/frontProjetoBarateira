import React from "react";
import { Box, Grid, Typography, Stack, Link as MuiLink } from "@mui/material";
import logoFarmacia from "../public/logo/logo_1.png"; // Ajuste o caminho conforme necessário

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", width: "100vw", mt: 4}}>
      <Box
        sx={{
          height: "360px",
          px: 4,
          py: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box
            component="img"
            src={logoFarmacia}
            alt="Logo Farmácia"
            sx={{ width: 370, height: 250, objectFit: "contain" }}
          />
        </Box>

        {/* Colunas de navegação */}
        <Grid container spacing="15rem">
          {/* Links rápidos */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Links Rápidos
            </Typography>
            <Stack spacing={1}>
              <MuiLink href="#" color="inherit" underline="hover">
                Início
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Quem Somos
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Política de Privacidade
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Nossas Lojas
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contato */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Contato
            </Typography>
            <Stack spacing={1}>
              <Typography>Email: contato@farmaciaexemplo.com</Typography>
              <Typography>Telefone: (99) 99999-9999</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Copyright */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 2}}>
        <Typography
          variant="body2"
          color="#000"
          textAlign="center"
        >
          © Copyright 2024 - FULL TECNOLOGIA - Todos os direitos Reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
