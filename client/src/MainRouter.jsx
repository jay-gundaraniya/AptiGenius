import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Shared Layout Component
import Sidebar from './components/Sidebar';

// Pages
import AppAuth from './App'; // Using existing login/signup
import Dashboard from './pages/Dashboard';
import MyTests from './pages/MyTests';
import StartTest from './pages/StartTest';
import TestInterface from './pages/TestInterface';
import ResultPage from './pages/ResultPage';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    if (!user) return <Navigate to="/auth" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-slate-50">
                {children}
            </main>
        </div>
    );
};

const MainRouter = () => {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/auth" element={<AppAuth />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/tests" element={
                        <ProtectedRoute>
                            <MyTests />
                        </ProtectedRoute>
                    } />

                    <Route path="/tests/start" element={
                        <ProtectedRoute>
                            <StartTest />
                        </ProtectedRoute>
                    } />

                    <Route path="/tests/run" element={
                        <ProtectedRoute>
                            <TestInterface />
                        </ProtectedRoute>
                    } />

                    <Route path="/tests/result/:resultId" element={
                        <ProtectedRoute>
                            <ResultPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default MainRouter;
