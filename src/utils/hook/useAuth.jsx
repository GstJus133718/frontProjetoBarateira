import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  loginUser,
  logoutUser,
  clearError,
  clearAuth,
  initializeAuth,
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from '../store/AuthSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);

  // Inicializar autenticação ao carregar o hook
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const clear = () => {
    dispatch(clearAuth());
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // Verificar se o usuário tem uma role específica
  const hasRole = (role) => {
    return userRole === role;
  };

  // Verificar se o usuário é admin
  const isAdmin = () => {
    return userRole === 'admin';
  };

  // Verificar se o usuário é vendedor
  const isFuncionario = () => {
    return userRole === 'funcionario';
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    loading,
    error,
    userRole,
    
    // Ações
    login,
    logout,
    clear,
    clearErrorMessage,
    
    // Utilitários
    hasRole,
    isAdmin,
    isFuncionario,
  };
};