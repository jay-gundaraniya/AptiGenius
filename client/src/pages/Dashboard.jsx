import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, Award, Target, ListChecks, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalTests: 0, avgScore: 0, latestScore: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/results/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const statCards = [
        { label: 'Total Tests Taken', value: stats.totalTests, icon: ListChecks, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Average Score', value: `${stats.avgScore}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Latest Score', value: `${stats.latestScore}%`, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Student Dashboard</h1>
                <p className="text-slate-500 text-lg font-medium">Welcome back! Check your progress and start a new test.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col gap-4 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{card.label}</h3>
                            <div className="text-4xl font-black text-slate-900">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                    <div className="relative z-10 flex-1">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">Ready for a challenge?</h2>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                            Select your category and difficulty level to begin your next aptitude assessment.
                            Level up your career with AI-powered feedback.
                        </p>
                        <button
                            onClick={() => navigate('/tests/start')}
                            className="inline-flex items-center gap-3 py-4 px-8 bg-[#4a54a4] text-white rounded-2xl text-lg font-bold transition-all hover:bg-[#3f4791] hover:shadow-xl hover:shadow-indigo-200 active:scale-95"
                        >
                            <PlayCircle size={24} />
                            Start New Test
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="relative z-10 w-48 h-48 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <PlayCircle size={100} strokeWidth={1} />
                    </div>

                    {/* Bg decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
