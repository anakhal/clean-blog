require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

async function deleteExcessExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const allExercises = await BlogPost.find({ title: { $regex: /^Exercice INT \d+$/ } });

        let deletedCount = 0;
        for (const exercise of allExercises) {
            const match = exercise.title.match(/^Exercice INT (\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > 44) {
                    console.log(`Deleting ${exercise.title}...`);
                    await BlogPost.deleteOne({ _id: exercise._id });
                    deletedCount++;
                }
            }
        }

        console.log(`Deleted ${deletedCount} exercises.`);
        process.exit(0);
    } catch (error) {
        console.error('Error deleting exercises:', error);
        process.exit(1);
    }
}

deleteExcessExercises();
