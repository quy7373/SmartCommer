import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/services/product.service.js', () => ({
    createProduct: vi.fn(),
    getAllProducts: vi.fn(),
    getBestSellerProducts: vi.fn(),
    getNewestProducts: vi.fn(),
    getRecommendedProducts: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
}));

import * as productService from '../../../src/services/product.service.js';
import * as productController from '../../../src/controllers/product.controller.js';

describe('product.controller', () => {
    let req, res, next;

    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            body: {},
            query: {},
            params: {},
            user: { id: 'o1', role: 'OWNER' },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    describe('createProduct', () => {
        it('should create product and return 201', async () => {
            req.body = { name: 'Chair', storeId: 's1', price: 50 };
            productService.createProduct.mockResolvedValue({ id: 'p1', name: 'Chair' });

            await productController.createProduct(req, res, next);
            expect(productService.createProduct).toHaveBeenCalledWith({ name: 'Chair', price: 50 }, 's1');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'p1', name: 'Chair' } });
        });
    });

    describe('getAllProducts', () => {
        it('should get all products and return 200', async () => {
            req.query = { categoryId: 'cat_1' };
            productService.getAllProducts.mockResolvedValue([{ id: 'p1' }]);

            await productController.getAllProducts(req, res, next);
            expect(productService.getAllProducts).toHaveBeenCalledWith('cat_1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'p1' }] });
        });
    });

    describe('getBestSellerProducts', () => {
        it('should return best seller products', async () => {
            productService.getBestSellerProducts.mockResolvedValue([{ id: 'b1' }]);
            await productController.getBestSellerProducts(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'b1' }] });
        });
    });

    describe('getNewestProducts', () => {
        it('should return newest products', async () => {
            productService.getNewestProducts.mockResolvedValue([{ id: 'n1' }]);
            await productController.getNewestProducts(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'n1' }] });
        });
    });

    describe('getRecommendedProducts', () => {
        it('should return recommended products using user id if logged in', async () => {
            productService.getRecommendedProducts.mockResolvedValue([{ id: 'r1' }]);
            await productController.getRecommendedProducts(req, res, next);
            expect(productService.getRecommendedProducts).toHaveBeenCalledWith('o1');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return recommended products using null if user not logged in', async () => {
            req.user = null;
            productService.getRecommendedProducts.mockResolvedValue([{ id: 'r2' }]);
            await productController.getRecommendedProducts(req, res, next);
            expect(productService.getRecommendedProducts).toHaveBeenCalledWith(null);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getProductById', () => {
        it('should return 404 if product not found', async () => {
            req.params = { id: 'unknown' };
            productService.getProductById.mockResolvedValue(null);

            await productController.getProductById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Product not found' });
        });

        it('should return 200 with product data when found', async () => {
            req.params = { id: 'p1' };
            productService.getProductById.mockResolvedValue({ id: 'p1', name: 'Item' });

            await productController.getProductById(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'p1', name: 'Item' } });
        });
    });

    describe('updateProduct', () => {
        it('should update product and return 200', async () => {
            req.params = { id: 'p1' };
            req.body = { price: 99 };
            productService.updateProduct.mockResolvedValue({ id: 'p1', price: 99 });

            await productController.updateProduct(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'p1', price: 99 } });
        });
    });

    describe('deleteProduct', () => {
        it('should delete product and return 204', async () => {
            req.params = { id: 'p1' };
            await productController.deleteProduct(req, res, next);
            expect(productService.deleteProduct).toHaveBeenCalledWith('p1', 'o1', 'OWNER');
            expect(res.status).toHaveBeenCalledWith(204);
        });
    });
});

