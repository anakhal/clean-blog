const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const BlogPost = require('../models/BlogPost');
        const Category = require('../models/Category');

        // Check categories
        const categories = await Category.find();
        console.log('\n=== CATEGORIES ===');
        categories.forEach(cat => {
            console.log(`${cat.name} (${cat._id}) - Parent: ${cat.parent || 'None'}`);
        });

        // Check a few posts
        const posts = await BlogPost.find({ type: 'exercise' }).limit(5);
        console.log('\n=== SAMPLE POSTS ===');
        posts.forEach(post => {
            console.log(`Title: ${post.title}`);
            console.log(`Category: ${post.category} (type: ${typeof post.category})`);
            console.log('---');
        });

        // Count posts by category type
        const stringCategoryPosts = await BlogPost.countDocuments({
            category: { $type: 'string' }
        });
        const objectIdCategoryPosts = await BlogPost.countDocuments({
            category: { $type: 'objectId' }
        });

        console.log('\n=== POST STATS ===');
        console.log(`Posts with STRING category: ${stringCategoryPosts}`);
        console.log(`Posts with ObjectId category: ${objectIdCategoryPosts}`);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
