import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ScrollToTop from "./components/layout/ScrollToTop";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/:category/:id" element={<ProductDetailPage />} />
        <Route path="/:category" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
