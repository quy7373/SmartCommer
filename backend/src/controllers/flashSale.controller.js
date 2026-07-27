import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getFlashSales = async (req, res) => {
    try {
        const flashSales = await prisma.flashSale.findMany({
            where: { isActive: true, endAt: { gt: new Date() } },
            include: { products: { include: { product: true } } }
        });
        res.json(flashSales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFlashSale = async (req, res) => {
    try {
        const { name, startAt, endAt, products } = req.body;
        const flashSale = await prisma.flashSale.create({
            data: {
                name,
                startAt: new Date(startAt),
                endAt: new Date(endAt),
                products: {
                    create: products.map(p => ({
                        productId: p.productId,
                        price: p.price,
                        stock: p.stock
                    }))
                }
            }
        });
        res.status(201).json(flashSale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};