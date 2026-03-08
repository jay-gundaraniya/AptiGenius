const Result = require('../models/Result');
const Question = require('../models/Question');

exports.submitResult = async (req, res) => {
    try {
        const { score, totalQuestions, correctAnswers, category, difficulty } = req.body;
        const accuracy = (correctAnswers / totalQuestions) * 100;

        const result = new Result({
            userId: req.user._id,
            score,
            totalQuestions,
            correctAnswers,
            accuracy: accuracy.toFixed(2),
            category,
            difficulty
        });

        await result.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserResults = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ createdAt: -1 });
        const totalTests = results.length;

        if (totalTests === 0) {
            return res.json({
                totalTests: 0,
                avgScore: 0,
                latestScore: 0,
                weakestTopic: 'Not Available',
                weakestTopicScore: 0,
                recentResults: [],
                topicPerformance: [],
                scoreTrend: []
            });
        }

        const avgScore = results.reduce((acc, curr) => acc + curr.accuracy, 0) / totalTests;
        const latestScore = results[0].accuracy;

        // Calculate Topic-wise Performance
        const topicStats = {};
        results.forEach(r => {
            if (!topicStats[r.category]) {
                topicStats[r.category] = { total: 0, count: 0 };
            }
            topicStats[r.category].total += r.accuracy;
            topicStats[r.category].count += 1;
        });

        const topicPerformance = Object.keys(topicStats).map(cat => ({
            category: cat,
            accuracy: Math.round(topicStats[cat].total / topicStats[cat].count)
        }));

        // Find Weakest Topic
        let weakestTopic = { category: 'None', accuracy: 101 };
        topicPerformance.forEach(tp => {
            if (tp.accuracy < weakestTopic.accuracy) {
                weakestTopic = tp;
            }
        });

        // Score Trend (Last 6 tests)
        const scoreTrend = results.slice(0, 6).reverse().map(r => ({
            date: new Date(r.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
            score: r.accuracy
        }));

        // Recent Results (Last 5)
        const recentResults = results.slice(0, 5).map(r => ({
            id: r._id,
            category: r.category,
            score: r.score,
            total: r.totalQuestions,
            accuracy: r.accuracy,
            time: '5m 10s', // Mock time for now
            date: new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        }));

        res.json({
            totalTests,
            avgScore: Math.round(avgScore),
            latestScore: Math.round(latestScore),
            weakestTopic: weakestTopic.category,
            weakestTopicScore: weakestTopic.accuracy,
            topicPerformance,
            scoreTrend,
            recentResults
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminOverview = async (req, res) => {
    try {
        const totalQuestions = await Question.countDocuments();
        const totalResults = await Result.countDocuments();
        const User = require('../models/User');
        const totalStudents = await User.countDocuments({ role: 'student' });

        res.json({
            totalStudents,
            totalQuestions,
            totalResults
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
