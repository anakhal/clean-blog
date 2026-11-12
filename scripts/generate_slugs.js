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

    try {
        console.log('Connecting to database...');
        await mongoose.connect(mongoUri);
        console.log('Connected successfully.');

        const postsWithoutSlug = await BlogPost.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });

        console.log(`Found ${postsWithoutSlug.length} posts without slugs.`);

        if (postsWithoutSlug.length === 0) {
            console.log('✅ All posts already have slugs.');
            await mongoose.disconnect();
            process.exit(0);
        }

        let updatedCount = 0;
        const bulkOps = [];

        for (const post of postsWithoutSlug) {
            const base = slugify(post.title || 'exercice');
            const suffix = post._id.toString().slice(-6);
            const slug = `${base}-${suffix}`;

            bulkOps.push({
                updateOne: {
                    filter: { _id: post._id },
                    update: { $set: { slug } }
                }
            });

            updatedCount++;
            if (bulkOps.length >= 200) {
                await BlogPost.bulkWrite(bulkOps);
                console.log(`Updated ${updatedCount}/${postsWithoutSlug.length} posts...`);
                bulkOps.length = 0;
            }
        }

        if (bulkOps.length > 0) {
            await BlogPost.bulkWrite(bulkOps);
            console.log(`Updated ${updatedCount}/${postsWithoutSlug.length} posts.`);
        }

        console.log('✅ Slugs generation completed successfully.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error generating slugs:', err);
        process.exit(1);
    }
}

generateSlugs();
