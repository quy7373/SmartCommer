import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

const memoryCache = new Map();

const simulatedIoTask = (id, delayMs = 150) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Result of task ${id}`);
        }, delayMs);
    });
};

/**
 * Executes Cache Performance Benchmark (benchmark.js logic)
 * Compares: No Cache (PostgreSQL), Cache Miss, Redis Cache Hit, In-Memory RAM Cache, Refresh Token Lookup
 */
export async function runCacheBenchmark(iterations = 10) {
    const logs = [];
    const addLog = (msg) => logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);

    addLog('🚀 Starting Cache Performance Benchmark (benchmark.js)...');

    // Warmup DB & Redis
    let connected = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            await redis.set('benchmark_ping', 'pong', { ex: 30 });
            connected = true;
            addLog('✅ Connected to Neon PostgreSQL DB & Upstash Redis.');
            break;
        } catch (err) {
            addLog(`⚠️ Attempt ${attempt} connection failed: ${err.message}`);
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    if (!connected) {
        throw new Error('Database or Redis connection failed');
    }

    const testKey = 'cache_benchmark:products_all';

    // TEST 1: WITHOUT CACHE (Neon PostgreSQL)
    addLog(`🔹 Running Test 1: WITHOUT CACHE (Direct Neon DB Query x ${iterations})...`);
    const noCacheTimes = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        const products = await prisma.product.findMany({
            take: 20,
            include: { category: true }
        });
        const duration = performance.now() - start;
        noCacheTimes.push(duration);
    }

    const avgNoCache = noCacheTimes.reduce((a, b) => a + b, 0) / iterations;
    const minNoCache = Math.min(...noCacheTimes);
    const maxNoCache = Math.max(...noCacheTimes);

    // Clean prior cache key
    await redis.del(testKey);

    // TEST 2: CACHE MISS (DB Query + Write to Redis)
    addLog('🔹 Running Test 2: CACHE MISS (DB Query + Write to Upstash Redis)...');
    const startMiss = performance.now();
    const dbData = await prisma.product.findMany({
        take: 20,
        include: { category: true }
    });
    await redis.set(testKey, JSON.stringify(dbData), { ex: 300 });
    const durationMiss = performance.now() - startMiss;

    // TEST 3: WITH REDIS CACHE HIT
    addLog(`🔹 Running Test 3: WITH REDIS CACHE HIT (Upstash Redis x ${iterations})...`);
    const redisCacheTimes = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        const raw = await redis.get(testKey);
        if (typeof raw === 'string') JSON.parse(raw);
        const duration = performance.now() - start;
        redisCacheTimes.push(duration);
    }

    const avgRedisCache = redisCacheTimes.reduce((a, b) => a + b, 0) / iterations;
    const minRedisCache = Math.min(...redisCacheTimes);
    const maxRedisCache = Math.max(...redisCacheTimes);

    // TEST 4: IN-MEMORY CACHE HIT (RAM Cache)
    memoryCache.set(testKey, JSON.stringify(dbData));
    addLog(`🔹 Running Test 4: WITH IN-MEMORY CACHE HIT (Node.js RAM x ${iterations})...`);
    const memCacheTimes = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        const raw = memoryCache.get(testKey);
        JSON.parse(raw);
        const duration = performance.now() - start;
        memCacheTimes.push(duration);
    }

    const avgMemCache = memCacheTimes.reduce((a, b) => a + b, 0) / iterations;
    const minMemCache = Math.min(...memCacheTimes);
    const maxMemCache = Math.max(...memCacheTimes);

    // TEST 5: REFRESH TOKEN AUTH LOOKUP BENCHMARK
    addLog('🔹 Running Test 5: REFRESH TOKEN AUTH LOOKUP BENCHMARK...');
    const mockUserId = 'user_test_benchmark_123';
    const mockToken = 'jwt_refresh_token_benchmark_abc_xyz';
    await redis.set(`refreshToken:${mockUserId}`, mockToken, { ex: 3600 });

    const authDbStart = performance.now();
    await prisma.user.findFirst({ where: { id: mockUserId } });
    const authDbTime = performance.now() - authDbStart;

    const authRedisStart = performance.now();
    await redis.get(`refreshToken:${mockUserId}`);
    const authRedisTime = performance.now() - authRedisStart;

    // Clean up
    await redis.del(testKey);
    await redis.del(`refreshToken:${mockUserId}`);

    addLog('✅ Cache Performance Benchmark Completed!');

    const redisSpeedupFactor = (avgNoCache / (avgRedisCache || 1)).toFixed(2);
    const memSpeedupFactor = (avgNoCache / (avgMemCache || 0.01)).toFixed(2);

    return {
        timestamp: new Date().toISOString(),
        iterations,
        logs,
        summary: {
            redisSpeedup: `${redisSpeedupFactor}x`,
            memSpeedup: `${memSpeedupFactor}x`,
            savedMsPerRequest: (avgNoCache - avgRedisCache).toFixed(2)
        },
        tests: [
            {
                name: '1. No Cache (Neon PostgreSQL)',
                avgMs: parseFloat(avgNoCache.toFixed(2)),
                minMs: parseFloat(minNoCache.toFixed(2)),
                maxMs: parseFloat(maxNoCache.toFixed(2)),
                speedup: '1.0x (Baseline)',
                badge: 'Database'
            },
            {
                name: '2. Cache Miss (DB + Redis Write)',
                avgMs: parseFloat(durationMiss.toFixed(2)),
                minMs: parseFloat(durationMiss.toFixed(2)),
                maxMs: parseFloat(durationMiss.toFixed(2)),
                speedup: `${(avgNoCache / durationMiss).toFixed(2)}x`,
                badge: 'Cache Miss'
            },
            {
                name: '3. Redis Cache Hit (Upstash)',
                avgMs: parseFloat(avgRedisCache.toFixed(2)),
                minMs: parseFloat(minRedisCache.toFixed(2)),
                maxMs: parseFloat(maxRedisCache.toFixed(2)),
                speedup: `${redisSpeedupFactor}x faster`,
                badge: 'Upstash Redis'
            },
            {
                name: '4. Local In-Memory Cache Hit',
                avgMs: parseFloat(avgMemCache.toFixed(2)),
                minMs: parseFloat(minMemCache.toFixed(2)),
                maxMs: parseFloat(maxMemCache.toFixed(2)),
                speedup: `${memSpeedupFactor}x faster`,
                badge: 'Node.js RAM'
            }
        ],
        authTokenLookup: {
            dbTimeMs: parseFloat(authDbTime.toFixed(2)),
            redisTimeMs: parseFloat(authRedisTime.toFixed(2)),
            speedup: `${(authDbTime / (authRedisTime || 1)).toFixed(2)}x`
        }
    };
}

/**
 * Executes Async Concurrency Benchmark (async_benchmark.js logic)
 * Compares Sequential for/await vs Parallel Promise.all across Async I/O, Redis, DB Queries
 */
export async function runAsyncBenchmark(count = 10) {
    const logs = [];
    const addLog = (msg) => logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);

    addLog('🚀 Starting Async Concurrency Benchmark (async_benchmark.js)...');

    // Warmup Redis cache keys for test 2
    for (let i = 0; i < count; i++) {
        await redis.set(`async_test_key_${i}`, `value_${i}`, { ex: 60 });
    }

    // TEST 1: SIMULATED ASYNC I/O
    addLog(`🔹 Running Test 1: Simulated Async I/O (${count} tasks - 150ms delay each)...`);

    // 1a. Sequential
    const startIoSeq = performance.now();
    for (let i = 0; i < count; i++) {
        await simulatedIoTask(i, 150);
    }
    const ioSeqTime = performance.now() - startIoSeq;

    // 1b. Parallel
    const startIoPar = performance.now();
    const ioPromises = Array.from({ length: count }, (_, i) => simulatedIoTask(i, 150));
    await Promise.all(ioPromises);
    const ioParTime = performance.now() - startIoPar;

    // TEST 2: REDIS CACHE FETCH
    addLog(`🔹 Running Test 2: Upstash Redis Cache Fetch (${count} Key Gets)...`);

    // 2a. Sequential
    const startRedisSeq = performance.now();
    for (let i = 0; i < count; i++) {
        await redis.get(`async_test_key_${i}`);
    }
    const redisSeqTime = performance.now() - startRedisSeq;

    // 2b. Parallel
    const startRedisPar = performance.now();
    const redisParPromises = Array.from({ length: count }, (_, i) => redis.get(`async_test_key_${i}`));
    await Promise.all(redisParPromises);
    const redisParTime = performance.now() - startRedisPar;

    // TEST 3: DATABASE QUERIES
    addLog(`🔹 Running Test 3: Database Queries (${count} Product Queries)...`);

    const dbQueryTask = async () => {
        return await prisma.product.findMany({
            take: 5,
            where: { status: 'ACTIVE' }
        });
    };

    // 3a. Sequential
    const startDbSeq = performance.now();
    for (let i = 0; i < count; i++) {
        await dbQueryTask();
    }
    const dbSeqTime = performance.now() - startDbSeq;

    // 3b. Parallel
    const startDbPar = performance.now();
    const dbParPromises = Array.from({ length: count }, () => dbQueryTask());
    await Promise.all(dbParPromises);
    const dbParTime = performance.now() - startDbPar;

    // Clean up
    for (let i = 0; i < count; i++) {
        await redis.del(`async_test_key_${i}`);
    }

    addLog('✅ Async Concurrency Benchmark Completed!');

    const ioSpeedup = (ioSeqTime / (ioParTime || 1)).toFixed(2);
    const redisSpeedup = (redisSeqTime / (redisParTime || 1)).toFixed(2);
    const dbSpeedup = (dbSeqTime / (dbParTime || 1)).toFixed(2);

    return {
        timestamp: new Date().toISOString(),
        taskCount: count,
        logs,
        summary: {
            ioSpeedup: `${ioSpeedup}x`,
            redisSpeedup: `${redisSpeedup}x`,
            dbSpeedup: `${dbSpeedup}x`
        },
        tests: [
            {
                category: '1. Simulated Async I/O (API calls / Microservices)',
                sequentialMs: parseFloat(ioSeqTime.toFixed(2)),
                parallelMs: parseFloat(ioParTime.toFixed(2)),
                speedup: `${ioSpeedup}x faster`,
                ratio: parseFloat(ioSpeedup)
            },
            {
                category: '2. Upstash Redis Cache Fetch (10 Key Gets)',
                sequentialMs: parseFloat(redisSeqTime.toFixed(2)),
                parallelMs: parseFloat(redisParTime.toFixed(2)),
                speedup: `${redisSpeedup}x faster`,
                ratio: parseFloat(redisSpeedup)
            },
            {
                category: '3. Database PostgreSQL (10 Queries)',
                sequentialMs: parseFloat(dbSeqTime.toFixed(2)),
                parallelMs: parseFloat(dbParTime.toFixed(2)),
                speedup: `${dbSpeedup}x faster`,
                ratio: parseFloat(dbSpeedup)
            }
        ]
    };
}

/**
 * Runs both benchmarks and provides comparative suite metrics
 */
export async function runFullBenchmarkSuite(iterations = 10, count = 10) {
    const startTime = performance.now();
    const cacheResult = await runCacheBenchmark(iterations);
    const asyncResult = await runAsyncBenchmark(count);
    const totalTimeMs = performance.now() - startTime;

    return {
        timestamp: new Date().toISOString(),
        totalExecutionTimeMs: parseFloat(totalTimeMs.toFixed(2)),
        cacheBenchmark: cacheResult,
        asyncBenchmark: asyncResult,
        comparisonHighlights: {
            cacheVsDbLatencyReduction: `${((1 - cacheResult.tests[2].avgMs / cacheResult.tests[0].avgMs) * 100).toFixed(1)}%`,
            asyncVsSeqLatencyReduction: `${((1 - asyncResult.tests[1].parallelMs / asyncResult.tests[1].sequentialMs) * 100).toFixed(1)}%`,
            keyRecommendation: 'Combining Redis Caching (reduces per-request DB work) with Promise.all Async Concurrency (eliminates waiting overhead) delivers maximum application throughput.'
        }
    };
}
