const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        const Category = require('../models/Category');

        // Update Olympiades to be a parent category
        const olympiades = await Category.findOne({ name: 'Olympiades de mathématiques' });

        if (olympiades) {
            if (olympiades.parent) {
                olympiades.parent = null;
                await olympiades.save();
                console.log('✅ Updated "Olympiades de mathématiques" to be a parent category');
            } else {
                console.log('✓ "Olympiades de mathématiques" is already a parent category');
            }
        } else {
            console.log('⚠️  "Olympiades de mathématiques" not found, creating it...');
            await Category.create({
                name: 'Olympiades de mathématiques',
                parent: null
            });
            console.log('✅ Created "Olympiades de mathématiques" as parent category');
        }

        // Display all parent categories
        const parents = await Category.find({ parent: null }).sort({ name: 1 });
        console.log('\n📚 Parent Categories:');
        parents.forEach(cat => {
            console.log(`  - ${cat.name}`);
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
