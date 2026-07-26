import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await API.get('/auth/me');
    return response.data;
};

export const logout = async () => {
    const response = await API.post('/auth/logout');
    return response.data;
};

export const refresh = async () => {
    const response = await API.post('/auth/refresh');
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await API.post('/auth/reset-password', { token, password });
    return response.data;
};

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await refresh();
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
