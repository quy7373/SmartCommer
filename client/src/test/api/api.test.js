import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getCategories } from '../../api/categories';
import {
    getFlashSales,
    getBestSellerProducts,
    getNewestProducts,
    getRecommendedProducts,
    getProducts,
} from '../../api/product';
import {
    runCacheBenchmark,
    runAsyncBenchmark,
    runFullBenchmark,
} from '../../api/benchmark';

vi.mock('axios');

describe('Client API Modules', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('categories.js', () => {
        it('getCategories should call GET and return response.data.data', async () => {
            axios.get.mockResolvedValue({ data: { data: [{ id: 'c1', name: 'Shoes' }] } });

            const result = await getCategories();
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/categories');
            expect(result).toEqual([{ id: 'c1', name: 'Shoes' }]);
        });
    });

    describe('product.js', () => {
        it('calls getFlashSales', async () => {
            axios.get.mockResolvedValue({ data: [] });
            await getFlashSales();
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/flash-sales');
        });

        it('calls getBestSellerProducts', async () => {
            axios.get.mockResolvedValue({ data: [] });
            await getBestSellerProducts();
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products/best-seller');
        });

        it('calls getNewestProducts', async () => {
            axios.get.mockResolvedValue({ data: [] });
            await getNewestProducts();
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products/newest');
        });

        it('calls getRecommendedProducts with auth token', async () => {
            axios.get.mockResolvedValue({ data: [] });
            await getRecommendedProducts('mock_token_jwt');
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products/recommended', {
                headers: { Authorization: 'Bearer mock_token_jwt' },
            });
        });

        it('calls getProducts with categoryId param if provided', async () => {
            axios.get.mockResolvedValue({ data: [] });
            await getProducts('cat_123');
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/products', {
                params: { categoryId: 'cat_123' },
            });
        });
    });

    describe('benchmark.js', () => {
        it('calls runCacheBenchmark with iterations', async () => {
            axios.post.mockResolvedValue({ data: { success: true } });
            await runCacheBenchmark(25);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/benchmark/cache', {
                iterations: 25,
            });
        });

        it('calls runAsyncBenchmark with count', async () => {
            axios.post.mockResolvedValue({ data: { success: true } });
            await runAsyncBenchmark(15);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/benchmark/async', {
                count: 15,
            });
        });

        it('calls runFullBenchmark with iterations and count', async () => {
            axios.post.mockResolvedValue({ data: { success: true } });
            await runFullBenchmark(12, 18);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/benchmark/full', {
                iterations: 12,
                count: 18,
            });
        });
    });
});

