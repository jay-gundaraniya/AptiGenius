import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CheckCircle2,
    Award,
    Target,
    HelpCircle,
    Home,
    RefreshCcw,
    TrendingUp,
    Zap,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Search,
    Bell,
    Share2,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ResultPage = () => {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const res = await axios.get('/api/results/my-results');
            const found = res.data.find(r => r._id === resultId);
            if (!found) {
                toast.error("Result not found");
                navigate('/dashboard');
                return;
            }
            setResult(found);
        } catch (err) {
            console.error(err);
        }
    };

    if (!result) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <div className="w-12 h-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Analyzing Results</h2>
            <p className="text-slate-500 text-sm font-medium">Generating your performance report...</p>
        </div>
    );

    const score = Math.round(result.score);
    const getLevel = (s) => {
        if (s >= 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Outstanding performance! You are well-prepared for technical assessments.' };
        if (s >= 60) return { label: 'Good', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', desc: 'Solid foundation. A bit more practice will help you achieve top scores.' };
        return { label: 'Needs Improvement', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Focus on practicing fundamental concepts to improve your speed and accuracy.' };
    };

    const lvl = getLevel(score);

    return (
        <div className="flex-1 p-12 ml-64 min-h-screen bg-slate-50 font-main">
            <header className="mb-12 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900">Test Assessment Result</h1>
                <p className="text-slate-500 text-sm mt-1">Review your performance across various aptitude domains.</p>
            </header>

            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white p-12 lg:p-16 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden mb-12">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200">
                            <Award size={32} />
                        </div>

                        <div className={`text-8xl font-bold leading-none mb-6 ${lvl.color}`}>
                            {score}<span className="text-4xl ml-2 opacity-50">%</span>
                        </div>

                        <div className={`px-6 py-2 rounded-full ${lvl.bg} ${lvl.color} border ${lvl.border} text-xs font-bold uppercase tracking-widest mb-6`}>
                            {lvl.label}
                        </div>

                        <p className="max-w-xl text-slate-500 font-medium leading-relaxed mb-12">
                            {lvl.desc}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full py-10 border-t border-slate-50">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all">
                                <Target size={24} className="text-indigo-600 mx-auto mb-4" />
                                <div className="text-2xl font-bold text-slate-900">{result.correctAnswers}/{result.totalQuestions}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Correct Answers</div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all">
                                <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-4" />
                                <div className="text-2xl font-bold text-slate-900">{result.accuracy}%</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Accuracy</div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all">
                                <Zap size={24} className="text-amber-500 mx-auto mb-4" />
                                <div className="text-2xl font-bold text-slate-900 truncate px-2">{result.category}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Subject Area</div>
                            </div>
                        </div>
                    </div>

                    {/* Minimal decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-0"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Home size={18} />
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/tests/start')}
                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-100"
                    >
                        Retake Test
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
