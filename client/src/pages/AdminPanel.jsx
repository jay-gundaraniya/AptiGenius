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
        { id: 'questions', label: 'Questions', icon: BookOpen },
        { id: 'results', label: 'Results', icon: ClipboardList },
        { id: 'students', label: 'Students', icon: Users }
    ];

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen bg-slate-50 font-main">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage test content and monitor student performance metrics.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 mb-4 font-bold">
                        <Users size={20} />
                    </div>
                    <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Students</h3>
                    <div className="text-3xl font-bold text-slate-900">{overview.totalStudents}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 mb-4 font-bold">
                        <BookOpen size={20} />
                    </div>
                    <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Questions</h3>
                    <div className="text-3xl font-bold text-slate-900">{overview.totalQuestions}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 mb-4 font-bold">
                        <ClipboardList size={20} />
                    </div>
                    <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Total Assessments</h3>
                    <div className="text-3xl font-bold text-slate-900">{overview.totalResults}</div>
                </div>
            </div>

            <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1 w-fit mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2.5 px-6 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'questions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative flex items-center flex-1 max-w-sm">
                            <Search className="absolute left-3.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-medium"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 text-white py-2.5 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-50 active:scale-95 text-sm"
                        >
                            <Plus size={18} /> Add Question
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Question Detail</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Category</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Difficulty</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {questions.map(q => (
                                    <tr key={q._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-slate-900 font-medium leading-relaxed line-clamp-1">{q.questionText}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{q.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-500' : (q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-600')
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingId(q._id); setFormData(q); setShowModal(true); }}
                                                    className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q._id)}
                                                    className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
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
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Student</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Test Type</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Results</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Completion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {results.map(r => (
                                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{r.userId?.firstName} {r.userId?.lastName}</div>
                                        <div className="text-[11px] text-slate-400">{r.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-slate-700 font-bold text-xs">{r.category}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{r.difficulty}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`text-lg font-bold ${r.score >= 70 ? 'text-emerald-500' : (r.score >= 40 ? 'text-amber-500' : 'text-red-500')
                                            }`}>
                                            {Math.round(r.score)}%
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">{r.accuracy}% Accuracy</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-slate-500 text-xs font-medium">
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
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Name</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Email</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Role</th>
                                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (u.role !== 'admin' || u._id !== overview.currentAdminId) && (
                                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{u.firstName} {u.lastName}</td>
                                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
                            <button
                                onClick={() => { setShowModal(false); setEditingId(null); }}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <form id="qForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Question Text</label>
                                    <textarea
                                        value={formData.questionText}
                                        onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                                        className="w-full p-3.5 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-600 transition-all text-sm font-medium text-slate-800 min-h-[100px]"
                                        placeholder="Enter the question text..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-xs"
                                        >
                                            <option>Quantitative</option>
                                            <option>Logical</option>
                                            <option>Verbal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-xs"
                                        >
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Options (Mark Correct One)</label>
                                    {formData.options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, correctAnswer: idx })}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all border ${formData.correctAnswer === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + idx)}
                                            </button>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={e => {
                                                    const newOptions = [...formData.options];
                                                    newOptions[idx] = e.target.value;
                                                    setFormData({ ...formData, options: newOptions });
                                                }}
                                                placeholder={`Option ${String.fromCharCode(idx + 65)}`}
                                                className="flex-1 p-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-indigo-600 transition-all text-sm font-medium"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>

                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                form="qForm"
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-indigo-700 shadow-sm active:scale-95"
                            >
                                {editingId ? 'Update Question' : 'Save Question'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowModal(false); setEditingId(null); }}
                                className="px-6 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all"
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
