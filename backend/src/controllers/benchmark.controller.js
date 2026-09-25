import {
    runCacheBenchmark,
    runAsyncBenchmark,
    runFullBenchmarkSuite
} from '../services/benchmark.service.js';

export const handleCacheBenchmark = async (req, res, next) => {
    try {
        const iterations = parseInt(req.body?.iterations || req.query?.iterations || 10, 10);
        const result = await runCacheBenchmark(iterations);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const handleAsyncBenchmark = async (req, res, next) => {
    try {
        const count = parseInt(req.body?.count || req.query?.count || 10, 10);
        const result = await runAsyncBenchmark(count);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const handleFullBenchmark = async (req, res, next) => {
    try {
        const iterations = parseInt(req.body?.iterations || req.query?.iterations || 10, 10);
        const count = parseInt(req.body?.count || req.query?.count || 10, 10);
        const result = await runFullBenchmarkSuite(iterations, count);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
