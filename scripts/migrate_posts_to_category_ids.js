require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

async function migratePostsToCategoryIds() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Fetch all categories for lookup
        const categories = await Category.find({});
        const categoryMap = {}; // name -> _id
        categories.forEach(c => categoryMap[c.name] = c._id);

        console.log('ℹ️  Available Categories:', Object.keys(categoryMap));

        // Find posts with string categories (this might depend on how mongoose handles the type mismatch,
        // but since we request everything, we check the field type or try to map whatever is there)
        // Since schema is updated, mongoose might cast on find. 
        // We will fetch as lean or use a cursor to avoid immediate casting issues if possible, 
        // OR we just rely on the fact that existing string data is still in the DB.

        // Use lean() which bypasses Mongoose casting
        const posts = await BlogPost.find({}).lean();

        let updatedCount = 0;
        let errorCount = 0;

        for (const post of posts) {
            // Check if category is already an ObjectId (optimization)
            if (mongoose.Types.ObjectId.isValid(post.category) && post.category.toString() === categoryMap[post.category]?.toString()) {
                continue;
            }

            const categoryName = post.category; // currently a string string in DB

            if (typeof categoryName === 'string' && categoryMap[categoryName]) {
                const newCategoryId = categoryMap[categoryName];

                await BlogPost.updateOne(
                    { _id: post._id },
                    { $set: { category: newCategoryId } }
                );
                console.log(`✅ Migrated post "${post.title}": "${categoryName}" -> ${newCategoryId}`);
                updatedCount++;
            } else if (typeof categoryName === 'string') {
                console.warn(`⚠️  Could not find category for post "${post.title}" (Category: "${categoryName}")`);
                errorCount++;
            }
        }

        console.log(`\n🏁 Migration Finished.`);
        console.log(`   Updated: ${updatedCount} posts`);
        console.log(`   Errors/Skipped: ${errorCount} posts`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error migrating posts:', error);
        process.exit(1);
    }
}

migratePostsToCategoryIds();
