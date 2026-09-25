import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../../src/services/category.service.js', () => ({
    createCategory: vi.fn(),
    getAllCategories: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
}));

import * as categoryService from '../../src/services/category.service.js';
import app from '../../src/app.js';

describe('Category API Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'category_integration_jwt_secret';
    });

    describe('GET /api/categories', () => {
        it('should allow public access and return categories', async () => {
            const categories = [{ id: 'c1', name: 'Electronics' }, { id: 'c2', name: 'Clothing' }];
            categoryService.getAllCategories.mockResolvedValue(categories);

            const res = await request(app).get('/api/categories');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(categories);
        });
    });

    describe('POST /api/categories', () => {
        it('should return 401 when no token is provided', async () => {
            const res = await request(app)
                .post('/api/categories')
                .send({ name: 'Furniture', slug: 'furniture' });

            expect(res.status).toBe(401);
        });

        it('should return 403 when user does not have ADMIN or OWNER role', async () => {
            const token = jwt.sign({ id: 'u1', role: 'USER' }, process.env.JWT_SECRET);

            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Furniture', slug: 'furniture' });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Forbidden');
        });

        it('should return 201 when called by OWNER or ADMIN', async () => {
            const token = jwt.sign({ id: 'o1', role: 'OWNER' }, process.env.JWT_SECRET);
            categoryService.createCategory.mockResolvedValue({ id: 'c3', name: 'Furniture', slug: 'furniture' });

            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Furniture', slug: 'furniture' });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe('Furniture');
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should return 200 when updated by ADMIN', async () => {
            const token = jwt.sign({ id: 'admin1', role: 'ADMIN' }, process.env.JWT_SECRET);
            categoryService.updateCategory.mockResolvedValue({ id: 'c3', name: 'Home Furniture' });

            const res = await request(app)
                .put('/api/categories/c3')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Home Furniture' });

            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Home Furniture');
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('should return 204 when deleted by OWNER', async () => {
            const token = jwt.sign({ id: 'o1', role: 'OWNER' }, process.env.JWT_SECRET);
            categoryService.deleteCategory.mockResolvedValue();

            const res = await request(app)
                .delete('/api/categories/c3')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(204);
        });
    });
});

