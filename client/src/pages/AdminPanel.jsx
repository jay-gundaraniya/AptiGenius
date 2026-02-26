import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Users, BookOpen, ClipboardList, Clock, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('questions');
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [overview, setOverview] = useState({ totalStudents: 0, totalQuestions: 0, totalResults: 0 });

    // Question Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: 'Quantitative',
        difficulty: 'Medium'
    });

    useEffect(() => {
        fetchOverview();
        if (activeTab === 'questions') fetchQuestions();
        if (activeTab === 'results') fetchResults();
        if (activeTab === 'students') fetchUsers();
    }, [activeTab]);

    const fetchOverview = async () => {
        try {
            const res = await axios.get('/api/results/overview');
            setOverview(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('/api/questions/all');
            setQuestions(res.data);
        } catch (err) {
            toast.error('Failed to load questions');
        }
    };

    const fetchResults = async () => {
        try {
            const res = await axios.get('/api/results/all');
            setResults(res.data);
        } catch (err) {
            toast.error('Failed to load results');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to load students');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`/api/auth/users/${id}`);
                fetchUsers();
                fetchOverview();
                toast.success('User deleted');
            } catch (err) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/questions/${editingId}`, formData);
                toast.success('Question updated');
            } else {
                await axios.post('/api/questions', formData);
                toast.success('Question added');
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                category: 'Quantitative',
                difficulty: 'Medium'
            });
            fetchQuestions();
            fetchOverview();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this question?')) {
            try {
                await axios.delete(`/api/questions/${id}`);
                fetchQuestions();
                fetchOverview();
                toast.success('Deleted');
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    const tabs = [
        { id: 'questions', label: 'Question Bank', icon: BookOpen },
        { id: 'results', label: 'Student Results', icon: ClipboardList },
        { id: 'students', label: 'Student Directory', icon: Users }
    ];

    return (
        <div className="ml-64 p-12 bg-slate-50 min-h-screen">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Admin Command Center</h1>
                    <p className="text-slate-500 text-lg font-medium">Manage aptitude content and monitor student performance.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 mb-4 animate-float-slow">
                        <Users size={24} />
                    </div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Total Students</h3>
                    <div className="text-4xl font-black text-slate-900">{overview.totalStudents}</div>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 mb-4 animate-float-slow" style={{ animationDelay: '1s' }}>
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Total Questions</h3>
                    <div className="text-4xl font-black text-slate-900">{overview.totalQuestions}</div>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 transition-all hover:shadow-md">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-500 mb-4 animate-float-slow" style={{ animationDelay: '2s' }}>
                        <ClipboardList size={24} />
                    </div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Tests Completed</h3>
                    <div className="text-4xl font-black text-slate-900">{overview.totalResults}</div>
                </div>
            </div>

            <div className="flex bg-white p-1.5 rounded-2xl gap-2 w-fit mb-8 border border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'questions' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700 w-80"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#4a54a4] text-white py-3.5 px-6 rounded-2xl font-bold hover:bg-[#3f4791] transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            <Plus size={20} /> Add New Question
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Question Text</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Difficulty</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {questions.map(q => (
                                    <tr key={q._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-8 py-6 max-w-lg">
                                            <p className="text-slate-900 font-bold leading-relaxed line-clamp-2 md:line-clamp-1">{q.questionText}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider">{q.category}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-500' : (q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600')
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingId(q._id); setFormData(q); setShowModal(true); }}
                                                    className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all active:scale-90"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q._id)}
                                                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'results' && (
                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Selection</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {results.map(r => (
                                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="font-extrabold text-slate-900 mb-0.5">{r.userId?.firstName} {r.userId?.lastName}</div>
                                        <div className="text-xs font-medium text-slate-400">{r.userId?.email}</div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="text-slate-700 font-bold text-sm tracking-tight">{r.category}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.difficulty} Mode</div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`text-2xl font-black ${r.score >= 70 ? 'text-emerald-500' : (r.score >= 40 ? 'text-amber-500' : 'text-red-500')
                                            }`}>
                                            {Math.round(r.score)}%
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.accuracy}% Accuracy</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-slate-400 text-sm font-bold">
                                            <Clock size={14} />
                                            {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(u => (u.role !== 'admin' || u._id !== overview.currentAdminId) && (
                                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6 font-extrabold text-slate-900">{u.firstName} {u.lastName}</td>
                                    <td className="px-8 py-6 text-slate-600 font-medium">{u.email}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-90"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{editingId ? 'Edit Challenge' : 'Create New Challenge'}</h2>
                                <p className="text-slate-500 font-medium text-sm tracking-tight uppercase">Aptitude Question Builder</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); setEditingId(null); }}
                                className="p-3 hover:bg-white hover:shadow-sm rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-10 py-8">
                            <form id="qForm" onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[2px] mb-2.5">Question Text</label>
                                    <textarea
                                        value={formData.questionText}
                                        onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-800 min-h-[100px]"
                                        placeholder="Type your question here..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-[2px] mb-2.5">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-700"
                                        >
                                            <option>Quantitative</option>
                                            <option>Logical</option>
                                            <option>Verbal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-[2px] mb-2.5">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-700"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[2px]">Configuration Options</label>
                                    {formData.options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-colors cursor-pointer ${formData.correctAnswer === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500'
                                                }`} onClick={() => setFormData({ ...formData, correctAnswer: idx })}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={e => {
                                                    const newOptions = [...formData.options];
                                                    newOptions[idx] = e.target.value;
                                                    setFormData({ ...formData, options: newOptions });
                                                }}
                                                placeholder={`Option ${String.fromCharCode(idx + 65)}`}
                                                className="flex-1 p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-700"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>

                        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button
                                form="qForm"
                                type="submit"
                                className="flex-1 bg-[#4a54a4] text-white py-4 rounded-2xl font-black text-lg transition-all hover:bg-[#3f4791] shadow-lg shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus size={24} />
                                {editingId ? 'Update Challenge' : 'Save Challenge'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowModal(false); setEditingId(null); }}
                                className="px-8 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black transition-all hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
