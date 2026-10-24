require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

async function deleteAllExcess() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const allExercises = await BlogPost.find({ title: { $regex: /^Exercice INT \d+/ } });

        let deletedCount = 0;
        for (const exercise of allExercises) {
            const match = exercise.title.match(/^Exercice INT (\d+)(?:\s+.*)?$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > 44) {
                    console.log(`Deleting ${exercise.title}...`);
                    await BlogPost.deleteOne({ _id: exercise._id });
                    deletedCount++;
                }
            } else {
                console.log(`Warning: Could not parse title: ${exercise.title}`);
                // Try simpler parse
                const parts = exercise.title.split(' ');
                if (parts.length >= 3 && parts[2]) {
                    const num2 = parseInt(parts[2], 10);
                    if (num2 > 44) {
                        console.log(`Deleting ${exercise.title} (fallback match)...`);
                        await BlogPost.deleteOne({ _id: exercise._id });
                        deletedCount++;
                    }
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

deleteAllExcess();
