require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const { slugify } = require('../models/BlogPost');

async function generateSlugs() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI is not set in environment or .env');
        process.exit(1);
    }

    if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
        console.error('❌ Veuillez remplacer <username> et <password> par vos vrais identifiants Firestore dans MONGODB_URI.');
        process.exit(1);
    }

    try {
        console.log('Connecting to Firestore (MongoDB compatibility)...');
        await mongoose.connect(mongoUri);
        console.log('Connected successfully.');

        const postsWithoutSlug = await BlogPost.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        }).select('_id title').lean();

        console.log(`Found ${postsWithoutSlug.length} posts without slugs.`);

        if (postsWithoutSlug.length === 0) {
            console.log('✅ All posts already have slugs.');
            await mongoose.disconnect();
            process.exit(0);
        }

        let updatedCount = 0;

        for (const post of postsWithoutSlug) {
            const base = slugify(post.title || 'exercice') || 'exercice';
            const suffix = post._id.toString().slice(-6);
            const slug = `${base}-${suffix}`;

            await BlogPost.updateOne(
                { _id: post._id },
                { $set: { slug } }
            );

            updatedCount++;
            if (updatedCount % 50 === 0 || updatedCount === postsWithoutSlug.length) {
                console.log(`Updated ${updatedCount}/${postsWithoutSlug.length} posts...`);
            }
        }

        console.log('✅ Slugs generation completed successfully.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error generating slugs:', err.message);
        process.exit(1);
    }
}

generateSlugs();
