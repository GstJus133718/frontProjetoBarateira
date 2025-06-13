import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

// Assume que as seções na Home têm estes IDs
const SECTION_IDS = {
  PRODUTOS_INFANTIS: "produtos-infantis-section",
  PROMOCOES_DESTAQUES: "promocoes-destaques-section",
};

const navItems = [
    { label: "Encontre uma farmácia", action: "/encontrar-farmacia", type: "navigate" }, // ✅ Atualizado
    { label: "Produtos", action: "/todos-produtos", type: "navigate" },
    { label: "Produtos Infantis", action: SECTION_IDS.PRODUTOS_INFANTIS, type: "scroll" },
    { label: "Promoções Destaques", action: SECTION_IDS.PROMOCOES_DESTAQUES, type: "scroll" },
];

const SecondaryNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleItemClick = (item) => {
        if (item.type === "navigate") {
            navigate(item.action);
        } else if (item.type === "scroll") {
            if (location.pathname === "/") {
                // Já está na home, fazer scroll
                const element = document.getElementById(item.action);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                // Navegar para home e depois fazer scroll
                navigate("/");
                setTimeout(() => {
                    const element = document.getElementById(item.action);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            }
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
          <Stack direction="row" spacing={4}>
            {navItems.map((item, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  cursor: "pointer",
                  color: "#333",
                  fontWeight: 500,
                  padding: "8px 16px",
                  borderRadius: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                    color: "#0C58A3",
                  },
                }}
                onClick={() => handleItemClick(item)}
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