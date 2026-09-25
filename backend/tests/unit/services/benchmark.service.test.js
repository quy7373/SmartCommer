import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/lib/prisma.js', () => ({
    prisma: {
        $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
        product: {
            findMany: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Prod' }]),
        },
        user: {
            findFirst: vi.fn().mockResolvedValue({ id: 'u1', email: 'test@smarte.com' }),
            findUnique: vi.fn().mockResolvedValue({ id: 'u1', email: 'test@smarte.com' }),
        },
    },
}));

vi.mock('../../../src/lib/redis.js', () => ({
    redis: {
        set: vi.fn().mockResolvedValue('OK'),
        get: vi.fn().mockResolvedValue('{"id":"p1"}'),
        del: vi.fn().mockResolvedValue(1),
    },
}));

import { prisma } from '../../../src/lib/prisma.js';
import * as benchmarkService from '../../../src/services/benchmark.service.js';

describe('benchmark.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('runCacheBenchmark should successfully calculate performance benchmarks', async () => {
        const result = await benchmarkService.runCacheBenchmark(2);

        expect(result.summary).toBeDefined();
        expect(result.tests).toHaveLength(4);
        expect(result.logs).toBeDefined();
        expect(result.authTokenLookup).toBeDefined();
    });

    it('runAsyncBenchmark should measure sequential vs parallel execution', async () => {
        const result = await benchmarkService.runAsyncBenchmark(2);

        expect(result.summary).toBeDefined();
        expect(result.tests).toHaveLength(3);
        expect(result.taskCount).toBe(2);
        expect(result.logs.length).toBeGreaterThan(0);
    });

    it('runFullBenchmarkSuite should combine cache and async benchmarks', async () => {
        const result = await benchmarkService.runFullBenchmarkSuite(2, 2);

        expect(result.cacheBenchmark).toBeDefined();
        expect(result.asyncBenchmark).toBeDefined();
        expect(result.comparisonHighlights).toBeDefined();
        expect(result.totalExecutionTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('runCacheBenchmark should throw error if warmup fails completely', async () => {
        prisma.$queryRaw.mockRejectedValue(new Error('Connection error'));

        await expect(benchmarkService.runCacheBenchmark(1)).rejects.toThrow('Database or Redis connection failed');
    });
});
