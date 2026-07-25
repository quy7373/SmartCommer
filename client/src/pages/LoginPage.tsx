import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
