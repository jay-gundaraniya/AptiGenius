import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Award, Target, HelpCircle, Home, RefreshCcw, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultPage = () => {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
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
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold animate-pulse">Calculating Final Results...</p>
        </div>
    );

    const getScoreInfo = (score) => {
        if (score >= 80) return { color: 'text-emerald-500', bg: 'bg-emerald-50', message: 'Outstanding Achievement!' };
        if (score >= 50) return { color: 'text-amber-500', bg: 'bg-amber-50', message: 'Great job! Keep it up.' };
        return { color: 'text-red-500', bg: 'bg-red-50', message: 'Don\'t give up! Keep practicing.' };
    };

    const info = getScoreInfo(result.score);

    return (
        <div className="ml-0 md:ml-64 p-12 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full">
                <header className="text-center mb-12 relative">
                    <div className={`w-24 h-24 rounded-full ${info.bg} ${info.color} flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 relative z-10`}>
                        <TrendingUp size={48} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">Assessment Complete!</h1>
                    <p className="text-slate-500 text-xl font-medium">{info.message}</p>
                    {/* Particles or decoration could go here */}
                </header>

                <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="flex flex-col items-center relative z-10">
                        <div className={`text-[120px] font-black leading-none mb-2 ${info.color}`}>
                            {Math.round(result.score)}<span className="text-4xl ml-2">%</span>
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[4px] mb-12">Overall Performance Score</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 transition-transform hover:-translate-y-1">
                                <Target className="text-indigo-600 mx-auto mb-3" size={32} />
                                <div className="text-3xl font-black text-slate-900 mb-1">{result.correctAnswers}/{result.totalQuestions}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answers</div>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 transition-transform hover:-translate-y-1">
                                <Award className="text-emerald-500 mx-auto mb-3" size={32} />
                                <div className="text-3xl font-black text-slate-900 mb-1">{result.accuracy}%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Accuracy</div>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 transition-transform hover:-translate-y-1">
                                <HelpCircle className="text-amber-500 mx-auto mb-3" size={32} />
                                <div className="text-2xl font-black text-slate-900 mb-1">{result.category}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Track</div>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-col md:flex-row gap-4 w-full max-w-lg mx-auto">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 bg-white border-2 border-slate-200 text-slate-600 py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-95"
                            >
                                <Home size={20} />
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/tests/start')}
                                className="flex-1 bg-[#4a54a4] text-white py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-[#3f4791] active:scale-95 shadow-lg shadow-indigo-100"
                            >
                                Retake Test
                                <RefreshCcw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Bg decoration */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
