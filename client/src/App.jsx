import react from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './index.css';

function App() {
  const { user } = useAuth() || {};
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(path => window.location.pathname.startsWith(path));

  return (
    <div className="flex">
      {user && !isAuthPage && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
