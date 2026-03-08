import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    History,
    Search,
    Bell,
    ChevronRight,
    Clock,
    Calendar,
    Award,
    CheckCircle2,
    AlertCircle,
    Zap,
    Filter,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyTests = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await axios.get('/api/results/my-results');
            setResults(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex-1 p-12 ml-64 min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen bg-slate-50 font-main">
            <header className="mb-10 max-w-5xl">
                <h1 className="text-3xl font-bold text-slate-900">Assessment History</h1>
                <p className="text-slate-500 text-sm mt-1">Review your past performance and track your growth over time.</p>
            </header>

            <div className="max-w-5xl">
                <div className="grid grid-cols-1 gap-4">
                    {results.length === 0 ? (
                        <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                                <History size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Tests Found</h3>
                            <p className="text-slate-500 font-medium mb-8">You haven't completed any aptitude tests yet.</p>
                            <button
                                onClick={() => navigate('/tests/start')}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                            >
                                Start Your First Test
                            </button>
                        </div>
                    ) : (
                        results.map((test) => (
                            <div
                                key={test._id}
                                onClick={() => navigate(`/tests/result/${test._id}`)}
                                className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-xl flex flex-col items-center justify-center border border-slate-100 shrink-0">
                                        <div className="text-sm font-bold leading-none">{new Date(test.createdAt).getDate()}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider">{new Date(test.createdAt).toLocaleString('default', { month: 'short' })}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{test.category}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                                                {test.difficulty}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                                <Clock size={12} /> 30m Duration
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-900 leading-none mb-1">{test.score}%</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Score</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-900 leading-none mb-1">{test.correctAnswers}/{test.totalQuestions}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Correct</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {results.length > 0 && (
                    <div className="mt-12 p-8 bg-indigo-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Export Assessment History</h3>
                            <p className="text-indigo-100 text-sm font-medium opacity-80">Download a consolidated PDF report of all your completed assessments for your professional portfolio.</p>
                        </div>
                        <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95 whitespace-nowrap">
                            Download Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTests;
