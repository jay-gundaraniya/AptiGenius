import React, { useState, useEffect } from 'react';
import { resultsAPI } from '../services/api';
import {
    Sparkles,
    Brain,
    Search,
    Bell,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Zap,
    Target,
    Activity,
    Navigation,
    Award,
    ShieldCheck,
    Bot,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AIAnalysis = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState({
        readinessLevel: 'Low',
        readinessScore: 0,
        confidence: 0,
        avgScore: 0,
        avgAccuracy: 0,
        testCount: 0,
        improvementTrend: 'neutral',
        strengths: [],
        weaknesses: [],
        topicPerformance: [],
        recommendations: ['Take your first test to get AI analysis']
    });

    useEffect(() => {
        fetchAIAnalysis();
    }, []);

    const fetchAIAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching AI analysis...');
            const res = await resultsAPI.getAIReadiness();
            
            console.log('AI Analysis Response:', res.data);
            if (res.data) {
                setAnalysis(res.data);
            }
        } catch (err) {
            console.error('AI Analysis Error:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
            
            let errorMsg = 'Failed to load AI analysis';
            if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (err.message) {
                errorMsg = err.message;
            }
            
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen ml-64 bg-slate-50">
            <div className="w-12 h-12 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyzing Your Performance...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen ml-64 bg-slate-50">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle size={32} />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-2">Unable to Load Analysis</p>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button 
                onClick={fetchAIAnalysis}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2"
            >
                <RefreshCw size={18} /> Try Again
            </button>
        </div>
    );

    const getReadinessColor = (level) => {
        if (level === 'High') return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
        if (level === 'Medium') return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
        return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    };

    const readinessStyle = getReadinessColor(analysis?.readinessLevel || 'Low');

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen">
            {/* Professional Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Performance Insights</h1>
                    <p className="text-slate-500 text-sm">Advanced analysis of your cognitive footprint and readiness.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
                        <div className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 flex items-center gap-2">
                            <Bot size={14} /> AI Active
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                {/* Confidence Meter */}
                <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{analysis?.confidence || 0}%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Confidence</div>
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed">Based on your {analysis?.testCount || 0} assessment sessions.</p>
                </div>

                {/* Main Insight Hero */}
                <div className={`lg:col-span-3 rounded-3xl p-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-10 ${analysis?.readinessLevel === 'High' ? 'bg-emerald-600 shadow-emerald-100' : analysis?.readinessLevel === 'Medium' ? 'bg-amber-500 shadow-amber-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20">
                            <Zap size={14} /> Performance Summary
                        </div>
                        <h2 className="text-4xl font-bold mb-4 tracking-tight">
                            {analysis?.readinessLevel === 'High' ? 'Placement Ready!' : 
                             analysis?.readinessLevel === 'Medium' ? 'Almost There!' : 
                             'Keep Practicing!'}
                        </h2>
                        <p className="text-white/90 text-lg leading-relaxed max-w-xl">
                            {analysis?.readinessLevel === 'High' 
                                ? `Your readiness score is ${analysis?.readinessScore}%. You're performing excellently with ${analysis?.avgAccuracy}% average accuracy.`
                                : analysis?.readinessLevel === 'Medium'
                                ? `Your readiness score is ${analysis?.readinessScore}%. With some more practice, you'll be placement ready.`
                                : `Your readiness score is ${analysis?.readinessScore || 0}%. Focus on building fundamentals through consistent practice.`
                            }
                        </p>
                    </div>
                    <div className="hidden lg:flex w-32 h-32 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/10">
                        {analysis?.improvementTrend === 'improving' ? (
                            <TrendingUp size={64} className="text-white opacity-50" />
                        ) : analysis?.improvementTrend === 'declining' ? (
                            <TrendingDown size={64} className="text-white opacity-50" />
                        ) : (
                            <Activity size={64} className="text-white opacity-50" />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Strengths */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Core Strengths</h3>
                    <div className="space-y-4">
                        {analysis?.strengths?.length > 0 ? (
                            analysis.strengths.map((strength, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">{strength}</div>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {analysis?.topicPerformance?.find(t => t.category === strength)?.accuracy || 0}% accuracy
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm text-slate-500 font-medium">Complete more tests to identify strengths</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Focus Areas */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Priority Focus</h3>
                    <div className="space-y-4">
                        {analysis?.weaknesses?.length > 0 ? (
                            analysis.weaknesses.map((weakness, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{weakness}</div>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {analysis?.topicPerformance?.find(t => t.category === weakness)?.accuracy || 0}% accuracy - Needs improvement
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm text-slate-500 font-medium">No weak areas identified yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Plan */}
                <div className="bg-[#1e293b] p-8 rounded-3xl shadow-xl shadow-slate-200 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Recommendations</h3>
                    <ul className="space-y-4 mb-8">
                        {analysis?.recommendations?.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</div>
                                <span className="text-sm text-slate-300">{rec}</span>
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => navigate('/practice')}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                        Start Practice
                    </button>
                </div>
            </div>

            {/* Readiness Score Card */}
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Placement Readiness Score</h3>
                        <p className="text-slate-500 text-sm">AI-calculated score based on your overall performance.</p>
                    </div>
                    <div className={`${readinessStyle.bg} px-6 py-3 rounded-2xl border ${readinessStyle.border} text-center`}>
                        <div className={`text-2xl font-bold ${readinessStyle.text}`}>{analysis?.readinessScore || 0}/100</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{analysis?.readinessLevel || 'N/A'} Readiness</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
                            <Target size={20} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{analysis?.avgAccuracy || 0}%</div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Accuracy</h4>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{analysis?.testCount || 0}</div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tests Taken</h4>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="w-10 h-10 bg-white text-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
                            {analysis?.improvementTrend === 'improving' ? <TrendingUp size={20} /> : 
                             analysis?.improvementTrend === 'declining' ? <TrendingDown size={20} /> : 
                             <Activity size={20} />}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 capitalize">{analysis?.improvementTrend || 'N/A'}</div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trend</h4>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="w-10 h-10 bg-white text-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
                            <Award size={20} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{analysis?.strengths?.length || 0}</div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strong Topics</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysis;
