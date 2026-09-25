import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../src/lib/prisma.js';
import { redis } from '../src/lib/redis.js';

// Helper simulated async task (e.g., Calling external payment gateway, email service, or microservice)
const simulatedIoTask = (id, delayMs = 200) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Result of task ${id}`);
        }, delayMs);
    });
};

async function runAsyncBenchmark() {
    console.log('================================================================');
    console.log('  SMART COMMERCE: ASYNC (PARALLEL) VS SEQUENTIAL BENCHMARK     ');
    console.log('================================================================\n');

    console.log(`📡 Database: Neon PostgreSQL (${process.env.DATABASE_URL ? 'Connected' : 'Missing URL'})`);
    console.log(`⚡ Cache Store: Upstash Redis (${process.env.UPSTASH_REDIS_REST_URL ? 'Connected' : 'Missing URL'})\n`);

    console.log('⏳ Connecting to Database & Redis...');
    let connected = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            await redis.set('async_bench_ping', 'pong', { ex: 60 });
            connected = true;
            console.log('✅ Connection successful!\n');
            break;
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed, retrying...`);
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    if (!connected) {
        console.error('❌ Failed to connect to DB.');
        process.exit(1);
    }

    const COUNT = 10;
    console.log(`🎯 Testing with ${COUNT} tasks across different scenarios...\n`);

    // Warmup Redis cache keys
    for (let i = 0; i < COUNT; i++) {
        await redis.set(`async_test_key_${i}`, `value_${i}`, { ex: 60 });
    }

    // ----------------------------------------------------
    // TEST 1: SIMULATED ASYNC I/O (API Calls / Microservices)
    // ----------------------------------------------------
    console.log(`🔹 TEST 1: Simulated Async I/O (10 Tasks - 200ms delay each)...`);
    
    // 1a. Sequential
    const startIoSeq = performance.now();
    for (let i = 0; i < COUNT; i++) {
        await simulatedIoTask(i, 200);
    }
    const totalIoSeqTime = performance.now() - startIoSeq;
    console.log(`   - Sequential Execution Time: ${totalIoSeqTime.toFixed(2)} ms`);

    // 1b. Parallel (Promise.all)
    const startIoPar = performance.now();
    const ioPromises = Array.from({ length: COUNT }, (_, i) => simulatedIoTask(i, 200));
    await Promise.all(ioPromises);
    const totalIoParTime = performance.now() - startIoPar;
    console.log(`   - Parallel (Promise.all) Time: ${totalIoParTime.toFixed(2)} ms\n`);

    // ----------------------------------------------------
    // TEST 2: REDIS CACHE (Upstash REST Calls)
    // ----------------------------------------------------
    console.log(`🔹 TEST 2: Upstash Redis Cache Fetch (10 Key Gets)...`);
    
    // 2a. Sequential
    const startRedisSeq = performance.now();
    for (let i = 0; i < COUNT; i++) {
        await redis.get(`async_test_key_${i}`);
    }
    const totalRedisSeqTime = performance.now() - startRedisSeq;
    console.log(`   - Sequential Redis Time: ${totalRedisSeqTime.toFixed(2)} ms`);

    // 2b. Parallel (Promise.all)
    const startRedisPar = performance.now();
    const redisParPromises = Array.from({ length: COUNT }, (_, i) => redis.get(`async_test_key_${i}`));
    await Promise.all(redisParPromises);
    const totalRedisParTime = performance.now() - startRedisPar;
    console.log(`   - Parallel (Promise.all) Redis Time: ${totalRedisParTime.toFixed(2)} ms\n`);

    // ----------------------------------------------------
    // TEST 3: DATABASE QUERIES (Neon PostgreSQL via Prisma)
    // ----------------------------------------------------
    console.log(`🔹 TEST 3: Database Queries (10 Product Queries)...`);

    const dbQueryTask = async () => {
        return await prisma.product.findMany({
            take: 5,
            where: { status: 'ACTIVE' }
        });
    };

    // 3a. Sequential
    const startDbSeq = performance.now();
    for (let i = 0; i < COUNT; i++) {
        await dbQueryTask();
    }
    const totalDbSeqTime = performance.now() - startDbSeq;
    console.log(`   - Sequential DB Time: ${totalDbSeqTime.toFixed(2)} ms`);

    // 3b. Parallel
    const startDbPar = performance.now();
    const dbParPromises = Array.from({ length: COUNT }, () => dbQueryTask());
    await Promise.all(dbParPromises);
    const totalDbParTime = performance.now() - startDbPar;
    console.log(`   - Parallel DB Time: ${totalDbParTime.toFixed(2)} ms\n`);

    // Clean up
    for (let i = 0; i < COUNT; i++) {
        await redis.del(`async_test_key_${i}`);
    }

    // ----------------------------------------------------
    // SUMMARY REPORT
    // ----------------------------------------------------
    console.log('================================================================');
    console.log('                 KẾT QUẢ SO SÁNH (SUMMARY REPORT)               ');
    console.log('================================================================');

    const ioSpeedup = (totalIoSeqTime / totalIoParTime).toFixed(2);
    const redisSpeedup = (totalRedisSeqTime / totalRedisParTime).toFixed(2);

    console.table([
        {
            'Môi trường / Thao tác': '1. Simulated Async I/O (10 API calls)',
            'Chạy Nối Tiếp (Sequential)': `${totalIoSeqTime.toFixed(2)} ms`,
            'Chạy Bất Đồng Bộ (Promise.all)': `${totalIoParTime.toFixed(2)} ms`,
            'Hiệu năng tăng': `🚀 Nhanh hơn ${ioSpeedup}x`
        },
        {
            'Môi trường / Thao tác': '2. Upstash Redis Cache (10 Key Gets)',
            'Chạy Nối Tiếp (Sequential)': `${totalRedisSeqTime.toFixed(2)} ms`,
            'Chạy Bất Đồng Bộ (Promise.all)': `${totalRedisParTime.toFixed(2)} ms`,
            'Hiệu năng tăng': `🚀 Nhanh hơn ${redisSpeedup}x`
        },
        {
            'Môi trường / Thao tác': '3. Database PostgreSQL (10 Queries)',
            'Chạy Nối Tiếp (Sequential)': `${totalDbSeqTime.toFixed(2)} ms`,
            'Chạy Bất Đồng Bộ (Promise.all)': `${totalDbParTime.toFixed(2)} ms`,
            'Hiệu năng tăng': `${(totalDbSeqTime / totalDbParTime).toFixed(2)}x`
        }
    ]);

    console.log(`\n💡 GIẢI THÍCH CHI TIẾT:`);
    console.log(`1. Chạy Nối Tiếp (Sequential):`);
    console.log(`   - Dùng vòng lặp for và await từng tác vụ một.`);
    console.log(`   - Phải chờ tác vụ A xong mới chạy tác vụ B.`);
    console.log(`   - Tổng thời gian = T1 + T2 + T3 + ... + T10.`);
    console.log(`\n2. Chạy Bất Đồng Bộ Song Song (Async Concurrent - Promise.all):`);
    console.log(`   - Khởi tạo tất cả 10 tác vụ cùng một lúc trong Event Loop.`);
    console.log(`   - Xử lý đồng thời (concurrently).`);
    console.log(`   - Tổng thời gian chỉ bằng tác vụ lâu nhất (giảm từ ${totalRedisSeqTime.toFixed(0)}ms xuống ${totalRedisParTime.toFixed(0)}ms đối với Redis).`);
    console.log('================================================================\n');

    await prisma.$disconnect();
}

runAsyncBenchmark().catch(async (err) => {
    console.error('Benchmark failed:', err);
    await prisma.$disconnect();
    process.exit(1);
});
