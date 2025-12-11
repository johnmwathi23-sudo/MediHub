import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAdmin } = useAuth();
    if (!user || !isAdmin) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">About Us</h1><p>We are MediHub.</p></div>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            </Routes>
        </Layout>
    )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;