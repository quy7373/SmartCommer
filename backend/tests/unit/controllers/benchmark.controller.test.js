import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/services/benchmark.service.js', () => ({
    runCacheBenchmark: vi.fn(),
    runAsyncBenchmark: vi.fn(),
    runFullBenchmarkSuite: vi.fn(),
}));

import * as benchmarkService from '../../../src/services/benchmark.service.js';
import * as benchmarkController from '../../../src/controllers/benchmark.controller.js';

describe('benchmark.controller', () => {
    let req, res, next;

    beforeEach(() => {
        vi.clearAllMocks();
        req = { body: {}, query: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    describe('handleCacheBenchmark', () => {
        it('should run cache benchmark with parsed iterations', async () => {
            req.query = { iterations: '25' };
            benchmarkService.runCacheBenchmark.mockResolvedValue({ redis: 'fast' });

            await benchmarkController.handleCacheBenchmark(req, res, next);
            expect(benchmarkService.runCacheBenchmark).toHaveBeenCalledWith(25);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { redis: 'fast' } });
        });

        it('should forward errors to next', async () => {
            benchmarkService.runCacheBenchmark.mockRejectedValue(new Error('Benchmark failed'));
            await benchmarkController.handleCacheBenchmark(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('handleAsyncBenchmark', () => {
        it('should run async benchmark with parsed count', async () => {
            req.body = { count: '15' };
            benchmarkService.runAsyncBenchmark.mockResolvedValue({ duration: 120 });

            await benchmarkController.handleAsyncBenchmark(req, res, next);
            expect(benchmarkService.runAsyncBenchmark).toHaveBeenCalledWith(15);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { duration: 120 } });
        });
    });

    describe('handleFullBenchmark', () => {
        it('should run full benchmark suite with iterations and count', async () => {
            req.query = { iterations: '5', count: '8' };
            benchmarkService.runFullBenchmarkSuite.mockResolvedValue({ all: 'completed' });

            await benchmarkController.handleFullBenchmark(req, res, next);
            expect(benchmarkService.runFullBenchmarkSuite).toHaveBeenCalledWith(5, 8);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { all: 'completed' } });
        });
    });
});

