import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/lib/prisma.js', () => ({
    prisma: {
        category: {
            create: vi.fn(),
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

import { prisma } from '../../../src/lib/prisma.js';
import * as categoryService from '../../../src/services/category.service.js';

describe('category.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const mockCategory = { id: 'c1', name: 'Electronics', slug: 'electronics', ownerId: 'o1', parentId: null };
            prisma.category.create.mockResolvedValue(mockCategory);

            const result = await categoryService.createCategory('Electronics', 'electronics', 'o1');
            expect(prisma.category.create).toHaveBeenCalledWith({
                data: { name: 'Electronics', slug: 'electronics', ownerId: 'o1', parentId: null },
            });
            expect(result).toEqual(mockCategory);
        });
    });

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            const mockList = [{ id: 'c1', name: 'Phones' }];
            prisma.category.findMany.mockResolvedValue(mockList);

            const result = await categoryService.getAllCategories();
            expect(result).toEqual(mockList);
            expect(prisma.category.findMany).toHaveBeenCalled();
        });
    });

    describe('updateCategory', () => {
        it('should throw if category not found', async () => {
            prisma.category.findUnique.mockResolvedValue(null);
            await expect(categoryService.updateCategory('c99', 'New Name', 'o1', 'OWNER')).rejects.toThrow('Category not found');
        });

        it('should throw Forbidden if caller is not ADMIN and not the owner', async () => {
            prisma.category.findUnique.mockResolvedValue({ id: 'c1', ownerId: 'o1' });
            await expect(categoryService.updateCategory('c1', 'New Name', 'o2', 'OWNER')).rejects.toThrow('Forbidden');
        });

        it('should update category if caller is owner', async () => {
            prisma.category.findUnique.mockResolvedValue({ id: 'c1', ownerId: 'o1' });
            prisma.category.update.mockResolvedValue({ id: 'c1', name: 'Updated Name' });

            const result = await categoryService.updateCategory('c1', 'Updated Name', 'o1', 'OWNER');
            expect(prisma.category.update).toHaveBeenCalledWith({
                where: { id: 'c1' },
                data: { name: 'Updated Name' },
            });
            expect(result.name).toBe('Updated Name');
        });

        it('should update category if caller is ADMIN even if not the owner', async () => {
            prisma.category.findUnique.mockResolvedValue({ id: 'c1', ownerId: 'o1' });
            prisma.category.update.mockResolvedValue({ id: 'c1', name: 'Admin Edited' });

            const result = await categoryService.updateCategory('c1', 'Admin Edited', 'admin_id', 'ADMIN');
            expect(result.name).toBe('Admin Edited');
        });
    });

    describe('deleteCategory', () => {
        it('should throw if category not found', async () => {
            prisma.category.findUnique.mockResolvedValue(null);
            await expect(categoryService.deleteCategory('c99', 'o1', 'OWNER')).rejects.toThrow('Category not found');
        });

        it('should throw Forbidden if caller is not owner and not ADMIN', async () => {
            prisma.category.findUnique.mockResolvedValue({ id: 'c1', ownerId: 'o1' });
            await expect(categoryService.deleteCategory('c1', 'wrong_user', 'OWNER')).rejects.toThrow('Forbidden');
        });

        it('should delete category if caller is ADMIN or owner', async () => {
            prisma.category.findUnique.mockResolvedValue({ id: 'c1', ownerId: 'o1' });
            prisma.category.delete.mockResolvedValue({ id: 'c1' });

            await categoryService.deleteCategory('c1', 'o1', 'OWNER');
            expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
        });
    });
});

