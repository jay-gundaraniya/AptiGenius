import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, Trash2, Edit2, Users, BookOpen, ClipboardList, Clock,
    Search, X, Download, Eye, Filter, TrendingUp, BarChart2,
    AlertTriangle, Database, LayoutPanelTop
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip as ChartTooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTooltip,
);

const AdminPanel = ({ defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || 'dashboard');
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [studentStats, setStudentStats] = useState([]);
    const [filteredStudentStats, setFilteredStudentStats] = useState([]);
    const [overview, setOverview] = useState({
        totalStudents: 0,
        totalQuestions: 0,
        totalResults: 0,
        weakestTopic: { name: '---', accuracy: 0 },
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
        distribution: { High: 0, Medium: 0, Low: 0 }
    });

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [resultCategoryFilter, setResultCategoryFilter] = useState('');
    const [studentFilter, setStudentFilter] = useState('');

    // Student Details Modal
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentResults, setStudentResults] = useState([]);
    const [showStudentModal, setShowStudentModal] = useState(false);

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
        if (activeTab === 'students') fetchStudentStats();
    }, [activeTab]);

    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);

    // Filter questions when search/filters change
    useEffect(() => {
        let filtered = questions;
        if (searchQuery) {
            filtered = filtered.filter(q =>
                q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (categoryFilter) {
            filtered = filtered.filter(q => q.category === categoryFilter);
        }
        if (difficultyFilter) {
            filtered = filtered.filter(q => q.difficulty === difficultyFilter);
        }
        setFilteredQuestions(filtered);
    }, [questions, searchQuery, categoryFilter, difficultyFilter]);

    // Filter results
    useEffect(() => {
        let filtered = results;
        if (resultCategoryFilter) {
            filtered = filtered.filter(r => r.category === resultCategoryFilter);
        }
        if (studentFilter) {
            filtered = filtered.filter(r =>
                `${r.userId?.firstName} ${r.userId?.lastName}`.toLowerCase().includes(studentFilter.toLowerCase()) ||
                r.userId?.email?.toLowerCase().includes(studentFilter.toLowerCase())
            );
        }
        setFilteredResults(filtered);
    }, [results, resultCategoryFilter, studentFilter]);

    const fetchOverview = async () => {
        try {
            const res = await axios.get('/api/results/overview');
            console.log('Frontend Overview Data:', res.data);
            setOverview(res.data);
        } catch (err) {
            console.error('Error fetching admin overview:', err);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('/api/questions/all');
            setQuestions(res.data);
            setFilteredQuestions(res.data);
        } catch (err) {
            toast.error('Failed to load questions');
        }
    };

    const fetchResults = async () => {
        try {
            const res = await axios.get('/api/results/all');
            setResults(res.data);
            setFilteredResults(res.data);
        } catch (err) {
            toast.error('Failed to load results');
        }
    };

    const fetchStudentStats = async () => {
        try {
            const res = await axios.get('/api/results/students-stats');
            setStudentStats(res.data);
            setFilteredStudentStats(res.data);
        } catch (err) {
            toast.error('Failed to load student statistics');
        }
    };

    useEffect(() => {
        let filtered = studentStats;
        if (searchQuery) {
            filtered = filtered.filter(u =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredStudentStats(filtered);
    }, [studentStats, searchQuery]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to load students');
        }
    };

    const viewStudentDetails = async (student) => {
        setSelectedStudent(student);
        try {
            const res = await axios.get(`/api/auth/users/${student._id}`);
            setStudentResults(res.data.results || []);
            setShowStudentModal(true);
        } catch (err) {
            toast.error('Failed to load student details');
        }
    };

    const exportResultsToCSV = () => {
        const headers = ['Student Name', 'Email', 'Category', 'Difficulty', 'Score', 'Accuracy', 'Correct', 'Total', 'Date'];
        const csvData = filteredResults.map(r => [
            `${r.userId?.firstName} ${r.userId?.lastName}`,
            r.userId?.email,
            r.category,
            r.difficulty,
            Math.round(r.score),
            r.accuracy,
            r.correctAnswers,
            r.totalQuestions,
            new Date(r.createdAt).toLocaleDateString()
        ]);

        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test_results_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Results exported successfully');
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
        { id: 'dashboard', label: 'Dashboard', icon: LayoutPanelTop },
        { id: 'questions', label: 'Questions', icon: BookOpen },
        { id: 'results', label: 'Results', icon: ClipboardList },
        { id: 'students', label: 'Students', icon: Users }
    ];

    return (
        <div className="flex-1 p-8 ml-64 min-h-screen bg-slate-50/50 font-main">
            <header className="mb-10 text-left">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {activeTab === 'dashboard' ? 'Admin Dashboard' : (activeTab === 'questions' ? 'Questions Management' : (activeTab === 'students' ? 'Student Management' : 'Admin Panel'))}
                </h1>
                <p className="text-slate-400 font-medium mt-1">
                    {activeTab === 'dashboard' ? 'Platform overview and management' : (activeTab === 'questions' ? 'Add, edit, and curate your test question database.' : (activeTab === 'students' ? 'Monitor student performance and readiness metrics.' : 'Manage platform data.'))}
                </p>
            </header>

            {(!defaultTab && activeTab === 'dashboard') && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Metric Cards */}
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/10"></div>
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
                            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                                <Users size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mt-2">{overview.totalStudents}</div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500/10"></div>
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</span>
                            <div className="p-2 bg-teal-50 text-teal-500 rounded-xl group-hover:scale-110 transition-transform">
                                <Database size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mt-2">{overview.totalQuestions}</div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/10"></div>
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tests Taken</span>
                            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                                <ClipboardList size={16} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mt-2">{overview.totalResults}</div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/10"></div>
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weakest Topic</span>
                            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                                <AlertTriangle size={16} />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{overview.weakestTopic?.name || '---'}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Avg {overview.weakestTopic?.accuracy || 0}% accuracy</div>
                        </div>
                    </div>
                </div>
            )}

            {!defaultTab && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Platform Activity Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-800 tracking-tight">Platform Activity</h3>
                            <select className="bg-slate-50 border-none text-[10px] font-bold text-slate-400 uppercase px-3 py-1.5 rounded-lg outline-none">
                                <option>This Week</option>
                            </select>
                        </div>
                        <div className="h-[280px]">
                            <Bar
                                data={{
                                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                    datasets: [{
                                        data: overview.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
                                        backgroundColor: '#5046e5',
                                        borderRadius: 8,
                                        barThickness: 36,
                                        hoverBackgroundColor: '#4338ca'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: { color: '#f8fafc', drawTicks: false },
                                            border: { display: false },
                                            ticks: { color: '#94a3b8', font: { size: 10, weight: 'bold' } }
                                        },
                                        x: {
                                            grid: { display: false },
                                            border: { display: false },
                                            ticks: { color: '#94a3b8', font: { size: 10, weight: 'bold' } }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Readiness Distribution */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                        <h3 className="font-bold text-slate-800 tracking-tight mb-8">Readiness Distribution</h3>
                        <div className="flex-1 flex flex-col justify-center space-y-10">
                            {[
                                { label: 'High Readiness', count: overview.distribution?.High || 0, color: '#10b981' },
                                { label: 'Medium Readiness', count: overview.distribution?.Medium || 0, color: '#f59e0b' },
                                { label: 'Low Readiness', count: overview.distribution?.Low || 0, color: '#ef4444' }
                            ].map((item, idx) => {
                                const total = (overview.distribution?.High + overview.distribution?.Medium + overview.distribution?.Low) || 1;
                                const percentage = Math.round((item.count / total) * 100);
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-500 uppercase tracking-wider">{item.label}</span>
                                            <span className="text-slate-900">{item.count} students</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${percentage}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}


            {activeTab === 'questions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex items-center flex-1 max-w-sm">
                                <Search className="absolute left-3.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-medium"
                                />
                            </div>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 outline-none focus:border-indigo-600"
                            >
                                <option value="">All Categories</option>
                                <option value="Quantitative">Quantitative</option>
                                <option value="Logical">Logical</option>
                                <option value="Verbal">Verbal</option>
                            </select>
                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 outline-none focus:border-indigo-600"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
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
                                {filteredQuestions.map(q => (
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
                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center max-w-sm">
                                <Search className="absolute left-3.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by student..."
                                    value={studentFilter}
                                    onChange={(e) => setStudentFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-medium"
                                />
                            </div>
                            <select
                                value={resultCategoryFilter}
                                onChange={(e) => setResultCategoryFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 outline-none focus:border-indigo-600"
                            >
                                <option value="">All Categories</option>
                                <option value="Quantitative">Quantitative</option>
                                <option value="Logical">Logical</option>
                                <option value="Verbal">Verbal</option>
                            </select>
                        </div>
                        <button
                            onClick={exportResultsToCSV}
                            className="bg-emerald-600 text-white py-2.5 px-6 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-50 active:scale-95 text-sm"
                        >
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
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
                                {filteredResults.map(r => (
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
                </div>
            )}

            {activeTab === 'students' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex items-center flex-1 max-w-sm">
                                <Search className="absolute left-3.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Student</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Tests</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Avg Score</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Readiness</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudentStats.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{u.firstName} {u.lastName}</div>
                                            <div className="text-[11px] text-slate-400">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-600">{u.testCount}</td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-600">{u.avgScore}%</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${u.readinessLevel === 'High'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : u.readinessLevel === 'Medium'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                    : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {u.readinessLevel} Readiness
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => viewStudentDetails(u)}
                                                    className="p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
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

            {/* Student Details Modal */}
            {showStudentModal && selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                                <p className="text-sm text-slate-500">{selectedStudent.email}</p>
                            </div>
                            <button
                                onClick={() => { setShowStudentModal(false); setSelectedStudent(null); }}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Test History</h3>
                            {studentResults.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    No test results found for this student.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {studentResults.map(r => (
                                        <div key={r._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-slate-900">{r.category}</div>
                                                <div className="text-xs text-slate-400">{r.difficulty} • {new Date(r.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${r.score >= 70 ? 'text-emerald-600' : r.score >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {Math.round(r.score)}%
                                                </div>
                                                <div className="text-xs text-slate-400">{r.correctAnswers}/{r.totalQuestions} correct</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => { setShowStudentModal(false); setSelectedStudent(null); }}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
