import { useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    BarChart3,
    Sparkles,
    User,
    UserCircle,
    LogOut,
    Brain,
    Shield,
    History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = user?.role === 'admin'
        ? [
            { to: "/admin", icon: LayoutDashboard, label: "Admin Panel" },
            { to: "/admin/questions", icon: BookOpen, label: "Questions" },
            { to: "/admin/students", icon: User, label: "Students" },
            { to: "/profile", icon: UserCircle, label: "Profile" },
        ]
        : [
            { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/tests/start", icon: FileText, label: "Take Test" },
            { to: "/tests", icon: History, label: "My Tests" },
            { to: "/practice", icon: BookOpen, label: "Practice Mode" },
            { to: "/analytics", icon: BarChart3, label: "Analytics" },
            { to: "/ai-analysis", icon: Sparkles, label: "AI Analysis" },
            { to: "/profile", icon: UserCircle, label: "Profile" },
        ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0 z-50">
            <div
                className="flex items-center gap-2 mb-10 px-2 cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
            >
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                    <Brain size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">AptiGenius</span>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
