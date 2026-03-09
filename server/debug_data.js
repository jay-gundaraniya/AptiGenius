const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Result = require('./models/Result');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const students = await User.find({ role: 'student' });
    const results = await Result.find();
    console.log(`Students Found: ${students.length}`);
    console.log(`Results Found: ${results.length}`);
    if (results.length > 0) {
        console.log(`Sample Result Keys: ${Object.keys(results[0].toObject())}`);
        console.log(`Sample Result category: ${results[0].category}`);
        console.log(`Sample Result accuracy: ${results[0].accuracy}`);
        console.log(`Sample Result createdAt: ${results[0].createdAt}`);
    }

    // Test the grouping
    const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
    results.forEach(r => {
        if (!r.createdAt) return;
        const date = new Date(r.createdAt);
        let dayIndex = date.getDay() - 1;
        if (dayIndex === -1) dayIndex = 6;
        weeklyActivity[dayIndex]++;
    });
    console.log(`Test Weekly Activity: [${weeklyActivity.join(', ')}]`);

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
