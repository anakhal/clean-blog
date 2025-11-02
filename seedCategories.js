require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const initialCategories = [
    'Arithmétique',
    'Probabilités',
    'Nombres complexes',
    'Espaces vectoriels',
    'Structures algébriques'
];

async function seedCategories() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing categories (optional - remove if you want to keep existing ones)
        const count = await Category.countDocuments();
        if (count > 0) {
            console.log(`ℹ️  Found ${count} existing categories. Skipping seed...`);
            process.exit(0);
        }

        // Insert initial categories
        for (const catName of initialCategories) {
            const exists = await Category.findOne({ name: catName });
            if (!exists) {
                await Category.create({ name: catName });
                console.log(`✅ Created category: ${catName}`);
            } else {
                console.log(`ℹ️  Category already exists: ${catName}`);
            }
        }

        console.log('✅ Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
