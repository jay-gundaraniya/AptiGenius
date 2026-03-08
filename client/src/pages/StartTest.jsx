import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain,
    Thermometer,
    List,
    ArrowRight,
    ChevronLeft,
    Zap,
    Trophy,
    GraduationCap,
    Clock,
    Target,
    ChevronDown // Ensure ChevronDown is imported
} from 'lucide-react';

const StartTest = () => {
    const [category, setCategory] = useState('Quantitative');
    const [difficulty, setDifficulty] = useState('Medium');
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    const handleStart = () => {
        navigate(`/tests/run?category=${category}&difficulty=${difficulty}&limit=${limit}`);
    };

    const categories = [
        { id: 'Quantitative', label: 'Quantitative', icon: List, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Mathematical reasoning' },
        { id: 'Logical', label: 'Logical', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Puzzles and patterns' },
        { id: 'Verbal', label: 'Verbal', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Grammar and vocabulary' },
    ];

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen bg-slate-50 font-main">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-indigo-600 transition-all mb-8 group"
            >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <header className="mb-10 max-w-5xl">
                <h1 className="text-3xl font-bold text-slate-900">New Assessment</h1>
                <p className="text-slate-500 text-sm mt-1">Configure your test parameters and start your assessment session.</p>
            </header>

            <div className="max-w-4xl">
                {/* Configuration Form */}
                <div className="bg-white p-8 lg:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-10">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                            01. Select Category
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`relative p-6 rounded-2xl font-bold text-left border transition-all ${category === cat.id
                                        ? 'bg-white border-indigo-600 ring-4 ring-indigo-50'
                                        : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${category === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                        <cat.icon size={20} />
                                    </div>
                                    <div className="text-sm font-bold text-slate-900 mb-1">{cat.label}</div>
                                    <div className="text-[10px] font-medium text-slate-400">{cat.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                02. Difficulty Level
                            </label>
                            <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
                                {['Easy', 'Medium', 'Hard'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setDifficulty(diff)}
                                        className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${difficulty === diff
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                03. Question Count & Duration
                            </label>
                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        value={limit}
                                        onChange={(e) => setLimit(parseInt(e.target.value))}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-600 transition-all appearance-none cursor-pointer text-sm pr-10"
                                    >
                                        <option value={5}>5 Questions</option>
                                        <option value={10}>10 Questions</option>
                                        <option value={15}>15 Questions</option>
                                        <option value={20}>20 Questions</option>
                                        <option value={30}>30 Questions</option>
                                        <option value={50}>50 Questions</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                                    <Clock size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Estimated Time: {limit * 1.5} Minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] mt-4 shadow-lg shadow-indigo-50"
                    >
                        Start Assessment
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartTest;
