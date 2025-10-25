// Database seeder script
// Usage: node scripts/seedDatabase.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-blog-database';

async function seedDatabase() {
    try {
        // Connect to database
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user if doesn't exist
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                username: 'admin',
                password: 'admin123', // Will be hashed by pre-save middleware
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Admin user created (username: admin, password: admin123)');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Create sample blog posts if none exist
        const postCount = await BlogPost.countDocuments();
        if (postCount === 0) {
            const samplePosts = [
                {
                    title: 'Welcome to Clean Blog',
                    body: 'This is a sample blog post to demonstrate the features of our clean blog platform. You can write **bold text**, *italic text*, and even include mathematical expressions like $E = mc^2$ or display equations: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$',
                    image: '/img/home-bg.jpg',
                    author: adminUser._id
                },
                {
                    title: 'Mathematics in Blogging',
                    body: 'With MathJax support, you can easily include complex mathematical expressions in your blog posts. For example: $$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$',
                    image: '/img/post-bg.jpg',
                    author: adminUser._id
                }
            ];

            for (const postData of samplePosts) {
                const post = new BlogPost(postData);
                await post.save();
            }
            console.log('✅ Sample blog posts created');
        }

        console.log('✅ Database seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();