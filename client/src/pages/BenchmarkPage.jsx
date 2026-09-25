import React, { useState } from 'react';
import {
    Zap,
    Cpu,
    Database,
    Clock,
    Play,
    RefreshCw,
    CheckCircle2,
    Layers,
    BarChart2,
    Terminal,
    TrendingUp,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { runCacheBenchmark, runAsyncBenchmark, runFullBenchmark } from '../api/benchmark';

export default function BenchmarkPage() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cache' | 'async' | 'logs'
    const [iterations, setIterations] = useState(10);
    const [count, setCount] = useState(10);
    const [benchmarkData, setBenchmarkData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    const handleRunBenchmark = async (type = 'full') => {
        setLoading(true);
        setError(null);
        setLogs([`[${new Date().toLocaleTimeString()}] 🚀 Initiating ${type.toUpperCase()} Benchmark suite...`]);

        try {
            let res;
            if (type === 'cache') {
                res = await runCacheBenchmark(iterations);
                setBenchmarkData((prev) => ({
                    ...prev,
                    cacheBenchmark: res.data.data,
                    timestamp: res.data.data.timestamp
                }));
                setLogs((l) => [...l, ...(res.data.data.logs || [])]);
            } else if (type === 'async') {
                res = await runAsyncBenchmark(count);
                setBenchmarkData((prev) => ({
                    ...prev,
                    asyncBenchmark: res.data.data,
                    timestamp: res.data.data.timestamp
                }));
                setLogs((l) => [...l, ...(res.data.data.logs || [])]);
            } else {
                res = await runFullBenchmark(iterations, count);
                setBenchmarkData(res.data.data);
                const cacheLogs = res.data.data.cacheBenchmark?.logs || [];
                const asyncLogs = res.data.data.asyncBenchmark?.logs || [];
                setLogs((l) => [...l, ...cacheLogs, ...asyncLogs]);
            }
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.message || err.message || 'Benchmark execution failed';
            setError(errMsg);
            setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ❌ ERROR: ${errMsg}`]);
        } finally {
            setLoading(false);
        }
    };

    const cacheData = benchmarkData?.cacheBenchmark;
    const asyncData = benchmarkData?.asyncBenchmark;

    // Calculate maximum times for bar scaling
    const maxCacheMs = cacheData?.tests ? Math.max(...cacheData.tests.map((t) => t.avgMs)) : 100;
    const maxAsyncMs = asyncData?.tests
        ? Math.max(...asyncData.tests.map((t) => Math.max(t.sequentialMs, t.parallelMs)))
        : 100;

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-100 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                                <Zap className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                    Performance Benchmark Suite
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">
                                    Direct Comparison: <span className="text-emerald-400 font-semibold">benchmark.js (Caching)</span> vs <span className="text-cyan-400 font-semibold">async_benchmark.js (Concurrency)</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                            <span>Iterations:</span>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={iterations}
                                onChange={(e) => setIterations(Number(e.target.value))}
                                className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                            <span>Tasks Count:</span>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <button
                            onClick={() => handleRunBenchmark('full')}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4 fill-slate-950" />
                            )}
                            {loading ? 'Running Suite...' : 'Run Full Benchmark'}
                        </button>
                    </div>
                </div>

                {/* QUICK RUN BAR */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleRunBenchmark('cache')}
                        disabled={loading}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/40 text-emerald-300 py-3 rounded-xl transition text-sm font-medium cursor-pointer"
                    >
                        <Database className="w-4 h-4" />
                        Run Cache Benchmark (benchmark.js)
                    </button>
                    <button
                        onClick={() => handleRunBenchmark('async')}
                        disabled={loading}
                        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-800/40 text-cyan-300 py-3 rounded-xl transition text-sm font-medium cursor-pointer"
                    >
                        <Cpu className="w-4 h-4" />
                        Run Async Concurrency Benchmark (async_benchmark.js)
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* KPI METRICS CARDS */}
                {benchmarkData && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                                Redis Cache Speedup
                                <Database className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
                                {cacheData?.summary?.redisSpeedup || 'N/A'}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Saves ~{cacheData?.summary?.savedMsPerRequest || '0'} ms per DB request
                            </p>
                        </div>

                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition" />
                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                                RAM Memory Speedup
                                <Zap className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-3xl font-black text-purple-400 font-mono mt-2">
                                {cacheData?.summary?.memSpeedup || 'N/A'}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Local Node.js memory hit vs PostgreSQL
                            </p>
                        </div>

                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/40 transition">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition" />
                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                                Async I/O Speedup
                                <Cpu className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="text-3xl font-black text-cyan-400 font-mono mt-2">
                                {asyncData?.summary?.ioSpeedup || 'N/A'}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Promise.all vs Sequential for-await
                            </p>
                        </div>

                        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition" />
                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center justify-between">
                                Total Suite Time
                                <Clock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-3xl font-black text-amber-400 font-mono mt-2">
                                {benchmarkData.totalExecutionTimeMs ? `${benchmarkData.totalExecutionTimeMs} ms` : 'Done'}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Full test execution latency
                            </p>
                        </div>
                    </div>
                )}

                {/* NAVIGATION TABS */}
                <div className="flex border-b border-slate-800 text-sm font-medium gap-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                            activeTab === 'overview'
                                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        Overview & Comparison
                    </button>
                    <button
                        onClick={() => setActiveTab('cache')}
                        className={`px-4 py-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                            activeTab === 'cache'
                                ? 'border-emerald-400 text-emerald-400 bg-slate-900/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Database className="w-4 h-4" />
                        Cache Benchmark (benchmark.js)
                    </button>
                    <button
                        onClick={() => setActiveTab('async')}
                        className={`px-4 py-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                            activeTab === 'async'
                                ? 'border-cyan-400 text-cyan-400 bg-slate-900/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Cpu className="w-4 h-4" />
                        Async Concurrency (async_benchmark.js)
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 py-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                            activeTab === 'logs'
                                ? 'border-slate-400 text-slate-100 bg-slate-900/50'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Terminal className="w-4 h-4" />
                        Console Output ({logs.length})
                    </button>
                </div>

                {/* TAB CONTENT */}
                {!benchmarkData && !loading && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
                        <Zap className="w-12 h-12 text-emerald-400/50 mx-auto animate-pulse" />
                        <h3 className="text-xl font-bold text-slate-200">No Benchmark Data Available</h3>
                        <p className="max-w-md mx-auto text-sm text-slate-500">
                            Click <strong className="text-emerald-400">"Run Full Benchmark"</strong> above to measure and compare caching speed vs async execution performance in real time.
                        </p>
                    </div>
                )}

                {/* TAB 1: OVERVIEW & COMPARISON */}
                {activeTab === 'overview' && benchmarkData && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* CACHE HIGHLIGHTS */}
                            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                                        <Database className="w-5 h-5" />
                                        1. Caching Strategy (benchmark.js)
                                    </h3>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-mono">
                                        Latency Optimization
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Measures how avoiding database roundtrips by serving data from Upstash Redis or Node.js RAM drastically reduces per-request response time.
                                </p>

                                {cacheData?.tests && (
                                    <div className="space-y-3 pt-2">
                                        {cacheData.tests.map((test, idx) => {
                                            const widthPercent = Math.max((test.avgMs / maxCacheMs) * 100, 3);
                                            return (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-xs font-mono">
                                                        <span className="text-slate-300">{test.name}</span>
                                                        <span className="text-emerald-400 font-bold">{test.avgMs} ms ({test.speedup})</span>
                                                    </div>
                                                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${
                                                                idx === 0
                                                                    ? 'bg-red-500'
                                                                    : idx === 1
                                                                    ? 'bg-amber-500'
                                                                    : idx === 2
                                                                    ? 'bg-emerald-400'
                                                                    : 'bg-purple-400'
                                                            }`}
                                                            style={{ width: `${widthPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* ASYNC HIGHLIGHTS */}
                            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                    <h3 className="font-bold text-lg text-cyan-400 flex items-center gap-2">
                                        <Cpu className="w-5 h-5" />
                                        2. Async Concurrency (async_benchmark.js)
                                    </h3>
                                    <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-mono">
                                        Throughput & Parallelism
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Measures how executing multiple independent I/O or DB tasks concurrently with <code className="text-cyan-300">Promise.all</code> eliminates blocked waiting time compared to sequential <code className="text-cyan-300">for...await</code> loops.
                                </p>

                                {asyncData?.tests && (
                                    <div className="space-y-4 pt-2">
                                        {asyncData.tests.map((test, idx) => {
                                            const seqWidth = Math.max((test.sequentialMs / maxAsyncMs) * 100, 4);
                                            const parWidth = Math.max((test.parallelMs / maxAsyncMs) * 100, 4);

                                            return (
                                                <div key={idx} className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-slate-200 font-semibold">{test.category}</span>
                                                        <span className="text-cyan-400 font-mono font-bold">🚀 {test.speedup}</span>
                                                    </div>

                                                    <div className="space-y-1 font-mono text-[11px]">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-16 text-slate-500 text-right">Seq:</span>
                                                            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                                                                <div className="bg-red-400 h-full rounded-full transition-all duration-700" style={{ width: `${seqWidth}%` }} />
                                                            </div>
                                                            <span className="w-14 text-slate-400 text-right">{test.sequentialMs} ms</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-16 text-cyan-400 font-semibold text-right">Parallel:</span>
                                                            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                                                                <div className="bg-cyan-400 h-full rounded-full transition-all duration-700" style={{ width: `${parWidth}%` }} />
                                                            </div>
                                                            <span className="w-14 text-cyan-300 font-semibold text-right">{test.parallelMs} ms</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RECOMMENDATION MATRIX CARD */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-slate-100 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Architecture Synergy & Key Conclusions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                                    <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                                        <Database className="w-4 h-4" />
                                        When to use Caching
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Use Redis or In-Memory RAM for read-heavy resources (Products, Categories, Flash Sale items, Auth Tokens) to eliminate DB query latency.
                                    </p>
                                </div>
                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                                    <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
                                        <Cpu className="w-4 h-4" />
                                        When to use Async Parallelism
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Use <code className="text-cyan-300">Promise.all</code> when querying multiple external APIs, fetching multiple Redis keys simultaneously, or batching DB lookups.
                                    </p>
                                </div>
                                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                                    <div className="text-purple-400 font-bold text-sm flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" />
                                        Combined Power
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">
                                        Combining Redis Caching with Async Concurrent Fetching maximizes total server throughput and guarantees sub-50ms user responses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: CACHE BENCHMARK DETAILS */}
                {activeTab === 'cache' && cacheData && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold text-emerald-400">Cache Performance Benchmark Details</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Iterations: <span className="font-mono text-emerald-300">{cacheData.iterations}</span> | Ran on Neon PostgreSQL & Upstash Redis
                                </p>
                            </div>
                            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">
                                Redis Speedup: {cacheData.summary?.redisSpeedup}
                            </span>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950/40">
                                        <th className="py-3 px-4">Strategy / Method</th>
                                        <th className="py-3 px-4">Storage Layer</th>
                                        <th className="py-3 px-4 text-right">Avg Time (ms)</th>
                                        <th className="py-3 px-4 text-right">Min Time (ms)</th>
                                        <th className="py-3 px-4 text-right">Max Time (ms)</th>
                                        <th className="py-3 px-4 text-right">Speedup vs DB</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                    {cacheData.tests?.map((t, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3 px-4 font-sans font-semibold text-slate-200">{t.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                                    {t.badge}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-100">{t.avgMs} ms</td>
                                            <td className="py-3 px-4 text-right text-slate-400">{t.minMs} ms</td>
                                            <td className="py-3 px-4 text-right text-slate-400">{t.maxMs} ms</td>
                                            <td className="py-3 px-4 text-right font-bold text-emerald-400">{t.speedup}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* AUTH TOKEN BENCHMARK CARD */}
                        {cacheData.authTokenLookup && (
                            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
                                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    Auth Refresh Token Lookup Case Study
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                        <div className="text-slate-400">PostgreSQL DB Lookup:</div>
                                        <div className="text-lg font-bold text-slate-200 mt-1">{cacheData.authTokenLookup.dbTimeMs} ms</div>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                        <div className="text-emerald-400 font-semibold">Redis Cache Lookup:</div>
                                        <div className="text-lg font-bold text-emerald-400 mt-1">{cacheData.authTokenLookup.redisTimeMs} ms</div>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                                        <div className="text-cyan-400 font-semibold">Performance Increase:</div>
                                        <div className="text-lg font-bold text-cyan-400 mt-1">{cacheData.authTokenLookup.speedup} faster</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: ASYNC BENCHMARK DETAILS */}
                {activeTab === 'async' && asyncData && (
                    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-400">Async Concurrency Benchmark Details</h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Task Batch Count: <span className="font-mono text-cyan-300">{asyncData.taskCount}</span> | Promise.all Parallel vs Sequential Loop
                                </p>
                            </div>
                            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-lg border border-cyan-500/20">
                                I/O Speedup: {asyncData.summary?.ioSpeedup}
                            </span>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950/40">
                                        <th className="py-3 px-4">Test Scenario</th>
                                        <th className="py-3 px-4 text-right">Sequential for/await (ms)</th>
                                        <th className="py-3 px-4 text-right">Parallel Promise.all (ms)</th>
                                        <th className="py-3 px-4 text-right">Saved Waiting Time</th>
                                        <th className="py-3 px-4 text-right">Speedup</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                    {asyncData.tests?.map((t, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3 px-4 font-sans font-semibold text-slate-200">{t.category}</td>
                                            <td className="py-3 px-4 text-right text-red-400 font-bold">{t.sequentialMs} ms</td>
                                            <td className="py-3 px-4 text-right text-cyan-400 font-bold">{t.parallelMs} ms</td>
                                            <td className="py-3 px-4 text-right text-emerald-400">
                                                {(t.sequentialMs - t.parallelMs).toFixed(2)} ms
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-cyan-300">{t.speedup}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 4: CONSOLE LOGS */}
                {activeTab === 'logs' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 shadow-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-500">
                            <span className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-slate-400" />
                                Execution Console Stream
                            </span>
                            <button
                                onClick={() => setLogs([])}
                                className="text-slate-500 hover:text-slate-300 text-[11px] underline cursor-pointer"
                            >
                                Clear Console
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto space-y-1 text-[12px] scrollbar-thin">
                            {logs.length === 0 ? (
                                <p className="text-slate-600 italic">No execution logs yet. Run a benchmark to view output.</p>
                            ) : (
                                logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={
                                            log.includes('✅')
                                                ? 'text-emerald-400'
                                                : log.includes('🚀')
                                                ? 'text-cyan-400 font-bold'
                                                : log.includes('❌')
                                                ? 'text-red-400 font-bold'
                                                : log.includes('🔹')
                                                ? 'text-amber-300 font-semibold'
                                                : 'text-slate-300'
                                        }
                                    >
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
