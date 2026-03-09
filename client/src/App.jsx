import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const App = () => {
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial state based on route or prop if needed, defaulting to login.
    const [isLogin, setIsLogin] = useState(location.pathname === '/register' ? false : true);

    // Toggle for student/admin
    const [loginRole, setLoginRole] = useState('student'); // 'student' or 'admin'

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const data = await login(email, password);
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                const data = await signup({ firstName, lastName, email, password, role: loginRole });
                navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-main">
            {/* Left Side (Professional Dark Slate) */}
            <div className="hidden lg:flex flex-col flex-1 bg-[#1e293b] p-16 text-white relative">
                <Link to="/" className="flex items-center gap-3 w-fit mb-auto group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Brain size={24} color="white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight">AptiGenius</span>
                </Link>

                <div className="my-auto max-w-lg">
                    <div className="w-12 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        {isLogin ? 'Welcome Back to Excellence' : 'Start Your Professional Journey'}
                    </h1>
                    <p className="text-slate-400 text-xl leading-relaxed mb-12">
                        {isLogin
                            ? 'Continue mastering your aptitude skills with our professional assessment tools.'
                            : 'Join a community of top candidates optimizing their potential with AI-driven insights.'}
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-white mb-2">200+</p>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Curated Tests</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white mb-2">99%</p>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Success Rate</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-800 text-slate-500 text-sm font-medium">
                    © 2026 AptiGenius Hub. All rights reserved.
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="flex flex-col flex-1 justify-center px-8 sm:px-16 lg:px-24 bg-white relative">
                <div className="w-full max-w-md mx-auto">
                    <header className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isLogin ? 'Enter your credentials to access your dashboard' : 'Fill in the details to get started for free'}
                        </p>
                    </header>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold mb-8 border border-red-100 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {isLogin && (
                        <div className="bg-slate-50 p-1.5 rounded-xl flex mb-8 border border-slate-100">
                            <button
                                type="button"
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setLoginRole('student')}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginRole === 'admin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                onClick={() => setLoginRole('admin')}
                            >
                                Admin
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {!isLogin && (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">First Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Jane"
                                            className="w-full py-3 px-4 pl-12 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full py-3 px-4 pl-12 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full py-3 px-4 pl-12 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                {isLogin && <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full py-3 px-4 pl-12 bg-white border border-slate-200 rounded-xl text-sm transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-indigo-100 active:scale-[0.98]"
                        >
                            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-sm font-medium">
                        <p className="text-slate-500 mb-4">
                            {isLogin ? "New to the platform? " : "Already have an account? "}
                            <button type="button" className="text-indigo-600 font-bold hover:underline ml-1" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Create Account' : 'Sign In'}
                            </button>
                        </p>
                        <Link to="/" className="text-slate-400 font-bold hover:text-slate-600 flex items-center justify-center gap-1.5 group">
                            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors">
                                <ArrowRight size={12} className="rotate-180" />
                            </div>
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
