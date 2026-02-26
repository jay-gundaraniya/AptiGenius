const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const questions = [
    {
        questionText: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        correctAnswer: 2,
        category: "Quantitative",
        difficulty: "Easy"
    },
    {
        questionText: "Which number comes next in the sequence: 2, 6, 12, 20, 30, ...?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1,
        category: "Logical",
        difficulty: "Medium"
    },
    {
        questionText: "Find the synonym of 'ABANDON'.",
        options: ["Keep", "Support", "Leave", "Adopt"],
        correctAnswer: 2,
        category: "Verbal",
        difficulty: "Easy"
    },
    {
        questionText: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        options: ["100 minutes", "50 minutes", "20 minutes", "5 minutes"],
        correctAnswer: 3,
        category: "Logical",
        difficulty: "Hard"
    },
    {
        questionText: "A train moves with a speed of 108 km/hr. Its speed in meters per second is:",
        options: ["25 m/s", "30 m/s", "35 m/s", "40 m/s"],
        correctAnswer: 1,
        category: "Quantitative",
        difficulty: "Medium"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        await Question.deleteMany({});
        console.log("Cleared existing questions.");

        await Question.insertMany(questions);
        console.log("Inserted sample questions.");

        mongoose.connection.close();
        console.log("Seeding completed successfully!");
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();
