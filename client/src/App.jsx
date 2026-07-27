import react from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import { HomePage } from './pages/User/HomePage';
import { ProfilePage } from './pages/User/ProfilePage';
import { SearchPage } from './pages/User/SearchPage';
import { ProductListPage } from './pages/User/ProductListPage';
import { ProductDetailPage } from './pages/User/ProductDetailPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/User/CartPage';
import CheckoutPage from './pages/User/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerOrders from './pages/owner/OwnerOrders';
import OwnerProducts from './pages/owner/OwnerProducts';
import OwnerCategories from './pages/owner/OwnerCategories';
import OwnerCustomers from './pages/owner/OwnerCustomers';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import './index.css';

function App() {
  const { user } = useAuth() || {};
  const showSidebar = ['/products'].some(path => window.location.pathname === path) || window.location.pathname.startsWith('/products/');

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={user ? <ProtectedRoute allowedRoles={['USER']}><HomePage /></ProtectedRoute> : <LandingPage />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['USER']}><ProfilePage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute allowedRoles={['USER']}><SearchPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute allowedRoles={['USER']}><ProductListPage /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute allowedRoles={['USER']}><ProductDetailPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['USER']}><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['USER']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/coupons" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminCoupons /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/owner" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/orders" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerOrders /></ProtectedRoute>} />
            <Route path="/owner/products" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerProducts /></ProtectedRoute>} />
            <Route path="/owner/categories" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerCategories /></ProtectedRoute>} />
            <Route path="/owner/customers" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerCustomers /></ProtectedRoute>} />
            <Route path="/owner/analytics" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerAnalytics /></ProtectedRoute>} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App
