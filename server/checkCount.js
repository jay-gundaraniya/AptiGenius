const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const checkCount = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Question.countDocuments();
        console.log(`Current Question Count: ${count}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCount();
