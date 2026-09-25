import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrismaInstance } = vi.hoisted(() => {
    return {
        mockPrismaInstance: {
            flashSale: {
                findMany: vi.fn(),
                create: vi.fn(),
            },
        },
    };
});

vi.mock('@prisma/client', () => {
    return {
        PrismaClient: class {
            constructor() {
                return mockPrismaInstance;
            }
        },
    };
});

import * as flashSaleController from '../../../src/controllers/flashSale.controller.js';

describe('flashSale.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { body: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    describe('getFlashSales', () => {
        it('should return active flash sales', async () => {
            mockPrismaInstance.flashSale.findMany.mockResolvedValue([{ id: 'fs1', name: 'Mega Sale' }]);

            await flashSaleController.getFlashSales(req, res);
            expect(res.json).toHaveBeenCalledWith([{ id: 'fs1', name: 'Mega Sale' }]);
        });

        it('should return 500 when error thrown', async () => {
            mockPrismaInstance.flashSale.findMany.mockRejectedValue(new Error('DB failure'));

            await flashSaleController.getFlashSales(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'DB failure' });
        });
    });

    describe('createFlashSale', () => {
        it('should create flash sale and return 201', async () => {
            req.body = {
                name: 'Black Friday',
                startAt: '2026-11-20T00:00:00Z',
                endAt: '2026-11-21T00:00:00Z',
                products: [{ productId: 'p1', price: 50, stock: 10 }],
            };
            const created = { id: 'fs2', name: 'Black Friday' };
            mockPrismaInstance.flashSale.create.mockResolvedValue(created);

            await flashSaleController.createFlashSale(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(created);
        });

        it('should return 500 on create error', async () => {
            req.body = { name: 'Fail Sale', startAt: '2026-01-01', endAt: '2026-01-02', products: [] };
            mockPrismaInstance.flashSale.create.mockRejectedValue(new Error('Validation fail'));

            await flashSaleController.createFlashSale(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation fail' });
        });
    });
});
