import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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
    Award,
    Save,
    X,
    Lock,
    Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = async () => {
        if (!formData.firstName || !formData.lastName) {
            toast.error('Please fill in all fields');
            return;
        }
        
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', {
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Refresh page to get updated user data
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('Please fill in all password fields');
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
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
                            <div className="text-center md:text-left flex-1">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                placeholder="First Name"
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                                            />
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                placeholder="Last Name"
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={loading}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 flex items-center gap-2"
                                            >
                                                <Save size={16} /> Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({ firstName: user.firstName, lastName: user.lastName });
                                                }}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 flex items-center gap-2"
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 justify-center md:justify-start">
                                            <h2 className="text-3xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                                                Verified {user.role}
                                            </span>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100">
                                                Active Profile
                                            </span>
                                        </div>
                                    </>
                                )}
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

                    {/* Password Change Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                                    <Lock size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Password</h4>
                                    <p className="text-xs text-slate-400">Change your account password</p>
                                </div>
                            </div>
                            {!isChangingPassword && (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                        
                        {isChangingPassword && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    placeholder="Current Password"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                                />
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    placeholder="New Password"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                                />
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    placeholder="Confirm New Password"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 flex items-center gap-2"
                                    >
                                        <Save size={16} /> Update Password
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                        }}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 flex items-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        )}
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
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                                    <p className="text-sm font-bold capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <BadgeCheck size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-indigo-900 leading-none mb-1">Verified Account</h4>
                            <p className="text-xs text-indigo-600/70">Email Verified</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
