import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

// Assume que as seções na Home têm estes IDs
const SECTION_IDS = {
  PRODUTOS_INFANTIS: "produtos-infantis-section",
  PROMOCOES_DESTAQUES: "promocoes-destaques-section",
};

const navItems = [
    { label: "Encontre uma farmácia", action: "find_pharmacy", type: "link" }, // Adicionado tipo e ação para clareza
    { label: "Produtos", action: "/todos-produtos", type: "navigate" },
    { label: "Produtos Infantis", action: SECTION_IDS.PRODUTOS_INFANTIS, type: "scroll" },
    { label: "Promoções Destaques", action: SECTION_IDS.PROMOCOES_DESTAQUES, type: "scroll" },
];

const SecondaryNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavClick = (item) => {
        if (item.type === "navigate") {
            navigate(item.action);
        } else if (item.type === "scroll") {
            // Só rola se estiver na Home ('/')
            if (location.pathname === "/") {
                const section = document.getElementById(item.action);
                if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    console.warn(`Seção com ID "${item.action}" não encontrada na página.`);
                }
            } else {
                // Se não estiver na home, navega para home primeiro.
                // A rolagem após navegação pode precisar de lógica adicional (ex: useEffect na Home)
                // ou usar hash na URL (ex: navigate('/#produtos-infantis-section')) se o setup permitir.
                // Por simplicidade, apenas navegamos para a home.
                navigate("/");
                // Idealmente, passaria um estado ou usaria um hash para indicar a rolagem após carregar a Home.
                // Exemplo com hash (requer configuração de Router ou lógica na Home):
                // navigate(`/#${item.action}`);
            }
        } else if (item.action === "find_pharmacy") {
            // Lógica para "Encontre uma farmácia" (pode ser navegação, modal, etc.)
            console.log("Ação para encontrar farmácia");
            // Exemplo: navigate("/encontrar-farmacia");
        }
    };

    return (
      <Box sx={{ width: "100%", backgroundColor: "#f3f3f3", borderBottom: '1px solid #e0e0e0' }}>
        <Box
          sx={{
            maxWidth: 1200,
            margin: "0 auto",
            paddingY: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={6}>
            {navItems.map((item, index) => (
              <Typography
                key={index}
                variant="body1"
                onClick={() => handleNavClick(item)}
                sx={{
                  //fontWeight: item.active ? "bold" : "normal", // Remover 'active' fixo
                  color: "#333",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#0C58A3", // Cor de hover azul
                    textDecoration: "underline",
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  };

export default SecondaryNavbar;

