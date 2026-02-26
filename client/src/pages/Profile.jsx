import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, Calendar, User, ArrowRight } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Profile</h1>
                <p className="text-slate-500 text-lg font-medium">Manage your account settings and preferences.</p>
            </header>

            <div className="max-w-4xl bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-10 mb-12 relative z-10">
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#5d69be] to-[#4a54a4] text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-200">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">{user.firstName} {user.lastName}</h2>
                        <span className="inline-flex py-1.5 px-4 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                            Verified {user.role} Account
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                            <Mail size={16} /> Email Address
                        </label>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600">
                            {user.email}
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                            <Shield size={16} /> Access Privileges
                        </label>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600">
                            {user.role === 'admin' ? 'System Administrator' : 'Standard Student'}
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-slate-50 border border-slate-100 rounded-[32px] flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                        <p className="text-xl font-extrabold text-slate-900">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <button className="ml-auto w-12 h-12 bg-white text-slate-300 rounded-2xl flex items-center justify-center hover:text-indigo-600 hover:shadow-md transition-all">
                        <ArrowRight size={24} />
                    </button>
                </div>

                {/* Bg Decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/30 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
            </div>
        </div>
    );
};

export default Profile;
