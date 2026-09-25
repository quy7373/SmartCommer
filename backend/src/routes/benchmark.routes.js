import { Router } from 'express';
import {
    handleCacheBenchmark,
    handleAsyncBenchmark,
    handleFullBenchmark
} from '../controllers/benchmark.controller.js';

const router = Router();

router.post('/cache', handleCacheBenchmark);
router.get('/cache', handleCacheBenchmark);

router.post('/async', handleAsyncBenchmark);
router.get('/async', handleAsyncBenchmark);

router.post('/full', handleFullBenchmark);
router.get('/full', handleFullBenchmark);

export default router;
