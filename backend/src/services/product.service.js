import { prisma } from '../lib/prisma.js';

export const createProduct = async (data, storeId) => {
    return await prisma.product.create({ data: { ...data, storeId } });
};

export const getAllProducts = async () => {
    return await prisma.product.findMany();
};

export const getProductById = async (id) => {
    return await prisma.product.findUnique({ where: { id } });
};

export const updateProduct = async (id, data, ownerId, role) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');
    if (role !== 'ADMIN' && product.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id, ownerId, role) => {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');
    if (role !== 'ADMIN' && product.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.product.delete({ where: { id } });
};