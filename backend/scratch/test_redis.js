import dotenv from 'dotenv';
dotenv.config();
import { redis } from '../src/lib/redis.js';

async function testRedis() {
    console.log('Testing Upstash Redis...');
    const start = performance.now();
    await redis.set('ping', 'pong');
    const val = await redis.get('ping');
    const end = performance.now();
    console.log(`Upstash Redis response: ${val} in ${(end - start).toFixed(2)} ms`);
}

testRedis().catch(console.error);
