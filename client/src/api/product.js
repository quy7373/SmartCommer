import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getFlashSales = () => axios.get(`${API_URL}/flash-sales`);
export const getBestSellerProducts = () => axios.get(`${API_URL}/products/best-seller`);
export const getNewestProducts = () => axios.get(`${API_URL}/products/newest`);
export const getRecommendedProducts = (token) => axios.get(`${API_URL}/products/recommended`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getProducts = (categoryId) => axios.get(`${API_URL}/products`, {
    params: categoryId ? { categoryId } : {}
});
