require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const hierarchy = {
    'Algèbre': [
        'Arithmétique',
        'Probabilités',
        'Nombres complexes',
        'Espaces vectoriels',
        'Structures algébriques'
    ],
    'Analyse': [
        'Limites et Continuité',
        'Suites numériques',
        'Dérivation et étude de fonctions'
    ]
};

async function seedHierarchicalCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const [parentName, childrenNames] of Object.entries(hierarchy)) {
            // Find or create Parent
            let parent = await Category.findOne({ name: parentName });
            if (!parent) {
                parent = await Category.create({ name: parentName });
                console.log(`✅ Created Parent Category: ${parentName}`);
            } else {
                console.log(`ℹ️  Parent Category already exists: ${parentName}`);
            }

            // Create Children
            for (const childName of childrenNames) {
                let child = await Category.findOne({ name: childName });
                if (!child) {
                    child = await Category.create({
                        name: childName,
                        parent: parent._id
                    });
                    console.log(`   ✅ Created Child Category: ${childName}`);
                } else {
                    // Update parent if it exists but assumes wrong parent or no parent
                    if (!child.parent || child.parent.toString() !== parent._id.toString()) {
                        child.parent = parent._id;
                        await child.save();
                        console.log(`   🔄 Updated Child Category parent: ${childName}`);
                    } else {
                        console.log(`   ℹ️  Child Category already up to date: ${childName}`);
                    }
                }
            }
        }

        console.log('✅ Hierarchical seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
}

seedHierarchicalCategories();
