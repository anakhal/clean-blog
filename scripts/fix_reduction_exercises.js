require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

async function fixExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Find the category
        const category = await Category.findOne({ name: /r[eé]duction des endomorphismes?/i });
        if (!category) {
            console.error('❌ Category not found');
            process.exit(1);
        }
        
        console.log(`✅ Found category: ${category.name}`);

        // Get all exercises in this category
        const allExercises = await BlogPost.find({ category: category._id });
        
        // Filter out the 19 new exercises I just created
        const newExerciseRegex = /^Exercice RED ([1-9]|1[0-9])$/;
        const oldExercises = allExercises.filter(ex => !newExerciseRegex.test(ex.title));
        const newExercises = allExercises.filter(ex => newExerciseRegex.test(ex.title));

        if (oldExercises.length === 0) {
            console.log('ℹ️ No older exercises found in this category. The new ones might be the only ones.');
            process.exit(0);
        }

        console.log(`ℹ️ Found ${oldExercises.length} existing older exercises.`);
        
        // Find the maximum number and the naming prefix from the old exercises
        let maxNum = 0;
        let prefix = "Exercice ";
        
        oldExercises.forEach(ex => {
            const match = ex.title.match(/^(.*?)(\d+)$/);
            if (match) {
                const num = parseInt(match[2], 10);
                if (num > maxNum) {
                    maxNum = num;
                    prefix = match[1]; // e.g. "Exercice " or "Exercice RED "
                }
            }
        });

        console.log(`ℹ️ The highest old exercise number is ${maxNum}. The prefix used is "${prefix}".`);

        // Rename the 19 new exercises to continue the numbering
        for (let i = 1; i <= 19; i++) {
            const oldTitle = `Exercice RED ${i}`;
            const newTitle = `${prefix}${maxNum + i}`;
            
            const exToRename = newExercises.find(e => e.title === oldTitle);
            if (exToRename) {
                exToRename.title = newTitle;
                await exToRename.save();
                console.log(`🔄 Renamed: "${oldTitle}" ➡️ "${newTitle}"`);
            }
        }

        console.log('🎉 Fix completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixExercises();
