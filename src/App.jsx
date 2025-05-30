import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./NavBar";
import SecondaryNavbar from "./SecondaryNavbar"; // Assumindo que você usará o corrigido
import Slider from "./Slider";
import { Box } from "@mui/material";
import Cards from "./Cards";
import Cards2 from "./Cards2";
import Promotion from "./Promotion"; // Componente PromocoesDestaques da Home
import ChildrenProduct from "./ChildrenProduct"; // Componente Produtos Infantis da Home
import ContatoSection from "./ContatoSection";
import Footer from "./Footer";
import LoginAdmin from "./LoginAdmin";
import AreaAdmin from "./AreaAdmin";
import SellersAdmin from "./SellersAdmin";
import CustomerAdmin from "./CustomerAdmin";
import StockAdmin from "./StockAdmin";
import PromotionArea from "./PromotionArea";
import BranchArea from "./BranchArea";
import Cart from "./Cart";
import Product from "./Product";
import HistoricoVendas from "./HistoricoVendas";
import TodosProdutos from "./TodosProdutos"; // <<< Importar o novo componente

// Adicionar IDs às seções na Home para permitir a rolagem
function Home() {
  return (
    <>
      <Navbar />
      <SecondaryNavbar />
      <Box sx={{ maxWidth: "1920px", margin: "0 auto", padding: 4 }}>
        <Slider />
        <Cards />
        {/* Adicionar ID à seção de Promoções */}
        <Box id="promocoes-destaques-section">
          <Promotion />
        </Box>
        <Cards2 />
        {/* Adicionar ID à seção de Produtos Infantis */}
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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos-produtos" element={<TodosProdutos />} /> {/* <<< Nova Rota */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/area-admin" element={<AreaAdmin />} />
        <Route path="/admin/vendedores" element={<SellersAdmin />} />
        <Route path="/admin/customer-admin" element={<CustomerAdmin />} />
        <Route path="/admin/stock-admin" element={<StockAdmin />} />
        <Route path="/admin/promotion-area" element={<PromotionArea />} />
        <Route path="/admin/branch-area" element={<BranchArea />} />
        <Route path="/admin/cart" element={<Cart />} />
        <Route path="/admin/product/:id" element={<Product />} />
        <Route path="/admin/sales-area" element={<HistoricoVendas />} />
      </Routes>
    </Router>
  );
}

export default App;

