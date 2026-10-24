require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const category = await Category.findOne({ name: /r[eé]duction des endomorphismes?/i });
        if (!category) {
            console.log('Category not found');
            process.exit(0);
        }
        console.log('Category:', category.name, category._id);
        const exercises = await BlogPost.find({ category: category._id }).sort('title');
        console.log(`Found ${exercises.length} exercises:`);
        for (const ex of exercises) {
            console.log(ex.title);
        }
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
check();
