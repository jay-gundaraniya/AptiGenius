import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Mail,
    Shield,
    Calendar,
    User,
    ArrowRight,
    Camera,
    BadgeCheck,
    Settings,
    LogOut,
    ArrowUpRight,
    Zap,
    Target,
    Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return (
        <div className="flex-1 p-12 ml-64 min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500 text-sm">Manage your profile and account preferences.</p>
            </header>

            <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-indigo-100">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{user.firstName} {user.lastName}</h2>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                                        Verified {user.role}
                                    </span>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100">
                                        Active Profile
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Tier</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">
                                    {user.role === 'admin' ? 'Administrator' : 'Student Candidate'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <Settings size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 leading-none mb-1">Preferences</h4>
                                    <p className="text-xs text-slate-400">Manage notifications & data.</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group hover:bg-red-50 transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                                    <LogOut size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 leading-none mb-1">Sign Out</h4>
                                    <p className="text-xs text-red-400">End your current session.</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-red-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>

                {/* Account Activity */}
                <div className="space-y-6">
                    <div className="bg-[#1e293b] p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
                        <h3 className="text-lg font-bold mb-6">Activity Summary</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                                    <p className="text-sm font-bold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold">Active & Secure</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400 border border-white/10">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tier</p>
                                    <p className="text-sm font-bold">Top 5% Candidate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <BadgeCheck size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-900 leading-none mb-1">Pro Account</h4>
                            <p className="text-xs text-indigo-600/70">Verified Professional</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
