import React from "react";
import { Box, Container, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/hook/useAuth";
import UserHeader from "./profile/userHeader";

function AreaAdmin() {
  const navigate = useNavigate();
  const { user, userRole, isAdmin, isFuncionario } = useAuth();

  // Definir cards baseado na role do usuário
  const getAvailableCards = () => {
    const baseCards = [
      {
        title: "Carrinho",
        icon: "../public/icons/cesta_icon.png",
        route: "/admin/cart",
        description: "Gerenciar vendas",
        allowedRoles: ['admin', 'funcionario']
      },
      {
        title: "Clientes",
        icon: "../public/icons/customer_icon.png",
        route: "/admin/customer-admin",
        description: "Gerenciar clientes",
        allowedRoles: ['admin', 'funcionario']
      },
      {
        title: "Estoque",
        icon: "../public/icons/stock_icon.png",
        route: "/admin/stock-admin",
        description: "Gerenciar produtos",
        allowedRoles: ['admin', 'funcionario']
      },
      {
        title: "Promoções",
        icon: "../public/icons/promotion_icon.png",
        route: "/admin/promotion-area",
        description: "Gerenciar promoções",
        allowedRoles: ['admin', 'funcionario']
      },
      {
        title: "Relatório de Vendas",
        icon: "../public/icons/sales_icon.png",
        route: "/admin/sales-area",
        description: "Histórico de vendas",
        allowedRoles: ['admin', 'funcionario']
      },
      {
        title: "Funcionários",
        icon: "../public/icons/sellers_icon.png",
        route: "/admin/vendedores",
        description: "Gerenciar vendedores",
        allowedRoles: ['admin'] // Apenas admin
      },
      {
        title: "Filiais",
        icon: "../public/icons/branch_icon.png",
        route: "/admin/branch-area",
        description: "Gerenciar filiais",
        allowedRoles: ['admin'] // Apenas admin
      }
    ];

    // Filtrar cards baseado na role do usuário
    return baseCards.filter(card => 
      card.allowedRoles.includes(userRole)
    );
  };

  const availableCards = getAvailableCards();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <UserHeader />

      {/* Welcome Message */}
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Área Administrativa
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo, {user?.email?.split('@')[0] || 'usuário'}! 
          {isAdmin() && ' Você tem acesso total ao sistema.'}
          {isFuncionario() && ' Você tem acesso às funcionalidades de venda.'}
        </Typography>
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
        {availableCards.map((card, index) => (
          <Card
            key={index}
            onClick={() => navigate(card.route)}
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
              src={card.icon}
              alt={`Ícone de ${card.title}`}
              sx={{ 
                width: 80, 
                height: 80, 
                mb: 2,
                objectFit: "contain"
              }}
            />
            <Typography
              variant="h6"
              component="h2"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
                mb: 1
              }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                px: 2
              }}
            >
              {card.description}
            </Typography>
          </Card>
        ))}
      </Container>

      {/* Role-specific information */}
      {isAdmin() && (
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="primary">
            💼 Acesso de Administrador - Você pode gerenciar vendedores e filiais
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AreaAdmin;