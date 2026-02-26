const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    category: String,
    difficulty: String
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
