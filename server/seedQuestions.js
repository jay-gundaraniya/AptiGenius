const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const questions = [];

const categories = ['Quantitative', 'Logical', 'Verbal'];
const difficulties = ['Easy', 'Medium', 'Hard'];

// Quantitative Templates
const quantTemplates = [
    { q: "What is {n1} + {n2}?", a: (n1, n2) => n1 + n2 },
    { q: "Subtract {n2} from {n1}.", a: (n1, n2) => n1 - n2 },
    { q: "What is {n1} multiplied by {n2}?", a: (n1, n2) => n1 * n2 },
    { q: "What is {n1}% of {n2}?", a: (n1, n2) => (n1 / 100) * n2 },
    { q: "A person travels at {n1} km/h for {n2} hours. What is the distance?", a: (n1, n2) => n1 * n2 },
    { q: "If the cost price of an item is {n1} and it is sold for {n2}, what is the profit?", a: (n1, n2) => n2 - n1 },
    { q: "Find the average of {n1}, {n2}, and {n3}.", a: (n1, n2, n3) => (n1 + n2 + n3) / 3 },
    { q: "What is the square of {n1}?", a: (n1) => n1 * n1 },
    { q: "If a car covers {n1} km in {n2} hours, what is its speed?", a: (n1, n2) => n1 / n2 },
    { q: "Find the simple interest on {n1} at {n2}% per annum for {n3} years.", a: (n1, n2, n3) => (n1 * n2 * n3) / 100 }
];

// Logical Templates
const logicalTemplates = [
    { q: "If A = 1, B = 2, C = 3, what is {word} in numeric code?", a: (word) => word.split('').map(c => c.charCodeAt(0) - 64).join('') },
    { q: "Identify the odd one out: {list}", a: (correct) => correct },
    { q: "Find the next number in the series: {series}", a: (next) => next },
    { q: "If 'BLUE' is coded as 'CMVF', how is '{word}' coded?", a: (word) => word.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('') },
    { q: "Point A is to the North of B. B is to the East of C. In which direction is A with respect to C?", a: "North-East" }
];

// Verbal Templates
const verbalTemplates = [
    { q: "Choose the synonym of '{word}':", a: (syn) => syn },
    { q: "Choose the antonym of '{word}':", a: (ant) => ant },
    { q: "Complete the sentence: 'The cat jumped ___ the wall.'", a: "over" },
    { q: "Identify the correctly spelled word:", a: (word) => word },
    { q: "What is the meaning of the idiom '{idiom}'?", a: (meaning) => meaning }
];

const generateQuestions = () => {
    let count = 0;
    while (count < 200) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
        let qText, options, correctIdx;

        if (cat === 'Quantitative') {
            const temp = quantTemplates[Math.floor(Math.random() * quantTemplates.length)];
            const n1 = Math.floor(Math.random() * 100) + 1;
            const n2 = Math.floor(Math.random() * 50) + 1;
            const n3 = Math.floor(Math.random() * 10) + 1;

            const ans = temp.a(n1, n2, n3);
            qText = temp.q.replace('{n1}', n1).replace('{n2}', n2).replace('{n3}', n3);

            options = [
                ans.toFixed(0),
                (ans + 5).toFixed(0),
                (ans - 3).toFixed(0),
                (ans * 1.5).toFixed(0)
            ].sort(() => Math.random() - 0.5);

            correctIdx = options.indexOf(ans.toFixed(0));
            if (correctIdx === -1) {
                options[0] = ans.toFixed(0);
                correctIdx = 0;
            }
        } else if (cat === 'Logical') {
            const words = ['ACE', 'BAD', 'CAT', 'DOG', 'EGG', 'FAN'];
            const word = words[Math.floor(Math.random() * words.length)];
            const temp = logicalTemplates[Math.floor(Math.random() * logicalTemplates.length)];

            if (temp.q.includes('{word}')) {
                const ans = temp.a(word);
                qText = temp.q.replace('{word}', word);
                options = [ans, ans + "X", "unknown", "none"].sort(() => Math.random() - 0.5);
                correctIdx = options.indexOf(ans);
            } else {
                qText = "Find the missing number in the sequence: 2, 4, 8, 16, ?";
                options = ["32", "24", "64", "20"];
                correctIdx = 0;
            }
        } else {
            const pairs = [
                { word: 'Abundant', syn: 'Plentiful', ant: 'Scarce' },
                { word: 'Benevolent', syn: 'Kind', ant: 'Malice' },
                { word: 'Candid', syn: 'Frank', ant: 'Deceptive' },
                { word: 'Diligent', syn: 'Hardworking', ant: 'Lazy' }
            ];
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const type = Math.random() > 0.5 ? 'syn' : 'ant';
            qText = `What is the ${type === 'syn' ? 'synonym' : 'antonym'} of '${pair.word}'?`;
            const ans = type === 'syn' ? pair.syn : pair.ant;
            options = [ans, 'Dull', 'Fast', 'Quiet'].sort(() => Math.random() - 0.5);
            correctIdx = options.indexOf(ans);
        }

        questions.push({
            questionText: qText,
            options: options.slice(0, 4),
            correctAnswer: correctIdx,
            category: cat,
            difficulty: diff
        });
        count++;
    }
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Question.deleteMany({}); // Clear existing questions
        console.log('Cleared existing questions');

        generateQuestions();
        await Question.insertMany(questions);
        console.log('Successfully seeded 200 questions!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
