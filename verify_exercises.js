require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const Category = require('./models/Category');
const User = require('./models/User');

async function verifyExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const category = await Category.findOne({ name: 'Calcul intégral' });
        const allExercises = await BlogPost.find({ category: category._id }).sort({ title: 1 });

        console.log(`Found ${allExercises.length} exercises in "Calcul intégral":`);
        allExercises.forEach(ex => {
            console.log(`- Title: ${ex.title}`);
            console.log(`  Preview: ${ex.body.substring(0, 50).replace(/\n/g, ' ')}...`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

verifyExercises();
