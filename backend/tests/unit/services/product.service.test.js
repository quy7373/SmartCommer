import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/lib/prisma.js', () => ({
    prisma: {
        product: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            count: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        category: {
            findFirst: vi.fn(),
        },
        searchHistory: {
            groupBy: vi.fn(),
        },
    },
}));

import { prisma } from '../../../src/lib/prisma.js';
import * as productService from '../../../src/services/product.service.js';

describe('product.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create product with data and storeId', async () => {
            const productData = { name: 'iPhone 15', price: 999 };
            const created = { id: 'p1', ...productData, storeId: 's1' };
            prisma.product.create.mockResolvedValue(created);

            const result = await productService.createProduct(productData, 's1');
            expect(prisma.product.create).toHaveBeenCalledWith({
                data: { ...productData, storeId: 's1' },
            });
            expect(result).toEqual(created);
        });
    });

    describe('getAllProducts', () => {
        it('should return all products when no categoryId passed', async () => {
            prisma.product.findMany.mockResolvedValue([{ id: 'p1' }]);

            const result = await productService.getAllProducts();
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: {},
                include: { category: true },
            });
            expect(result).toHaveLength(1);
        });

        it('should filter by categoryId if category exists', async () => {
            prisma.category.findFirst.mockResolvedValue({ id: 'c1', name: 'Phones' });
            prisma.product.findMany.mockResolvedValue([{ id: 'p1', categoryId: 'c1' }]);

            const result = await productService.getAllProducts('c1');
            expect(prisma.category.findFirst).toHaveBeenCalledWith({
                where: { OR: [{ id: 'c1' }, { slug: 'c1' }] },
            });
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: { categoryId: 'c1' },
                include: { category: true },
            });
            expect(result).toHaveLength(1);
        });

        it('should return empty array if category does not exist', async () => {
            prisma.category.findFirst.mockResolvedValue(null);

            const result = await productService.getAllProducts('non-existent');
            expect(result).toEqual([]);
            expect(prisma.product.findMany).not.toHaveBeenCalled();
        });
    });

    describe('getBestSellerProducts', () => {
        it('should fetch best seller active products with stock > 0', async () => {
            prisma.product.findMany.mockResolvedValue([{ id: 'p1', sold: 100 }]);

            const result = await productService.getBestSellerProducts(5);
            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ status: 'ACTIVE' }),
                    orderBy: { sold: 'desc' },
                    take: 5,
                })
            );
            expect(result).toHaveLength(1);
        });
    });

    describe('getNewestProducts', () => {
        it('should fetch newest active products with stock > 0', async () => {
            prisma.product.findMany.mockResolvedValue([{ id: 'p2' }]);

            const result = await productService.getNewestProducts(4);
            expect(prisma.product.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ status: 'ACTIVE' }),
                    orderBy: { createdAt: 'desc' },
                    take: 4,
                })
            );
            expect(result).toHaveLength(1);
        });
    });

    describe('getRecommendedProducts', () => {
        it('should recommend products based on user search history keyword', async () => {
            prisma.searchHistory.groupBy.mockResolvedValue([{ keyword: 'laptop', _count: { keyword: 5 } }]);
            prisma.product.findMany.mockResolvedValue([{ id: 'p1', name: 'MacBook Laptop' }]);

            const result = await productService.getRecommendedProducts('u1', 4);
            expect(prisma.searchHistory.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 'u1' } })
            );
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: {
                    status: 'ACTIVE',
                    name: { contains: 'laptop', mode: 'insensitive' },
                },
                take: 4,
            });
            expect(result).toHaveLength(1);
        });

        it('should recommend random active products when no user or no history', async () => {
            prisma.product.count.mockResolvedValue(10);
            prisma.product.findMany.mockResolvedValue([{ id: 'p1' }, { id: 'p2' }]);

            const result = await productService.getRecommendedProducts(null, 2);
            expect(prisma.product.count).toHaveBeenCalledWith({ where: { status: 'ACTIVE' } });
            expect(prisma.product.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });
    });

    describe('getProductById', () => {
        it('should return product by id', async () => {
            prisma.product.findUnique.mockResolvedValue({ id: 'p1', name: 'Product 1' });
            const result = await productService.getProductById('p1');
            expect(result).toEqual({ id: 'p1', name: 'Product 1' });
        });
    });

    describe('updateProduct', () => {
        it('should throw if product not found', async () => {
            prisma.product.findUnique.mockResolvedValue(null);
            await expect(productService.updateProduct('p99', {}, 'o1', 'OWNER')).rejects.toThrow('Product not found');
        });

        it('should throw Forbidden if caller is not owner or ADMIN', async () => {
            prisma.product.findUnique.mockResolvedValue({
                id: 'p1',
                store: { ownerId: 'other_owner' },
            });
            await expect(productService.updateProduct('p1', {}, 'o1', 'OWNER')).rejects.toThrow('Forbidden');
        });

        it('should update product if caller is store owner or ADMIN', async () => {
            prisma.product.findUnique.mockResolvedValue({
                id: 'p1',
                store: { ownerId: 'o1' },
            });
            prisma.product.update.mockResolvedValue({ id: 'p1', name: 'New Name' });

            const result = await productService.updateProduct('p1', { name: 'New Name' }, 'o1', 'OWNER');
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'p1' },
                data: { name: 'New Name' },
            });
            expect(result.name).toBe('New Name');
        });
    });

    describe('deleteProduct', () => {
        it('should throw if product not found', async () => {
            prisma.product.findUnique.mockResolvedValue(null);
            await expect(productService.deleteProduct('p99', 'o1', 'OWNER')).rejects.toThrow('Product not found');
        });

        it('should delete product when owner matches', async () => {
            prisma.product.findUnique.mockResolvedValue({
                id: 'p1',
                store: { ownerId: 'o1' },
            });
            prisma.product.delete.mockResolvedValue({ id: 'p1' });

            await productService.deleteProduct('p1', 'o1', 'OWNER');
            expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
        });
    });
});

