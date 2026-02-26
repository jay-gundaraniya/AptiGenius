import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, LogOut, Settings, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/tests", icon: BookOpen, label: "My Tests" },
        { to: "/profile", icon: User, label: "Profile" },
    ];

    if (user?.role === 'admin') {
        navItems.splice(2, 0, { to: "/admin", icon: Settings, label: "Admin Panel" });
    }

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-8 fixed left-0 top-0 z-50">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-[#4a54a4] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-100">
                    <Bot size={24} fill="currentColor" />
                </div>
                <span className="font-extrabold text-2xl text-slate-900 tracking-tight">AptiGenius</span>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all ${isActive
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-all group"
                >
                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
