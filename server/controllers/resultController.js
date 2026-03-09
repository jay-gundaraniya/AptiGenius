const Result = require('../models/Result');
const Question = require('../models/Question');
const User = require('../models/User');

exports.submitResult = async (req, res) => {
    try {
        const { score, totalQuestions, correctAnswers, category, difficulty, timeTaken } = req.body;
        const wrongAnswers = totalQuestions - correctAnswers;
        const accuracy = (correctAnswers / totalQuestions) * 100;

        const result = new Result({
            userId: req.user._id,
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            accuracy: accuracy.toFixed(2),
            category,
            difficulty,
            timeTaken: timeTaken || 0
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
        const students = await User.find({ role: 'student' });
        const results = await Result.find();

        // 1. Weekly Activity (Mon - Sun)
        const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        results.forEach(r => {
            const date = new Date(r.createdAt);
            let dayIndex = date.getDay() - 1; // 0 is Monday, -1 is Sunday
            if (dayIndex === -1) dayIndex = 6;
            weeklyActivity[dayIndex]++;
        });

        // 2. Readiness Distribution
        const distribution = { High: 0, Medium: 0, Low: 0 };
        students.forEach(student => {
            const studentResults = results.filter(r => r.userId?.toString() === student._id.toString());
            const testCount = studentResults.length;
            if (testCount === 0) {
                distribution.Low++;
                return;
            }
            const avgScore = studentResults.reduce((acc, r) => acc + (r.accuracy || 0), 0) / testCount;
            let readinessScore = Math.min(avgScore * 0.4, 40) + Math.min(testCount * 2, 20) + 10;
            if (readinessScore >= 60) distribution.High++;
            else if (readinessScore >= 35) distribution.Medium++;
            else distribution.Low++;
        });

        // 3. Weakest Topic
        const topicStats = {};
        results.forEach(r => {
            const category = r.category || 'Quantitative';
            if (!topicStats[category]) topicStats[category] = { total: 0, count: 0 };
            topicStats[category].total += r.accuracy;
            topicStats[category].count++;
        });

        let weakest = { name: 'N/A', accuracy: 0 };
        let minAcc = 101;
        Object.keys(topicStats).forEach(cat => {
            const avg = Math.round(topicStats[cat].total / topicStats[cat].count);
            if (avg < minAcc) {
                minAcc = avg;
                weakest = { name: cat, accuracy: avg };
            }
        });

        const overviewData = {
            totalStudents: students.length,
            totalQuestions,
            totalResults,
            weakestTopic: weakest,
            weeklyActivity,
            distribution
        };

        console.log('Sending Admin Overview:', overviewData);
        res.json(overviewData);
    } catch (error) {
        console.error('getAdminOverview Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// AI Readiness Score Calculation
exports.getAIReadiness = async (req, res) => {
    try {
        console.log('AI Readiness - User ID:', req.user?._id);
        const results = await Result.find({ userId: req.user._id }).sort({ createdAt: -1 });
        console.log('AI Readiness - Results found:', results.length);

        if (results.length === 0) {
            return res.json({
                readinessLevel: 'Low',
                readinessScore: 0,
                confidence: 0,
                avgScore: 0,
                avgAccuracy: 0,
                testCount: 0,
                improvementTrend: 'neutral',
                strengths: [],
                weaknesses: [],
                topicPerformance: [],
                recommendations: ['Take your first test to get AI analysis']
            });
        }

        const testCount = results.length;
        const avgAccuracy = results.reduce((acc, r) => acc + (r.accuracy || 0), 0) / testCount;
        const avgScore = results.reduce((acc, r) => acc + (r.score || 0), 0) / testCount;

        // Calculate improvement trend
        let improvementTrend = 'neutral';
        if (results.length >= 3) {
            const recent = results.slice(0, 3).reduce((acc, r) => acc + (r.accuracy || 0), 0) / 3;
            const older = results.slice(-3).reduce((acc, r) => acc + (r.accuracy || 0), 0) / Math.min(3, results.length);
            if (recent > older + 5) improvementTrend = 'improving';
            else if (recent < older - 5) improvementTrend = 'declining';
        }

        // Calculate topic-wise performance
        const topicStats = {};
        results.forEach(r => {
            const category = r.category || 'Mixed';
            if (!topicStats[category]) {
                topicStats[category] = { total: 0, count: 0 };
            }
            topicStats[category].total += r.accuracy || 0;
            topicStats[category].count += 1;
        });

        const topicPerformance = Object.keys(topicStats)
            .filter(cat => cat && cat !== 'undefined' && cat !== 'null')
            .map(cat => ({
                category: cat,
                accuracy: Math.round(topicStats[cat].total / topicStats[cat].count) || 0
            }));

        // Find strengths and weaknesses
        const strengths = topicPerformance
            .filter(t => t.accuracy >= 70 && t.category)
            .map(t => t.category);
        const weaknesses = topicPerformance
            .filter(t => t.accuracy < 50 && t.category)
            .map(t => t.category);

        // Calculate readiness score (0-100)
        let readinessScore = 0;
        readinessScore += Math.min(avgAccuracy * 0.4, 40); // 40% weight for accuracy
        readinessScore += Math.min(testCount * 2, 20); // 20% weight for test count (max 10 tests)
        readinessScore += improvementTrend === 'improving' ? 20 : (improvementTrend === 'neutral' ? 10 : 5); // 20% for trend
        readinessScore += Math.min(strengths.length * 10, 20); // 20% for strengths

        // Determine readiness level
        let readinessLevel = 'Low';
        if (readinessScore >= 70) readinessLevel = 'High';
        else if (readinessScore >= 40) readinessLevel = 'Medium';

        // Generate recommendations
        const recommendations = [];
        if (weaknesses.length > 0) {
            recommendations.push(`Focus on improving ${weaknesses.join(', ')}`);
        }
        if (testCount < 5) {
            recommendations.push('Take more practice tests to improve accuracy');
        }
        if (improvementTrend === 'declining') {
            recommendations.push('Review your recent mistakes and practice more');
        }
        if (avgAccuracy < 60) {
            recommendations.push('Work on fundamentals before attempting harder questions');
        }
        if (recommendations.length === 0) {
            recommendations.push('Keep up the great work!');
        }

        // Confidence level based on data availability
        const confidence = Math.min(testCount * 10 + 50, 95);

        res.json({
            readinessLevel,
            readinessScore: Math.round(readinessScore) || 0,
            confidence,
            avgScore: Math.round(avgScore) || 0,
            avgAccuracy: Math.round(avgAccuracy) || 0,
            testCount,
            improvementTrend,
            strengths: strengths || [],
            weaknesses: weaknesses || [],
            topicPerformance: topicPerformance || [],
            recommendations
        });
    } catch (error) {
        console.error('AI Readiness Error:', error);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
};

exports.getAllStudentsStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const students = await User.find({ role: 'student' }).select('-password');
        const results = await Result.find().sort({ createdAt: -1 });

        const studentStats = students.map(student => {
            const studentResults = results.filter(r => r.userId?.toString() === student._id.toString());
            const testCount = studentResults.length;

            if (testCount === 0) {
                return {
                    ...student.toObject(),
                    testCount: 0,
                    avgScore: 0,
                    readinessLevel: 'Low',
                    status: 'Active' // Mock status for now as per image
                };
            }

            const avgScore = Math.round(studentResults.reduce((acc, r) => acc + (r.accuracy || 0), 0) / testCount);

            // Calculate readiness (simplified logic from getAIReadiness)
            let readinessScore = 0;
            readinessScore += Math.min(avgScore * 0.4, 40);
            readinessScore += Math.min(testCount * 2, 20);

            // Improvement trend
            let improvementTrend = 'neutral';
            if (studentResults.length >= 3) {
                const recent = studentResults.slice(0, 3).reduce((acc, r) => acc + (r.accuracy || 0), 0) / 3;
                const older = studentResults.slice(-3).reduce((acc, r) => acc + (r.accuracy || 0), 0) / Math.min(3, studentResults.length);
                if (recent > older + 5) improvementTrend = 'improving';
                else if (recent < older - 5) improvementTrend = 'declining';
            }
            readinessScore += improvementTrend === 'improving' ? 20 : (improvementTrend === 'neutral' ? 10 : 5);

            let readinessLevel = 'Low';
            if (readinessScore >= 60) readinessLevel = 'High';
            else if (readinessScore >= 35) readinessLevel = 'Medium';

            return {
                ...student.toObject(),
                testCount,
                avgScore,
                readinessLevel,
                status: 'Active'
            };
        });

        res.json(studentStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
