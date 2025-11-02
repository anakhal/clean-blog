require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

async function migratePosts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update all posts without a category to have 'Arithmétique' as default
        const result = await BlogPost.updateMany(
            { category: { $exists: false } }, // Posts without category field
            { $set: { category: 'Arithmétique' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} posts with default category 'Arithmétique'`);

        // Show updated posts
        const posts = await BlogPost.find({}, { title: 1, category: 1 }).sort({ createdAt: 1 });
        console.log('\n📋 All posts after migration:');
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title} → ${post.category}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error migrating posts:', error);
        process.exit(1);
    }
}

migratePosts();
