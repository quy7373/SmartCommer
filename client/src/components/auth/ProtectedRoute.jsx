import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth() || {};

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && (!user.role || !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase()))) return <Navigate to="/404" />;

    return children;
};

export default ProtectedRoute;