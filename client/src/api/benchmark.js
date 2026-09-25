import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const runCacheBenchmark = (iterations = 10) =>
    axios.post(`${API_URL}/benchmark/cache`, { iterations });

export const runAsyncBenchmark = (count = 10) =>
    axios.post(`${API_URL}/benchmark/async`, { count });

export const runFullBenchmark = (iterations = 10, count = 10) =>
    axios.post(`${API_URL}/benchmark/full`, { iterations, count });
