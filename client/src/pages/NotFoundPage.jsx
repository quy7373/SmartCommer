import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
    const { logout } = useAuth() || {};
    const handleGoHome = () => {
        if (logout) logout();
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-4">The page you are looking for does not exist.</p>
            <Link to="/login" onClick={handleGoHome} className="text-blue-500 hover:underline">Go back home</Link>
        </div>
    );
};

export default NotFoundPage;