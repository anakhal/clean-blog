const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const BlogPost = require('./models/BlogPost');
        const Category = require('./models/Category');

        // Test the same query as dashboard
        const query = {
            isDeleted: { $ne: true },
            type: 'exercise',
        };

        console.log('\n=== Dashboard Query Test ===');
        console.log('Query:', JSON.stringify(query, null, 2));

        const count = await BlogPost.countDocuments(query);
        console.log(`\nTotal exercises (not deleted): ${count}`);

        const recentPosts = await BlogPost.find(query)
            .populate('author', 'username')
            .populate('category')
            .populate('solutionId')
            .sort({ createdAt: 1 })
            .limit(10);

        console.log(`\nFirst 10 exercises:`);
        recentPosts.forEach((post, i) => {
            console.log(`${i + 1}. ${post.title}`);
            console.log(`   Category: ${post.category?.name || 'N/A'}`);
            console.log(`   Author: ${post.author?.username || 'N/A'}`);
            console.log(`   Has Solution: ${post.solutionId ? 'Yes' : 'No'}`);
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
