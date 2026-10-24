require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

async function fixCategoryMess() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Find all categories matching reduction des endomorph...
        const allMatched = await Category.find({ name: /r[eé]duction des endomorph/i });
        
        let oldCategory = null;
        let newCategory = null;

        for (const cat of allMatched) {
            if (cat.name === 'Réduction des endomorphismes') {
                newCategory = cat; // This is the one my script created
            } else {
                oldCategory = cat; // This is the original one with the typo (e.g. "Réduction des endomorphimes")
            }
        }

        if (!oldCategory || !newCategory) {
            console.error('❌ Could not clearly identify both the old and new categories.');
            console.log('Found categories:', allMatched.map(c => c.name));
            process.exit(1);
        }

        console.log(`✅ Identified Old Category: "${oldCategory.name}"`);
        console.log(`✅ Identified New Category: "${newCategory.name}"`);

        // Find all exercises in the old category
        const oldExercises = await BlogPost.find({ category: oldCategory._id });
        console.log(`ℹ️ Found ${oldExercises.length} exercises in the old category.`);

        let maxNum = 0;
        let prefix = "Exercice "; // Default fallback
        
        // Determine the highest number and prefix from old exercises
        oldExercises.forEach(ex => {
            const match = ex.title.match(/^(.*?)(\d+)$/);
            if (match) {
                const num = parseInt(match[2], 10);
                if (num > maxNum) {
                    maxNum = num;
                    prefix = match[1]; 
                }
            }
        });
        
        if (maxNum === 0 && oldExercises.length > 0) {
            console.log("⚠️ Could not determine prefix from old exercises via regex. Using 'Exercice '");
            maxNum = oldExercises.length; 
        }

        console.log(`ℹ️ Highest old exercise number is ${maxNum}. Prefix is "${prefix}".`);

        // Find all exercises in the new category
        const newExercises = await BlogPost.find({ category: newCategory._id });
        console.log(`ℹ️ Found ${newExercises.length} exercises in the new category to move.`);

        // Sort them logically by the number in their title (1 to 19)
        newExercises.sort((a, b) => {
            const numA = parseInt(a.title.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.title.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        // Move and rename them
        let counter = 1;
        for (const ex of newExercises) {
            const oldTitle = ex.title;
            const newTitle = `${prefix}${maxNum + counter}`;
            
            ex.title = newTitle;
            ex.category = oldCategory._id; // Move to the original category
            await ex.save();
            
            console.log(`🔄 Moved & Renamed: "${oldTitle}" ➡️ "${newTitle}"`);
            counter++;
        }

        // Delete the duplicate category now that it's empty
        await Category.deleteOne({ _id: newCategory._id });
        console.log(`✅ Deleted the duplicate category "${newCategory.name}".`);

        console.log('🎉 Fix completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixCategoryMess();
