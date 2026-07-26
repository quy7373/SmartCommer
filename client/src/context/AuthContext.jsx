import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as logoutApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data.data.user);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
            }
        };
        if (localStorage.getItem('user')) {
            fetchUser();
        }
    }, []);

    const login = (userData, accessToken) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);