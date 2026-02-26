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
            return res.json({ totalTests: 0, avgScore: 0, latestScore: 0 });
        }

        const avgScore = results.reduce((acc, curr) => acc + curr.score, 0) / totalTests;
        const latestScore = results[0].score;

        res.json({
            totalTests,
            avgScore: avgScore.toFixed(2),
            latestScore
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
