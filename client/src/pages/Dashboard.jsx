import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CheckSquare,
    Clock,
    Sparkles,
    Calendar,
    ChevronDown,
    Brain,
    User,
    LogOut,
    Plus,
    Minus,
    TrendingUp,
    LayoutGrid,
    Target,
    Zap,
    History,
    Search,
    Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/results/stats');
            setStats(prev => ({
                ...prev,
                ...res.data
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen ml-64 bg-slate-50 text-indigo-600">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Dashboard...</div>
        </div>
    );

    const readiness = stats.avgScore || 0;
    const progressColor = readiness >= 80 ? 'text-emerald-500' : (readiness >= 60 ? 'text-indigo-600' : 'text-amber-500');
    const circleColor = readiness >= 80 ? '#10b981' : (readiness >= 60 ? '#6366f1' : '#f59e0b');

    const lineData = {
        labels: stats.scoreTrend?.length > 0 ? stats.scoreTrend?.map(d => d.date) : ['03-01', '03-02', '03-03', '03-04', '03-05', '03-06'],
        datasets: [
            {
                label: 'Test Score',
                data: stats.scoreTrend?.length > 0 ? stats.scoreTrend?.map(d => d.score) : [65, 78, 52, 85, 70, 80],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
            },
        ],
    };

    const barData = {
        labels: stats.topicPerformance?.length > 0 ? stats.topicPerformance?.map(d => d.category) : ['Quantitative', 'Logical', 'Verbal', 'Coding', 'General'],
        datasets: [
            {
                label: 'Proficiency (%)',
                data: stats.topicPerformance?.length > 0 ? stats.topicPerformance?.map(d => d.accuracy) : [75, 55, 82, 60, 90],
                backgroundColor: '#06b6d4',
                borderRadius: 12,
                hoverBackgroundColor: '#0891b2',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                cornerRadius: 12,
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: { color: '#94a3b8', font: { weight: 'bold' } }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { weight: 'bold' } }
            }
        }
    };

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen">
            {/* Professional Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
                    <p className="text-slate-500 text-sm">Welcome back to your aptitude roadmap.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                        <Search size={20} />
                    </button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                        <Bell size={20} />
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right">
                            <div className="text-sm font-semibold text-slate-900">{user?.firstName}</div>
                            <div className="text-xs text-slate-400">Pro Student</div>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                            {user?.firstName?.[0]}
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <History size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{stats.totalTests}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tests Taken</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Target size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{stats.avgScore}%</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Accuracy</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Zap size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{stats.latestScore}%</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Score</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <Brain size={24} />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-900 truncate max-w-[120px]">{stats.weakestTopic}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weakest Topic</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Score Trends */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Performance Over Time</h3>
                            <p className="text-slate-400 text-xs">Accuracy consistency across sessions.</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>

                {/* Readiness Gauge */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Placement Readiness</h3>
                        <p className="text-slate-400 text-xs">Current readiness score.</p>
                    </div>
                    <div className="relative w-48 h-48 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="#f1f5f9" fill="transparent" />
                            <circle
                                cx="96" cy="96" r="88" strokeWidth="12" stroke={circleColor} fill="transparent"
                                strokeDasharray={552.92}
                                strokeDashoffset={552.92 - (552.92 * readiness) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-bold ${progressColor}`}>{readiness}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                        </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 text-center leading-relaxed">
                        Currently in the <span className="text-indigo-600 font-bold">Top Tier</span> for quantitative analysis.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Topic Distribution */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-8">Category Mastery</h3>
                    <div className="h-64">
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Tests Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Recent Sessions</h3>
                        <button onClick={() => navigate('/tests')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider bg-slate-50/50">
                                    <th className="px-6 py-4 text-left">Category</th>
                                    <th className="px-6 py-4 text-center">Score</th>
                                    <th className="px-6 py-4 text-center">Result</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.recentResults?.map((test) => (
                                    <tr key={test.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/tests/result/${test.id}`)}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{test.category}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-slate-600">{test.score}/{test.total}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${test.accuracy >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {test.accuracy}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium">{test.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Clean CTA Section */}
            <div className="bg-[#1e293b] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-slate-200">
                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold mb-2">Simulate Placement Test</h2>
                    <p className="text-slate-400 text-sm">Attempt a full-length mock assessment to unlock deeper career insights.</p>
                </div>
                <button
                    onClick={() => navigate('/tests/start')}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Start Assessment
                </button>
            </div>

            {/* Footer Credit */}
            <div className="mt-12 text-center">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-[2px]">AptiGenius Assessment &bull; 2026</p>
            </div>
        </div>
    );
};

export default Dashboard;
