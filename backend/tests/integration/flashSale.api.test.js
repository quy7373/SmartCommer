import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
    mockPrisma: {
        flashSale: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('@prisma/client', () => ({
    PrismaClient: class {
        constructor() {
            return mockPrisma;
        }
    },
}));

import app from '../../src/app.js';

describe('FlashSale API Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/flash-sales', () => {
        it('should return list of flash sales', async () => {
            mockPrisma.flashSale.findMany.mockResolvedValue([
                { id: 'fs1', name: 'Weekend Flash Sale', products: [] },
            ]);

            const res = await request(app).get('/api/flash-sales');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                { id: 'fs1', name: 'Weekend Flash Sale', products: [] },
            ]);
        });
    });

    describe('POST /api/flash-sales', () => {
        it('should create flash sale and return 201', async () => {
            const newSale = {
                name: 'Mega Flash Sale',
                startAt: '2026-10-01T00:00:00Z',
                endAt: '2026-10-02T00:00:00Z',
                products: [{ productId: 'p1', price: 90, stock: 5 }],
            };
            mockPrisma.flashSale.create.mockResolvedValue({ id: 'fs2', ...newSale });

            const res = await request(app).post('/api/flash-sales').send(newSale);
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Mega Flash Sale');
        });
    });
});

