import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Thermometer, List, ArrowRight, ChevronLeft } from 'lucide-react';

const StartTest = () => {
    const [category, setCategory] = useState('Quantitative');
    const [difficulty, setDifficulty] = useState('Medium');
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate();

    const handleStart = () => {
        navigate(`/tests/run?category=${category}&difficulty=${difficulty}&limit=${limit}`);
    };

    return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Configure Your Assessment</h1>
                <p className="text-slate-500 text-lg">Customize the test parameters to match your current skill level.</p>
            </header>

            <div className="max-w-xl bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 flex flex-col gap-8">
                <div>
                    <label className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-widest mb-4">
                        <List size={16} className="text-indigo-600" />
                        Select Category
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {['Quantitative', 'Logical', 'Verbal'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`w-full p-4 rounded-2xl font-bold flex items-center justify-between border-2 transition-all ${category === cat
                                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                <span>{cat}</span>
                                {category === cat && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-widest mb-4">
                        <Thermometer size={16} className="text-amber-500" />
                        Difficulty Level
                    </label>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setDifficulty(diff)}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${difficulty === diff
                                        ? 'bg-white text-slate-900 shadow-md'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-widest mb-4">
                        <Brain size={16} className="text-emerald-500" />
                        No. of Questions
                    </label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-600 transition-all"
                    >
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={15}>15 Questions</option>
                        <option value={20}>20 Questions</option>
                    </select>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-5 bg-[#4a54a4] text-white rounded-2xl text-xl font-black transition-all hover:bg-[#3f4791] hover:shadow-xl hover:shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] mt-4 shadow-lg shadow-indigo-100"
                >
                    Launch Assessment
                    <ArrowRight size={22} />
                </button>
            </div>
        </div>
    );
};

export default StartTest;
