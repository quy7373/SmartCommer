import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../src/lib/prisma.js';
import { redis } from '../src/lib/redis.js';

// Simple in-memory cache for comparison
const memoryCache = new Map();

async function runBenchmark() {
    console.log('====================================================');
    console.log('  SMART COMMERCE CACHE VS NO-CACHE BENCHMARK TOOL  ');
    console.log('====================================================\n');

    console.log(`📡 Database: Neon PostgreSQL (${process.env.DATABASE_URL ? 'Connected' : 'Missing URL'})`);
    console.log(`⚡ Cache Store: Upstash Redis (${process.env.UPSTASH_REDIS_REST_URL ? 'Connected' : 'Missing URL'})\n`);

    // Warmup DB connection
    console.log('⏳ Warming up database and cache connections...');
    let connected = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            await redis.set('benchmark_test', 'ok', { ex: 60 });
            connected = true;
            console.log('✅ Connection successful!\n');
            break;
        } catch (error) {
            console.warn(`⚠️ Connection attempt ${attempt} failed: ${error.message.split('\n')[0]}`);
            if (attempt < 3) {
                console.log('🔄 Retrying in 2 seconds (waking up Neon PostgreSQL compute)...');
                await new Promise(res => setTimeout(res, 2000));
            }
        }
    }
    if (!connected) {
        console.error('❌ Could not connect to Database after 3 attempts.');
        process.exit(1);
    }

    const ITERATIONS = 10;
    const testKey = 'cache_benchmark:products_all';

    // ----------------------------------------------------
    // TEST 1: WITHOUT CACHE (Direct Neon PostgreSQL Query)
    // ----------------------------------------------------
    console.log(`🔹 Running TEST 1: WITHOUT CACHE (Direct DB Query to Neon PostgreSQL x ${ITERATIONS})...`);
    const noCacheTimes = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        const products = await prisma.product.findMany({
            take: 20,
            include: { category: true }
        });
        const duration = performance.now() - start;
        noCacheTimes.push(duration);
        console.log(`   - Run ${i + 1}: ${duration.toFixed(2)} ms (found ${products.length} products)`);
    }

    const avgNoCache = noCacheTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
    const minNoCache = Math.min(...noCacheTimes);
    const maxNoCache = Math.max(...noCacheTimes);

    // Clean any prior cache
    await redis.del(testKey);

    // ----------------------------------------------------
    // TEST 2: CACHE MISS (DB Fetch + Write to Redis Cache)
    // ----------------------------------------------------
    console.log(`\n🔹 Running TEST 2: CACHE MISS (DB Query + Write to Upstash Redis)...`);
    const startMiss = performance.now();
    let cachedProductsData;
    const dbData = await prisma.product.findMany({
        take: 20,
        include: { category: true }
    });
    await redis.set(testKey, JSON.stringify(dbData), { ex: 300 });
    const durationMiss = performance.now() - startMiss;
    console.log(`   - Cache Miss Duration: ${durationMiss.toFixed(2)} ms`);

    // ----------------------------------------------------
    // TEST 3: WITH REDIS CACHE HIT (Read from Upstash Redis x ITERATIONS)
    // ----------------------------------------------------
    console.log(`\n🔹 Running TEST 3: WITH REDIS CACHE HIT (Upstash Redis x ${ITERATIONS})...`);
    const redisCacheTimes = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        const raw = await redis.get(testKey);
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const duration = performance.now() - start;
        redisCacheTimes.push(duration);
        console.log(`   - Run ${i + 1}: ${duration.toFixed(2)} ms`);
    }

    const avgRedisCache = redisCacheTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
    const minRedisCache = Math.min(...redisCacheTimes);
    const maxRedisCache = Math.max(...redisCacheTimes);

    // ----------------------------------------------------
    // TEST 4: IN-MEMORY CACHE HIT (Node.js RAM Cache x ITERATIONS)
    // ----------------------------------------------------
    memoryCache.set(testKey, JSON.stringify(dbData));
    console.log(`\n🔹 Running TEST 4: WITH IN-MEMORY CACHE HIT (Node.js Memory x ${ITERATIONS})...`);
    const memCacheTimes = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        const raw = memoryCache.get(testKey);
        const data = JSON.parse(raw);
        const duration = performance.now() - start;
        memCacheTimes.push(duration);
        console.log(`   - Run ${i + 1}: ${duration.toFixed(2)} ms`);
    }

    const avgMemCache = memCacheTimes.reduce((a, b) => a + b, 0) / ITERATIONS;

    // ----------------------------------------------------
    // TEST 5: REFRESH TOKEN LOOKUP BENCHMARK (Authentication Case)
    // ----------------------------------------------------
    console.log(`\n🔹 Running TEST 5: REFRESH TOKEN AUTH LOOKUP BENCHMARK...`);
    const mockUserId = 'user_test_benchmark_123';
    const mockToken = 'jwt_refresh_token_benchmark_abc_xyz';

    // DB simulation vs Redis
    await redis.set(`refreshToken:${mockUserId}`, mockToken, { ex: 3600 });

    const authDbStart = performance.now();
    const dbUser = await prisma.user.findFirst({ where: { id: mockUserId } });
    const authDbTime = performance.now() - authDbStart;

    const authRedisStart = performance.now();
    const redisToken = await redis.get(`refreshToken:${mockUserId}`);
    const authRedisTime = performance.now() - authRedisStart;

    console.log(`   - Auth Lookup via DB (Prisma/PostgreSQL): ${authDbTime.toFixed(2)} ms`);
    console.log(`   - Auth Lookup via Redis Cache (Upstash): ${authRedisTime.toFixed(2)} ms`);

    // Clean up
    await redis.del(testKey);
    await redis.del(`refreshToken:${mockUserId}`);

    // ----------------------------------------------------
    // SUMMARY REPORT
    // ----------------------------------------------------
    console.log('\n====================================================');
    console.log('                 SUMMARY RESULT REPORT              ');
    console.log('====================================================');
    console.table([
        {
            'Strategy / Method': '1. No Cache (Neon PostgreSQL)',
            'Avg Time (ms)': avgNoCache.toFixed(2),
            'Min Time (ms)': minNoCache.toFixed(2),
            'Max Time (ms)': maxNoCache.toFixed(2),
            'Speedup vs DB': '1.0x (Baseline)'
        },
        {
            'Strategy / Method': '2. Cache Miss (DB + Write Cache)',
            'Avg Time (ms)': durationMiss.toFixed(2),
            'Min Time (ms)': durationMiss.toFixed(2),
            'Max Time (ms)': durationMiss.toFixed(2),
            'Speedup vs DB': `${(avgNoCache / durationMiss).toFixed(2)}x`
        },
        {
            'Strategy / Method': '3. Redis Cache Hit (Upstash Redis)',
            'Avg Time (ms)': avgRedisCache.toFixed(2),
            'Min Time (ms)': minRedisCache.toFixed(2),
            'Max Time (ms)': maxRedisCache.toFixed(2),
            'Speedup vs DB': `${(avgNoCache / avgRedisCache).toFixed(2)}x faster`
        },
        {
            'Strategy / Method': '4. Local In-Memory Cache Hit',
            'Avg Time (ms)': avgMemCache.toFixed(2),
            'Min Time (ms)': Math.min(...memCacheTimes).toFixed(2),
            'Max Time (ms)': Math.max(...memCacheTimes).toFixed(2),
            'Speedup vs DB': `${(avgNoCache / avgMemCache).toFixed(2)}x faster`
        }
    ]);

    const speedupFactor = (avgNoCache / avgRedisCache).toFixed(1);
    const savedTimeMs = (avgNoCache - avgRedisCache).toFixed(2);

    console.log(`\n💡 KẾT LUẬN / CONCLUSION:`);
    console.log(`• Không dùng cache (Neon PostgreSQL DB): Trung bình tốn ~${avgNoCache.toFixed(2)} ms`);
    console.log(`• Có sử dụng Redis Cache (Upstash Redis): Trung bình tốn ~${avgRedisCache.toFixed(2)} ms`);
    console.log(`• Có sử dụng In-Memory Cache (Node.js RAM): Trung bình tốn ~${avgMemCache.toFixed(2)} ms`);
    console.log(`🚀 Sử dụng Redis Cache giúp giảm bớt ${savedTimeMs} ms per request (Nhanh hơn gấp ~${speedupFactor} lần)!`);
    console.log('====================================================\n');

    await prisma.$disconnect();
}

runBenchmark().catch(async (e) => {
    console.error('Benchmark failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
