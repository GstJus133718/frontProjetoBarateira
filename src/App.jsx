import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './utils/store/store';
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./NavBar";
import SecondaryNavbar from "./SecondaryNavbar";
import Slider from "./Slider";
import { Box } from "@mui/material";
import Cards from "./Cards";
import Cards2 from "./Cards2";
import Promotion from "./Promotion";
import ChildrenProduct from "./ChildrenProduct";
import ContatoSection from "./ContatoSection";
import Footer from "./Footer";
import LoginAdmin from "./profile/LoginAdmin";
import AreaAdmin from "./AreaAdmin";
import SellersAdmin from "./SellersAdmin";
import CustomerAdmin from "./CustomerAdmin";
import StockAdmin from "./StockAdmin";
import PromotionArea from "./PromotionArea";
import BranchArea from "./BranchArea";
import Cart from "./Cart";
import Product from "./Product";
import HistoricoVendas from "./HistoricoVendas";
import TodosProdutos from "./TodosProdutos";

function Home() {
  return (
    <>
      <Navbar />
      <SecondaryNavbar />
      <Box sx={{ maxWidth: "1920px", margin: "0 auto", padding: 4 }}>
        <Slider />
        <Cards />
        <Box id="promocoes-destaques-section">
          <Promotion />
        </Box>
        <Cards2 />
        <Box id="produtos-infantis-section">
          <ChildrenProduct />
        </Box>
        <ContatoSection />
      </Box>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/todos-produtos" element={<TodosProdutos />} />
          <Route path="/admin" element={<LoginAdmin />} />
          
          {/* Rotas protegidas - requerem autenticação */}
          <Route path="/area-admin" element={
            <ProtectedRoute>
              <AreaAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/vendedores" element={
            <ProtectedRoute requiredRole="admin">
              <SellersAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/customer-admin" element={
            <ProtectedRoute>
              <CustomerAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/stock-admin" element={
            <ProtectedRoute>
              <StockAdmin />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/promotion-area" element={
            <ProtectedRoute>
              <PromotionArea />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/branch-area" element={
            <ProtectedRoute requiredRole="admin">
              <BranchArea />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/product/:id" element={<Product />} />
          
          <Route path="/admin/sales-area" element={
            <ProtectedRoute>
              <HistoricoVendas />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;