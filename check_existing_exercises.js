require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

async function checkExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const exercises = await BlogPost.find({
            title: { $regex: /Exercice INT/ }
        }).sort({ title: 1 });

        console.log(`Found ${exercises.length} exercises.`);
        exercises.forEach(ex => console.log(ex.title));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkExercises();
