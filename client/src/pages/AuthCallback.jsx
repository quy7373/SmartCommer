import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('accessToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchUser = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/auth/me');
                    login(response.data.data.user);
                    navigate('/');
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    navigate('/login');
                }
            };
            fetchUser();
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, login]);

    return <div>Loading...</div>;
};

export default AuthCallback;