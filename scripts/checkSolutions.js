const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-blog-database';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const postsWithSolution = await BlogPost.find({ solutionId: { $ne: null } });
        console.log(`Found ${postsWithSolution.length} posts with solutions.`);
        if (postsWithSolution.length > 0) {
            console.log('Example post:', postsWithSolution[0].title);
        } else {
            console.log('No posts with solutions found.');
            // Create a dummy post with solution if needed, but for now just reporting.
            // Actually, let's create one if none exist to make verification easier.
            const newPost = await BlogPost.create({
                title: 'Test Exercise with Solution',
                body: 'This is a test exercise.',
                solutionId: new mongoose.Types.ObjectId(), // Dummy ID
                category: 'Test'
            });
            console.log('Created test post with solution:', newPost.title);
        }
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
