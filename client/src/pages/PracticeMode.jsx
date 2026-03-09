import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Search,
    Bell,
    ChevronDown,
    PlayCircle,
    Clock,
    Target,
    Zap,
    Sparkles,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Trophy,
    GraduationCap,
    Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PracticeMode = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [category, setCategory] = useState('Quantitative');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const categories = [
        { id: 'Quantitative', label: 'Quantitative Aptitude' },
        { id: 'Logical', label: 'Logical Reasoning' },
        { id: 'Verbal', label: 'Verbal Ability' },
    ];

    useEffect(() => {
        fetchQuestions();
    }, [category]);

    const fetchQuestions = async () => {
        setLoading(true);
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowFeedback(false);
        try {
            const res = await axios.get(`/api/questions/random?category=${category}&limit=5`);
            setQuestions(res.data);
        } catch (err) {
            toast.error("Failed to load practice questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (idx) => {
        if (showFeedback) return;
        setSelectedOption(idx);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) {
            toast.error("Please select an option first.");
            return;
        }
        setShowFeedback(true);

        const isCorrect = selectedOption === questions[currentIdx].correctAnswer;
        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
            toast.success("Correct Answer!");
        } else {
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
            toast.error("Incorrect. Try to understand the logic.");
        }
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            toast.success("Practice session completed!");
            fetchQuestions(); // Refresh or show summary
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen ml-64 bg-slate-50">
            <div className="w-12 h-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preparing Practice Session...</p>
        </div>
    );

    const q = questions[currentIdx];
    const isCorrect = selectedOption === q?.correctAnswer;

    return (
        <div className="flex-1 p-6 ml-64 min-h-screen bg-slate-50 font-main">
            {/* Professional Header */}
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Practice Mode</h1>
                        <p className="text-slate-500 text-sm">Focus on a specific topic — instant feedback.</p>
                    </div>
                </div>

                <div className="relative min-w-[200px]">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none focus:border-indigo-600 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </header>

            <div className="max-w-4xl mx-auto">
                {/* Question Card */}
                {q && (
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                        <div className="p-8 lg:p-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                                    Question {currentIdx + 1} of {questions.length}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 leading-snug mb-6">
                                {q.questionText}
                            </h3>

                            <div className="grid grid-cols-1 gap-3 mb-6 font-main">
                                {q.options.map((opt, idx) => {
                                    let btnStyle = "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50";
                                    let indicatorStyle = "bg-slate-50 text-slate-400";

                                    if (selectedOption === idx) {
                                        btnStyle = "bg-indigo-50 border-indigo-600 text-indigo-600 ring-2 ring-indigo-50";
                                        indicatorStyle = "bg-indigo-600 text-white";
                                    }

                                    if (showFeedback) {
                                        if (idx === q.correctAnswer) {
                                            btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 ring-4 ring-emerald-50";
                                            indicatorStyle = "bg-emerald-500 text-white";
                                        } else if (selectedOption === idx) {
                                            btnStyle = "bg-rose-50 border-rose-400 text-rose-700 ring-4 ring-rose-50";
                                            indicatorStyle = "bg-rose-500 text-white";
                                        } else {
                                            btnStyle = "bg-white border-slate-100 text-slate-300 opacity-60";
                                            indicatorStyle = "bg-slate-50 text-slate-300";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={showFeedback}
                                            className={`w-full p-4 text-left rounded-2xl font-bold transition-all border-2 flex items-center gap-4 group ${btnStyle}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${indicatorStyle}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="text-sm font-medium">{opt}</span>
                                            {showFeedback && idx === q.correctAnswer && (
                                                <CheckCircle2 size={24} className="ml-auto text-emerald-500" />
                                            )}
                                            {showFeedback && selectedOption === idx && idx !== q.correctAnswer && (
                                                <XCircle size={24} className="ml-auto text-rose-500" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                {!showFeedback ? (
                                    <button
                                        onClick={handleCheckAnswer}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-indigo-50"
                                    >
                                        Check Answer
                                        <CheckCircle2 size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl"
                                    >
                                        {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                                        <ArrowRight size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Success/Error Explainer - Placeholder if needed */}
                            {showFeedback && (
                                <div className={`mt-4 p-4 rounded-2xl border flex items-start gap-4 ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                        <Lightbulb size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">{isCorrect ? 'Excellent Work!' : 'Learning Opportunity'}</h4>
                                        <p className="text-[11px] font-medium opacity-80 leading-relaxed">
                                            {isCorrect
                                                ? "You've successfully solved this problem. Keep up the momentum!"
                                                : `Don't worry! The correct answer was option ${String.fromCharCode(65 + q.correctAnswer)}. Take a moment to review the logic.`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticeMode;
