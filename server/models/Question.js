const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [v => v.length === 4, 'Question must have exactly 4 options']
    },
    correctAnswer: {
        type: Number,
        required: true, // index 0-3
    },
    category: {
        type: String,
        required: true,
        enum: ['Quantitative', 'Logical', 'Verbal']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
