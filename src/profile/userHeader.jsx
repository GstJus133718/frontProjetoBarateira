import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useAuth } from '../utils/hook/useAuth';
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const { user, logout, userRole, isAdmin, isFuncionario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    // Se tiver um nome completo no user, usar ele
    if (user.nome) return user.nome;
    
    // Caso contrário, usar o email ou role
    return user.email?.split('@')[0] || 'Usuário';
  };

  const getRoleDisplayName = () => {
    if (isAdmin()) return 'Administrador';
    if (isFuncionario()) return 'Funcionário';
    return userRole || 'Usuário';
  };

  return (
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
        src="../public/logo/logo_3.png"
        alt="A Barateira"
        variant="square"
        sx={{ width: 200, height: 115 }}
      />
      
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <PersonOutlineOutlinedIcon sx={{ color: "#666", mr: 1 }} />
        <Box sx={{ mr: 3 }}>
          <Typography variant="body2" sx={{ margin: 0 }}>
            Olá,
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontWeight: 'bold' }}>
            {getUserDisplayName()}
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: '0.8rem', color: 'text.secondary' }}>
            {getRoleDisplayName()}
          </Typography>
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
  );
};

export default UserHeader;