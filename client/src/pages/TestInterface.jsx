import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Clock,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    SendHorizonal,
    Target,
    Zap,
    Brain,
    Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const TestInterface = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const params = new URLSearchParams(window.location.search);
    const [timeLeft, setTimeLeft] = useState(parseInt(params.get('limit') || 20) * 90);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

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
            const res = await axios.get(`/api/questions/random?${params.toString()}`);
            if (res.data.length === 0) {
                toast.error("No questions found.");
                navigate('/dashboard');
                return;
            }
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Error loading questions.");
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
            toast.success("Test submitted successfully.");
            navigate(`/tests/result/${res.data._id}`);
        } catch (err) {
            toast.error("Failed to submit results.");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen ml-64 bg-slate-50">
            <div className="w-12 h-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Loading Test Content</h2>
            <p className="text-slate-500 text-sm font-medium">Please wait while we prepare your assessment...</p>
        </div>
    );

    const q = questions[currentIdx];

    return (
        <div className="ml-64 min-h-screen bg-white flex flex-col font-main">
            {/* Nav Header */}
            <nav className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 font-bold text-sm">
                        <Target size={16} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 leading-none mb-0.5">Aptitude Test</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">{params.get('category')}</span>
                            <span className="text-slate-300 text-[8px]">•</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{params.get('difficulty')} Level</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 py-1.5 px-4 rounded-lg font-bold text-base ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-900 border border-slate-100'}`}>
                        <Clock size={16} className={timeLeft < 300 ? 'text-red-600' : 'text-indigo-600'} />
                        {formatTime(timeLeft)}
                    </div>

                    <button
                        onClick={() => { if (window.confirm('Finish and submit your answers?')) handleSubmit(); }}
                        className="bg-slate-900 text-white py-2 px-6 rounded-lg font-bold text-xs tracking-wide hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-100 flex items-center gap-2"
                    >
                        Finish Test
                        <SendHorizonal size={16} />
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 max-w-7xl mx-auto w-full">
                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto pb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                                Question {currentIdx + 1} of {questions.length}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-6">
                            <h3 className="text-xl font-bold text-slate-900 leading-snug mb-6">
                                {q.questionText}
                            </h3>

                            <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(q._id, idx)}
                                        className={`w-full p-4 text-left rounded-2xl font-bold transition-all border-2 flex items-center gap-3 group ${answers[q._id] === idx
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-sm shadow-indigo-50'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${answers[q._id] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`text-sm font-medium ${answers[q._id] === idx ? 'text-indigo-900' : 'text-slate-500'}`}>{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-6 border-t border-slate-100">
                            <button
                                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-all font-medium"
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>

                            <div className="flex gap-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentIdx(idx)}
                                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentIdx
                                            ? 'bg-indigo-600 w-6'
                                            : (answers[questions[idx]._id] !== undefined ? 'bg-indigo-200' : 'bg-slate-200')
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIdx === questions.length - 1}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-30 transition-all font-medium"
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Navigator Panel */}
                <aside className="w-72 bg-slate-50 border-l border-slate-100 p-6 flex flex-col sticky top-16 h-[calc(100vh-64px)] hidden lg:flex">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Jump to Question</h4>

                    <div className="grid grid-cols-5 gap-1.5 mb-8">
                        {questions.map((qItem, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIdx(idx)}
                                className={`aspect-square rounded-xl font-bold text-sm flex items-center justify-center transition-all border ${currentIdx === idx
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                    : (answers[qItem._id] !== undefined
                                        ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default TestInterface;
