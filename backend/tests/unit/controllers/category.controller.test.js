import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/services/category.service.js', () => ({
    createCategory: vi.fn(),
    getAllCategories: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
}));

import * as categoryService from '../../../src/services/category.service.js';
import * as categoryController from '../../../src/controllers/category.controller.js';

describe('category.controller', () => {
    let req, res, next;

    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            body: {},
            params: {},
            user: { id: 'u1', role: 'ADMIN' },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    describe('createCategory', () => {
        it('should create category and return 201', async () => {
            req.body = { name: 'Books', slug: 'books', parentId: null };
            categoryService.createCategory.mockResolvedValue({ id: 'c1', name: 'Books' });

            await categoryController.createCategory(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { id: 'c1', name: 'Books' },
            });
        });
    });

    describe('getAllCategories', () => {
        it('should return all categories with 200', async () => {
            categoryService.getAllCategories.mockResolvedValue([{ id: 'c1' }]);

            await categoryController.getAllCategories(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: [{ id: 'c1' }],
            });
        });
    });

    describe('updateCategory', () => {
        it('should update category and return 200', async () => {
            req.params = { id: 'c1' };
            req.body = { name: 'Updated Books' };
            categoryService.updateCategory.mockResolvedValue({ id: 'c1', name: 'Updated Books' });

            await categoryController.updateCategory(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { id: 'c1', name: 'Updated Books' },
            });
        });
    });

    describe('deleteCategory', () => {
        it('should delete category and return 204', async () => {
            req.params = { id: 'c1' };
            await categoryController.deleteCategory(req, res, next);
            expect(categoryService.deleteCategory).toHaveBeenCalledWith('c1', 'u1', 'ADMIN');
            expect(res.status).toHaveBeenCalledWith(204);
        });
    });
});

