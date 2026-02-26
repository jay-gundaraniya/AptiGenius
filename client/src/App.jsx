import React, { useState } from 'react';
import {
    AtSign,
    Key,
    Eye,
    EyeOff,
    ArrowRight,
    Bot,
    Chrome,
    User
} from 'lucide-react';
import axios from 'axios';

import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup({ firstName, lastName, email, password });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-[#f1f5f9]">
            <div className="flex w-full max-w-[1100px] h-[90vh] max-h-[800px] bg-white rounded-[32px] shadow-2xl overflow-hidden">
                {/* Left Side */}
                <div className="flex-1 bg-gradient-to-br from-[#5d69be] to-[#4a54a4] p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-2xl font-bold mb-5">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#4a54a4]">
                                <Bot size={20} fill="currentColor" />
                            </div>
                            AptiGenius
                        </div>

                        <div className="mt-10 mr-10">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-5">
                                Your AI Sidekick for <span className="text-[#10b981]">Career Success.</span>
                            </h1>
                            <p className="text-lg opacity-90 max-w-sm">
                                Level up your skills with a personalized AI coach designed for the next generation of achievers.
                            </p>
                        </div>
                    </div>

                    <div className="relative h-64 flex items-center justify-center z-10">
                        <div className="opacity-20">
                            <Bot size={120} strokeWidth={1} />
                        </div>

                        <div className="absolute top-[10%] right-[15%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-xl animate-float-slow transition-transform rotate-12">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" className="w-12 h-12 rounded-xl" />
                        </div>

                        <div className="absolute bottom-[10%] left-[10%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-xl animate-float-slow transition-transform -rotate-12">
                            <div className="flex -space-x-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="user" className="w-12 h-12 rounded-xl border-2 border-white/20" />
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" alt="user" className="w-12 h-12 rounded-xl border-2 border-white/20" />
                            </div>
                        </div>

                        <div className="absolute bottom-1/4 right-[15%] w-12 h-12 flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <ArrowRight size={20} className="rotate-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-semibold z-10">
                        <div className="flex items-center">
                            <span className="bg-white/20 py-1 px-2.5 rounded-full mr-2">+2k</span>
                            Future-ready students
                        </div>
                        <div className="tracking-widest opacity-80 uppercase">READY TO SHINE?</div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side */}
                <div className="flex-[1.1] p-10 md:p-14 flex flex-col overflow-y-auto bg-white">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{isLogin ? 'Welcome Back!' : 'Create your account'}</h2>
                        <p className="text-slate-500">{isLogin ? 'Ready to continue your learning journey?' : 'Join our community and start your journey today.'}</p>
                    </div>

                    <div className="mb-6">
                        <button className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-3 transition-colors hover:bg-slate-50">
                            <div className="text-blue-500 flex items-center">
                                <Chrome size={18} />
                            </div>
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {isLogin ? 'OR USE EMAIL' : 'OR SIGN UP WITH EMAIL'}
                        </span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm font-semibold mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">First Name</label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Jane"
                                            className="w-full py-3 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Last Name</label>
                                    <div className="relative flex items-center">
                                        <User className="absolute left-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full py-3 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email Address</label>
                            <div className="relative flex items-center">
                                <AtSign className="absolute left-3.5 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder={isLogin ? "hello@youreachiever.com" : "jane@example.com"}
                                    className="w-full py-3 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                            </div>
                            <div className="relative flex items-center">
                                <Key className="absolute left-3.5 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full py-3 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="absolute right-3.5 text-slate-400 cursor-pointer hover:text-indigo-600" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                            {isLogin && (
                                <div className="mt-2 text-right">
                                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Forgot Password?</a>
                                </div>
                            )}
                            {!isLogin && <p className="text-[10px] text-slate-500 mt-1.5">At least 8 characters with a mix of letters and numbers.</p>}
                        </div>

                        <div className="my-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    checked={isLogin ? true : agreeTerms}
                                    onChange={(e) => !isLogin && setAgreeTerms(e.target.checked)}
                                />
                                <span className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {isLogin ? 'Keep me logged in' : (
                                        <span>
                                            By creating an account, you agree to our <a href="#" className="text-indigo-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 font-bold hover:underline">Privacy Policy</a>.
                                        </span>
                                    )}
                                </span>
                            </label>
                        </div>

                        <button
                            className="w-full py-4 bg-[#4a54a4] text-white rounded-xl text-lg font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                            type="submit"
                            disabled={loading || (!isLogin && !agreeTerms)}
                        >
                            {loading ? 'Processing...' : (isLogin ? "Let's Go" : "Create Account")}
                            {isLogin && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-slate-500 font-medium">
                            {isLogin ? "New to the community?" : "Already have an account?"}{" "}
                            <a href="#" className="text-emerald-500 font-bold hover:underline" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                                {isLogin ? 'Create your account' : 'Sign in'}
                            </a>
                        </p>
                    </div>

                    <div className="mt-auto pt-6 text-[10px] font-bold text-slate-400 text-center tracking-widest uppercase">
                        PROUDLY BUILT FOR FUTURE ACHIEVERS • TERMS • PRIVACY
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
