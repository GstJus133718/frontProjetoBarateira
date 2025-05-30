import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Container,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const AreaAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          boxShadow: 1
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center",}}>
          <Avatar
            src="../public/logo/logo_3.png"
            alt="A Barateira"
            variant="square"
            sx={{ width: 200, height: 115, mr: 1, }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <PersonOutlineOutlinedIcon sx={{ color: "#666", marginRight: "15px" }} />
            <Box sx={{ color: "text.secondary" }}>
              <Typography variant="body2" sx={{ m: 0 }}>Olá,</Typography>
              <Typography variant="body2" sx={{ m: 0, fontWeight: 'bold' }}>Vendedor</Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            sx={{
              borderRadius: 20,
              borderColor: "#e0e0e0",
              color: "#666",
              px: 8,
              py: 1,
            }}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 4, 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          gap: 3
        }}
      >
        {/* Carrinho */}
        <Card
          onClick={() => navigate("/admin/cart")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/cesta_icon.png"
            alt="Ícone de Carrinho"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Carrinho
          </Typography>
        </Card>

        {/* Vendedores */}
        <Card onClick={() => navigate("/admin/vendedores")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/seller_icon.png"
            alt="Ícone de Vendedores"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Vendedores
          </Typography>
        </Card>

        {/* Estoque */}
        <Card
          onClick={() => navigate("/admin/stock-admin")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/product_icon.svg"
            alt="Ícone de Estoque"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Estoque
          </Typography>
        </Card>

        {/* Promoções */}
        <Card
          onClick={() => navigate("/admin/promotion-area")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/desconto_icon.png"
            alt="Ícone de Promoções"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Promoções
          </Typography>
        </Card>

        {/* Filiais */}
        <Card
          onClick={() => navigate("/admin/branch-area")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/branch_icon.svg"
            alt="Ícone de Filiais"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Filiais
          </Typography>
        </Card>

        {/* Histórico de Vendas */}
        <Card
          onClick={() => navigate("/admin/sales-area")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/sales_icon.png"
            alt="Ícone de Histórico de Vendas"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div" align="center">
            Histórico de Vendas
          </Typography>
        </Card>

        {/* Clientes */}
        <Card
          onClick={() => navigate("/admin/customer-admin")}
          sx={{
            width: "300px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.03)",
              cursor: "pointer",
            },
          }}
        >
          <Box 
            component="img"
            src="../public/icons/customer_icon.png"
            alt="Ícone de Clientes"
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2,
              objectFit: "contain"
            }}
          />
          <Typography variant="h5" component="div">
            Clientes
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default AreaAdmin;
