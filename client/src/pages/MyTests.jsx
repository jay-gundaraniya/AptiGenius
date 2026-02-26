import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Trophy, Calendar, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyTests = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
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
        <div className="ml-64 p-12 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Test History</h1>
                    <p className="text-slate-500 text-lg font-medium">Track your performance across all assessments.</p>
                </div>
            </header>

            {results.length === 0 ? (
                <div className="bg-white p-20 rounded-[48px] shadow-sm border border-slate-100 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                        <ClipboardList size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">No tests taken yet</h2>
                    <p className="text-slate-500 text-lg mb-10 max-w-md leading-relaxed">
                        Complete your first aptitude test to see your performance metrics and growth over time.
                    </p>
                    <button
                        onClick={() => navigate('/tests/start')}
                        className="bg-[#4a54a4] text-white py-4 px-10 rounded-2xl text-xl font-black transition-all hover:bg-[#3f4791] shadow-lg shadow-indigo-100 active:scale-95 flex items-center gap-3"
                    >
                        Start Your First Test
                        <ChevronRight size={24} />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-5xl">
                    {results.map((r) => (
                        <div
                            key={r._id}
                            onClick={() => navigate(`/tests/result/${r._id}`)}
                            className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between cursor-pointer transition-all hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 group"
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-transform group-hover:scale-110 ${r.score >= 70 ? 'bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-50' : 'bg-amber-50 text-amber-500 shadow-lg shadow-amber-50'
                                    }`}>
                                    <Trophy size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{r.category} Track</h3>
                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className={r.difficulty === 'Hard' ? 'text-red-500' : (r.difficulty === 'Medium' ? 'text-amber-500' : 'text-emerald-500')}>{r.difficulty} Mode</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <div className={`text-4xl font-black mb-0.5 leading-none ${r.score >= 70 ? 'text-emerald-500' : (r.score >= 40 ? 'text-amber-500' : 'text-red-500')
                                        }`}>
                                        {Math.round(r.score)}%
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Final Score</div>
                                </div>
                                <div className="p-3 bg-slate-50 text-slate-300 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-all group-hover:translate-x-1">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTests;
