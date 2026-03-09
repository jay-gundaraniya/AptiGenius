import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, BarChart3, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStartPracticing = () => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            navigate('/register');
        }
    };

    const features = [
        {
            icon: <Brain size={22} />,
            title: 'Placement Readiness',
            description: 'AI-driven assessment of your current level and career growth potential.',
        },
        {
            icon: <Zap size={22} />,
            title: 'Adaptive Learning',
            description: 'Questions that adapt to your performance to optimize learning speed.',
        },
        {
            icon: <BarChart3 size={22} />,
            title: 'Detailed Analytics',
            description: 'Comprehensive breakdown of your accuracy across all categories.',
        },
        {
            icon: <BookOpen size={22} />,
            title: 'Study Modules',
            description: 'Curated resources and practice sets for campus placements.',
        },
    ];

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <Link to="/" className="landing-logo">
                    <div className="landing-logo-icon text-white">
                        <Brain size={18} />
                    </div>
                    <span className="landing-logo-text">AptiGenius</span>
                </Link>
                <div className="landing-nav-actions">
                    <Link to="/login" className="landing-nav-login">Log In</Link>
                    <Link to="/register" className="landing-nav-cta">Get Started</Link>
                </div>
            </nav>

            <section className="landing-hero">
                <div className="landing-hero-badge">
                    <Brain size={14} />
                    <span>Intelligent Placement Platform</span>
                </div>
                <h1 className="landing-hero-title">
                    Ace Your Next <span className="landing-hero-gradient">Placement Test</span>
                </h1>
                <p className="landing-hero-subtitle">
                    The most advanced platform for aptitude preparation. Practice with adaptive tests and get insights that matter.
                </p>
                <div className="landing-hero-actions">
                    <button onClick={handleStartPracticing} className="landing-btn-primary">
                        Get Started Free <ArrowRight size={18} />
                    </button>
                    <Link to="/login" className="landing-btn-secondary">
                        Candidate Login
                    </Link>
                </div>
            </section>

            <section className="landing-features">
                <div className="landing-features-inner">
                    <h2 className="landing-features-title">Designed for Excellence</h2>
                    <p className="landing-features-subtitle">
                        Everything you need to master your <span className="landing-features-highlight">technical and logical foundation</span> in one clean interface.
                    </p>

                    <div className="landing-features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="landing-feature-card">
                                <div className="landing-feature-icon">{feature.icon}</div>
                                <h3 className="landing-feature-title">{feature.title}</h3>
                                <p className="landing-feature-desc">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 AptiGenius Hub. Professional Aptitude Solutions.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
