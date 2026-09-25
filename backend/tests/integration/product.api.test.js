import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../../src/services/product.service.js', () => ({
    createProduct: vi.fn(),
    getAllProducts: vi.fn(),
    getBestSellerProducts: vi.fn(),
    getNewestProducts: vi.fn(),
    getRecommendedProducts: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
}));

import * as productService from '../../src/services/product.service.js';
import app from '../../src/app.js';

describe('Product API Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'product_integration_jwt_secret';
    });

    describe('GET endpoints (public)', () => {
        it('GET /api/products returns products list', async () => {
            productService.getAllProducts.mockResolvedValue([{ id: 'p1', name: 'Product A' }]);

            const res = await request(app).get('/api/products?categoryId=cat1');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
        });

        it('GET /api/products/best-seller returns best sellers', async () => {
            productService.getBestSellerProducts.mockResolvedValue([{ id: 'b1' }]);

            const res = await request(app).get('/api/products/best-seller');
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([{ id: 'b1' }]);
        });

        it('GET /api/products/newest returns newest products', async () => {
            productService.getNewestProducts.mockResolvedValue([{ id: 'n1' }]);

            const res = await request(app).get('/api/products/newest');
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([{ id: 'n1' }]);
        });

        it('GET /api/products/recommended returns recommended products', async () => {
            productService.getRecommendedProducts.mockResolvedValue([{ id: 'r1' }]);

            const res = await request(app).get('/api/products/recommended');
            expect(res.status).toBe(200);
            expect(res.body.data).toEqual([{ id: 'r1' }]);
        });

        it('GET /api/products/:id returns 404 if product not found', async () => {
            productService.getProductById.mockResolvedValue(null);

            const res = await request(app).get('/api/products/nonexistent');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Product not found');
        });

        it('GET /api/products/:id returns 200 with product if found', async () => {
            productService.getProductById.mockResolvedValue({ id: 'p1', name: 'Smart Watch' });

            const res = await request(app).get('/api/products/p1');
            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Smart Watch');
        });
    });

    describe('Protected product mutations', () => {
        it('POST /api/products returns 401 without auth', async () => {
            const res = await request(app).post('/api/products').send({ name: 'Sneakers' });
            expect(res.status).toBe(401);
        });

        it('POST /api/products returns 201 when authenticated as ADMIN/OWNER', async () => {
            const token = jwt.sign({ id: 'o1', role: 'OWNER' }, process.env.JWT_SECRET);
            productService.createProduct.mockResolvedValue({ id: 'p2', name: 'Sneakers' });

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Sneakers', storeId: 's1', price: 100 });

            expect(res.status).toBe(201);
            expect(res.body.data.name).toBe('Sneakers');
        });

        it('PUT /api/products/:id returns 200 on update', async () => {
            const token = jwt.sign({ id: 'admin1', role: 'ADMIN' }, process.env.JWT_SECRET);
            productService.updateProduct.mockResolvedValue({ id: 'p2', price: 120 });

            const res = await request(app)
                .put('/api/products/p2')
                .set('Authorization', `Bearer ${token}`)
                .send({ price: 120 });

            expect(res.status).toBe(200);
            expect(res.body.data.price).toBe(120);
        });

        it('DELETE /api/products/:id returns 204 on delete', async () => {
            const token = jwt.sign({ id: 'o1', role: 'OWNER' }, process.env.JWT_SECRET);
            productService.deleteProduct.mockResolvedValue();

            const res = await request(app)
                .delete('/api/products/p2')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(204);
        });
    });
});

