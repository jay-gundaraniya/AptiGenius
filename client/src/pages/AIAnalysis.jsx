import React from 'react';
import {
    Sparkles,
    Brain,
    Search,
    Bell,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Zap,
    Target,
    Activity,
    Navigation,
    Award,
    ShieldCheck,
    Bot,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIAnalysis = () => {
    const { user } = useAuth();

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
                    <div className="text-3xl font-bold text-slate-900 mb-1">94%</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Confidence</div>
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed">Based on your recent 12 assessment sessions.</p>
                </div>

                {/* Main Insight Hero */}
                <div className="lg:col-span-3 bg-indigo-600 rounded-3xl p-10 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20">
                            <Zap size={14} /> Performance Summary
                        </div>
                        <h2 className="text-4xl font-bold mb-4 tracking-tight">You're in the Top 5%</h2>
                        <p className="text-indigo-100 text-lg leading-relaxed max-w-xl opacity-90">
                            Our analysis indicates exceptional proficiency in <span className="font-bold">Logical Reasoning</span>. You're currently outperforming 95% of candidates in similar tiers.
                        </p>
                    </div>
                    <div className="hidden lg:block w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <TrendingUp size={64} className="text-white opacity-50" />
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
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Precision</div>
                            <p className="text-sm text-slate-600 font-medium">92% accuracy in Data Interpretation drills.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Speed</div>
                            <p className="text-sm text-slate-600 font-medium">Solving Quantitative questions 15% faster.</p>
                        </div>
                    </div>
                </div>

                {/* Focus Areas */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Priority Focus</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Logic Lag</div>
                            <p className="text-sm text-slate-600 font-medium">Syllogism recall drops after 45 mins of testing.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Pattern Drill</div>
                            <p className="text-sm text-slate-600 font-medium">Needs improvement in abstract pattern matching.</p>
                        </div>
                    </div>
                </div>

                {/* Action Plan */}
                <div className="bg-[#1e293b] p-8 rounded-3xl shadow-xl shadow-slate-200 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                            <span className="text-sm text-slate-300">Take 2 dedicated Syllogism drills.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                            <span className="text-sm text-slate-300">Review morning session errors.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                            <span className="text-sm text-slate-300">Attempt 1 full-length mock test.</span>
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors">Launch Drills</button>
                </div>
            </div>

            {/* Placement Roadmap */}
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Readiness Roadmap</h3>
                        <p className="text-slate-500 text-sm">Path to achieving your career goals based on AI modeling.</p>
                    </div>
                    <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 text-center">
                        <div className="text-2xl font-bold text-emerald-700">Tier 1 Target</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Forecast</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center opacity-50">
                        <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 size={20} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Baseline</h4>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center opacity-50">
                        <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 size={20} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Foundation</h4>
                    </div>
                    <div className="p-8 bg-indigo-600 rounded-2xl text-white flex flex-col items-center text-center shadow-lg shadow-indigo-100">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                            <Activity size={24} className="animate-pulse" />
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Elite Mastery</h4>
                        <div className="text-[10px] font-bold text-indigo-200">ACTIVE</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center opacity-40">
                        <div className="w-10 h-10 bg-white text-slate-300 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                            <Target size={20} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mock Pro</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysis;
