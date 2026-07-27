import { prisma } from '../lib/prisma.js';

export const createProduct = async (data, storeId) => {
    return await prisma.product.create({ data: { ...data, storeId } });
};

export const getAllProducts = async (categoryId) => {
    console.log("categoryId =", categoryId);
    const where = {};

    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { id: categoryId },
                    { slug: categoryId }
                ]
            }
        });

        if (!category) return [];

        where.categoryId = category.id;
    }

    return await prisma.product.findMany({
        where,
        include: {
            category: true
        }
    });
};

export const getBestSellerProducts = async (limit = 4) => {
    return await prisma.product.findMany({
        where: {
            status: 'ACTIVE',
            colors: {
                some: {
                    variants: {
                        some: {
                            stock: { gt: 0 }
                        }
                    }
                }
            }
        },
        orderBy: { sold: 'desc' },
        take: limit
    });
};

export const getNewestProducts = async (limit = 4) => {
    return await prisma.product.findMany({
        where: {
            status: 'ACTIVE',
            colors: {
                some: {
                    variants: {
                        some: {
                            stock: { gt: 0 }
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
    });
};

export const getRecommendedProducts = async (userId, limit = 4) => {
    if (userId) {
        const history = await prisma.searchHistory.groupBy({
            by: ['keyword'],
            where: { userId },
            _count: { keyword: true },
            orderBy: { _count: { keyword: 'desc' } },
            take: 1
        });

        if (history.length > 0) {
            const keyword = history[0].keyword;
            return await prisma.product.findMany({
                where: {
                    status: 'ACTIVE',
                    name: { contains: keyword, mode: 'insensitive' }
                },
                take: limit
            });
        }
    }

    const count = await prisma.product.count({ where: { status: 'ACTIVE' } });
    const skip = Math.max(0, Math.floor(Math.random() * (count - limit)));
    return await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        skip: skip,
        take: limit
    });
};

export const getProductById = async (id) => {
    return await prisma.product.findUnique({ where: { id } });
};

export const updateProduct = async (id, data, ownerId, role) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { store: true }
    });
    if (!product) throw new Error('Product not found');
    if (role !== 'ADMIN' && product.store.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id, ownerId, role) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { store: true }
    });
    if (!product) throw new Error('Product not found');
    if (role !== 'ADMIN' && product.store.ownerId !== ownerId) throw new Error('Forbidden');
    return await prisma.product.delete({ where: { id } });
};
