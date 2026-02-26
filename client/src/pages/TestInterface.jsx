import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckSquare, ChevronLeft, ChevronRight, AlertTriangle, SendHorizonal } from 'lucide-react';
import toast from 'react-hot-toast';

const TestInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        fetchQuestions();
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`/api/questions?${params.toString()}`);
            if (res.data.length === 0) {
                toast.error("No questions found for this selection.");
                navigate('/dashboard');
                return;
            }
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Error fetching questions.");
            navigate('/dashboard');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (qId, optIdx) => {
        setAnswers({ ...answers, [qId]: optIdx });
    };

    const handleSubmit = async () => {
        let score = 0;
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q._id] === q.correctAnswer) {
                correctCount++;
            }
        });

        score = (correctCount / questions.length) * 100;

        try {
            const res = await axios.post('/api/results/submit', {
                score,
                totalQuestions: questions.length,
                correctAnswers: correctCount,
                category: params.get('category'),
                difficulty: params.get('difficulty')
            });
            toast.success("Test submitted successfully!");
            navigate(`/tests/result/${res.data._id}`);
        } catch (err) {
            toast.error("Failed to submit results.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold animate-pulse">Initializing Assessment...</p>
        </div>
    );

    const q = questions[currentIdx];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Nav Header */}
            <nav className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 text-white p-2 rounded-xl">
                        <CheckSquare size={24} />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-slate-900 leading-none mb-1">Live Assessment</h2>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{params.get('category')} • {params.get('difficulty')}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-3 py-2 px-6 rounded-2xl font-black text-xl shadow-sm ${timeLeft < 300 ? 'bg-red-50 text-red-500 animate-pulse border border-red-100' : 'bg-slate-50 text-slate-900'}`}>
                    <Clock size={24} className={timeLeft < 300 ? 'text-red-500' : 'text-indigo-600'} />
                    {formatTime(timeLeft)}
                </div>

                <button
                    onClick={() => { if (window.confirm('Finish and submit now?')) handleSubmit(); }}
                    className="flex items-center gap-2 bg-[#4a54a4] text-white py-3 px-6 rounded-2xl font-bold hover:bg-[#3f4791] transition-all active:scale-95 shadow-lg shadow-indigo-100"
                >
                    Finish Test
                    <SendHorizonal size={18} />
                </button>
            </nav>

            <div className="flex flex-1">
                {/* Main Question Area */}
                <main className="flex-1 p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <span className="bg-white py-2 px-4 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm shadow-sm">
                                Question <span className="text-indigo-600">{currentIdx + 1}</span> of {questions.length}
                            </span>
                        </div>

                        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 mb-8">
                            <h3 className="text-2xl font-extrabold text-slate-900 leading-relaxed mb-10">
                                {q.questionText}
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {q.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(q._id, idx)}
                                        className={`w-full p-6 text-left rounded-3xl font-bold transition-all border-2 flex items-center gap-4 group ${answers[q._id] === idx
                                                ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                                                : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors font-black ${answers[q._id] === idx ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-lg">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            <div className="flex gap-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIdx ? 'bg-indigo-600 w-8' : (answers[questions[idx]._id] !== undefined ? 'bg-indigo-200' : 'bg-slate-200')
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIdx === questions.length - 1}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Question Map Panel */}
                <aside className="w-80 bg-white border-l border-slate-200 p-10 flex flex-col sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                        Question Status
                    </h4>

                    <div className="grid grid-cols-4 gap-3 mb-auto">
                        {questions.map((qItem, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIdx(idx)}
                                className={`aspect-square rounded-2xl font-black text-sm flex items-center justify-center transition-all border-2 ${currentIdx === idx
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110 z-10'
                                        : (answers[qItem._id] !== undefined
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100')
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                            <AlertTriangle size={16} /> Auto-Submit
                        </div>
                        <p className="text-xs text-amber-600 leading-relaxed font-medium">
                            Leaving this page or closing the tab will not pause the timer. The test will auto-submit when the clock hits zero.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TestInterface;
