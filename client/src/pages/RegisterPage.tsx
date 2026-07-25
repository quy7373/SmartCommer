import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
