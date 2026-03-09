import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ReviewsPage from "./pages/ReviewsPage";
import AISearchPage from "./pages/AISearchPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import MyAccountPage from "./pages/MyAccountPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/:category/:id/reviews" element={<ReviewsPage />} />
              <Route path="/:category/:id" element={<ProductDetailPage />} />
              <Route path="/search" element={<AISearchPage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/:category" element={<CategoryPage />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
