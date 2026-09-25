import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/services/benchmark.service.js', () => ({
    runCacheBenchmark: vi.fn(),
    runAsyncBenchmark: vi.fn(),
    runFullBenchmarkSuite: vi.fn(),
}));

import * as benchmarkService from '../../src/services/benchmark.service.js';
import app from '../../src/app.js';

describe('Benchmark API Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET & POST /api/benchmark/cache', () => {
        it('should execute cache benchmark on GET and return 200', async () => {
            benchmarkService.runCacheBenchmark.mockResolvedValue({ cacheHitRate: 98 });

            const res = await request(app).get('/api/benchmark/cache?iterations=15');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.cacheHitRate).toBe(98);
        });

        it('should execute cache benchmark on POST and return 200', async () => {
            benchmarkService.runCacheBenchmark.mockResolvedValue({ cacheHitRate: 95 });

            const res = await request(app).post('/api/benchmark/cache').send({ iterations: 20 });
            expect(res.status).toBe(200);
            expect(res.body.data.cacheHitRate).toBe(95);
        });
    });

    describe('GET & POST /api/benchmark/async', () => {
        it('should execute async benchmark on GET and return 200', async () => {
            benchmarkService.runAsyncBenchmark.mockResolvedValue({ totalJobs: 50 });

            const res = await request(app).get('/api/benchmark/async?count=50');
            expect(res.status).toBe(200);
            expect(res.body.data.totalJobs).toBe(50);
        });

        it('should execute async benchmark on POST and return 200', async () => {
            benchmarkService.runAsyncBenchmark.mockResolvedValue({ totalJobs: 30 });

            const res = await request(app).post('/api/benchmark/async').send({ count: 30 });
            expect(res.status).toBe(200);
            expect(res.body.data.totalJobs).toBe(30);
        });
    });

    describe('GET & POST /api/benchmark/full', () => {
        it('should execute full benchmark suite and return 200', async () => {
            benchmarkService.runFullBenchmarkSuite.mockResolvedValue({ summary: 'all passed' });

            const res = await request(app).get('/api/benchmark/full?iterations=10&count=10');
            expect(res.status).toBe(200);
            expect(res.body.data.summary).toBe('all passed');
        });
    });
});

