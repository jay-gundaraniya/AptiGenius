import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart3,
    Search,
    Bell,
    TrendingUp,
    TrendingDown,
    Target,
    Activity,
    Zap,
    Trophy,
    Award,
    Clock,
    Flame,
    Navigation,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTests: 0,
        avgScore: 0,
        latestScore: 0,
        weakestTopic: 'Not Available',
        weakestTopicScore: 0,
        recentResults: [],
        scoreTrend: [],
        topicPerformance: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/results/stats');
                setStats(prev => ({ ...prev, ...res.data }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const barData = {
        labels: stats.topicPerformance?.length > 0 ? stats.topicPerformance?.map(d => d.category) : ['Quantitative', 'Logical', 'Verbal'],
        datasets: [
            {
                label: 'Accuracy (%)',
                data: stats.topicPerformance?.length > 0 ? stats.topicPerformance?.map(d => d.accuracy) : [75, 55, 82],
                backgroundColor: '#6366f1',
                borderRadius: 8,
                barThickness: 32,
            },
        ],
    };

    const lineData = {
        labels: stats.scoreTrend?.length > 0 ? stats.scoreTrend?.map(d => d.date) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Score History',
                data: stats.scoreTrend?.length > 0 ? stats.scoreTrend?.map(d => d.score) : [60, 75, 55, 90, 80, 85],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: { color: '#94a3b8', font: { size: 11 }, padding: 10 }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11 }, padding: 10 }
            }
        }
    };

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen">
            {/* Professional Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
                    <p className="text-slate-500 text-sm">Detailed breakdown of your assessment metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
                        <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600">Weekly</button>
                        <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-900">Monthly</button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Score Stats Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Trophy size={20} />
                            </div>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">+12.5%</span>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Success Rate</div>
                        <div className="text-3xl font-bold text-slate-900">{stats.avgScore}%</div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">-2:40m</span>
                        </div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Average Pacing</div>
                        <div className="text-3xl font-bold text-slate-900">1m 12s</div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-100 text-white">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                            <Target size={20} />
                        </div>
                        <div className="text-indigo-100/60 text-xs font-bold uppercase tracking-wider mb-1">Placement Readiness</div>
                        <div className="text-3xl font-bold text-white">Tier 1 Elite</div>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Performance History</h3>
                    <div className="flex-1 h-64">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Topic Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Topic Accuracy Breakdown</h3>
                    <div className="h-64">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                {/* Behavioral Insights */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Performance Insights</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                            <div className="w-8 h-8 bg-white text-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                                <Flame size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Focus Window</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Your accuracy is 18% higher during morning sessions (9 AM - 11 AM).</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                            <div className="w-8 h-8 bg-white text-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Learning Velocity</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">You've mastered 'Quantitative Algebra' 2x faster than the platform average.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl flex gap-4">
                            <div className="w-8 h-8 bg-white text-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                                <Activity size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">Consistency Factor</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Your score deviation has decreased by 15%, indicating more stable performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
