/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
// Đã thêm useAuth vào dòng import dưới đây
import { AuthProvider, useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  // Redirect admin to /admin if they try to access customer routes
  if (isAdmin && !isAdminRoute) {
    return <Navigate to="/admin" replace />;
  }

  // Hide Navbar and Footer for admin routes
  const showCustomerLayout = !isAdminRoute;

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-primary/20">
      {showCustomerLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      {showCustomerLayout && <Footer />}
      {showCustomerLayout && <Chatbot />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}