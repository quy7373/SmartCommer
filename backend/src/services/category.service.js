import { prisma } from '../lib/prisma.js';

export const createCategory = async (name, slug, ownerId, parentId = null) => {
    return await prisma.category.create({ data: { name, slug, ownerId, parentId } });
};

export const getAllCategories = async () => {
    return await prisma.category.findMany();
};

export const updateCategory = async (id, name, ownerId, role) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error('Category not found');
    if (role !== 'ADMIN' && category.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.category.update({ where: { id }, data: { name } });
};

export const deleteCategory = async (id, ownerId, role) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error('Category not found');
    if (role !== 'ADMIN' && category.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.category.delete({ where: { id } });
};